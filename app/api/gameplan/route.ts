import { NextRequest, NextResponse } from "next/server";
import { generateGamePlan, renderGamePlanText, type GamePlanInput } from "@/lib/gameplan";
import { hlConfigured } from "@/lib/highlevel";
import { HL_TAG, SITE } from "@/lib/site";

export const runtime = "nodejs";

const HL_BASE = "https://services.leadconnectorhq.com";
const HL_VERSION = "2021-07-28";
const GAMEPLAN_TAG = "PI Game Plan Lead"; // ← triggers the email-marketing workflow in HighLevel

function env(n: string) {
  const v = process.env[n];
  return v && v.trim() ? v.trim() : undefined;
}

async function hl(path: string, init: RequestInit, attempt = 1): Promise<Response> {
  const res = await fetch(`${HL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env("HIGHLEVEL_PIT")}`,
      Version: HL_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if ((res.status >= 500 || res.status === 429) && attempt < 3) {
    await new Promise((r) => setTimeout(r, attempt * 800));
    return hl(path, init, attempt + 1);
  }
  return res;
}

// "street, city, ST 80211" → HighLevel native address fields (same parser as the webhook)
function parseAddress(raw: string): { address1?: string; city?: string; state?: string; postalCode?: string } {
  if (!raw) return {};
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { address1: raw };
  const m = parts[parts.length - 1].match(/^([A-Za-z .]+?)?\s*(\d{5}(?:-\d{4})?)?$/);
  const state = m?.[1]?.trim() || undefined;
  const postalCode = m?.[2] || undefined;
  const city = parts.length >= 3 ? parts[parts.length - 2] : undefined;
  const address1 = parts.slice(0, Math.max(1, parts.length - (parts.length >= 3 ? 2 : 1))).join(", ");
  return { address1, ...(city ? { city } : {}), ...(state ? { state } : {}), ...(postalCode ? { postalCode } : {}) };
}

let intakeFieldId: string | null = null;
async function getIntakeFieldId(): Promise<string | null> {
  if (intakeFieldId) return intakeFieldId;
  try {
    const loc = env("HIGHLEVEL_LOCATION_ID");
    const list = await hl(`/locations/${loc}/customFields`, { method: "GET" });
    if (list.ok) {
      const data = (await list.json()) as { customFields?: Array<{ id: string; name: string }> };
      const found = (data.customFields || []).find((f) => f.name === "AI Call Intake Details");
      if (found) { intakeFieldId = found.id; return intakeFieldId; }
    }
  } catch { /* fall through */ }
  return null;
}

/** Best-effort: email the plan via HighLevel conversations. Falls back to the workflow if unsupported. */
async function emailPlan(contactId: string, firstName: string, planText: string): Promise<string> {
  try {
    const html =
      `<p>Hi ${firstName},</p><p>Here is the Claim Game Plan you just built on our site — keep it handy, and bring your questions to your free attorney follow-up.</p>` +
      `<pre style="font-family:Georgia,serif;white-space:pre-wrap;font-size:14px;line-height:1.6">${planText.replace(/[<>]/g, "")}</pre>` +
      `<p>Book your free attorney session: <a href="${SITE.calBookingUrl}">${SITE.calBookingUrl}</a><br/>Or call ${SITE.phone} — answered 24/7.</p>` +
      `<p>— Whiteford Mountain West<br/>${SITE.address.street}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}</p>`;
    const res = await hl(`/conversations/messages`, {
      method: "POST",
      body: JSON.stringify({
        type: "Email",
        contactId,
        subject: "Your Colorado Claim Game Plan — Whiteford Mountain West",
        html,
      }),
    });
    return res.ok ? "sent" : `deferred_${res.status}`; // deferred → the GHL workflow (trigger tag) delivers it
  } catch {
    return "deferred_error";
  }
}

async function triggerFollowupCall(p: { phone: string; firstName: string; incidentType: string }): Promise<string> {
  const key = env("RETELL_API_KEY");
  const agentId = env("RETELL_OUTBOUND_AGENT_ID");
  if (!key || !agentId) return "unconfigured";
  const now = new Date();
  const mt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Denver", hour12: false, weekday: "short", hour: "numeric" }).formatToParts(now);
  const weekday = mt.find((x) => x.type === "weekday")?.value || "";
  const hour = parseInt(mt.find((x) => x.type === "hour")?.value || "0", 10);
  if (weekday === "Sun" || hour < 8 || hour >= 19) return "outside_hours";
  const digits = p.phone.replace(/[^\d+]/g, "");
  const e164 = digits.startsWith("+") ? digits : `+1${digits.replace(/^1/, "")}`;
  if (!/^\+1\d{10}$/.test(e164)) return "bad_phone";
  const res = await fetch("https://api.retellai.com/v2/create-phone-call", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from_number: "+17208213784",
      to_number: e164,
      override_agent_id: agentId,
      retell_llm_dynamic_variables: { lead_first_name: p.firstName, incident_type: p.incidentType, page_path: "/game-plan" },
    }),
  });
  return res.ok ? "queued" : `failed_${res.status}`;
}

// naive per-instance rate limit
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.t > 10 * 60 * 1000) { hits.set(ip, { n: 1, t: now }); return false; }
  rec.n++;
  return rec.n > 6;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (s: unknown, max = 120) => String(s ?? "").replace(/[<>]/g, "").trim().slice(0, max);
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(String(v)) ? (String(v) as T) : fallback;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }

  // honeypot
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const c = (body.contact || {}) as Record<string, unknown>;
  const firstName = clean(c.firstName, 60);
  const lastName = clean(c.lastName, 60);
  const email = clean(c.email, 140).toLowerCase();
  const phone = clean(c.phone, 30);
  const address = clean(c.address, 200);
  if (!firstName || !lastName || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_contact" }, { status: 400 });
  }

  const a = (body.answers || {}) as Record<string, unknown>;
  const input: GamePlanInput = {
    incidentType: pick(a.incidentType, ["car","truck","motorcycle","pedestrian","bicycle","rideshare","slip-fall","dog-bite","ski","work","other"] as const, "other"),
    timeSince: pick(a.timeSince, ["under-6mo","6-12mo","1-2yr","2-3yr","over-3yr"] as const, "under-6mo"),
    govInvolved: pick(a.govInvolved, ["yes","no","unsure"] as const, "no"),
    injuries: pick(a.injuries, ["soft-tissue","fractures","head-spine","catastrophic","unsure"] as const, "unsure"),
    treatment: pick(a.treatment, ["none","er-only","ongoing","surgery","hospitalized"] as const, "none"),
    faultPicture: pick(a.faultPicture, ["other-clear","shared","disputed","unknown"] as const, "unknown"),
    insurerContact: pick(a.insurerContact, ["none","reported-only","adjuster-calls","gave-statement","offer-received"] as const, "none"),
    evidence: Array.isArray(a.evidence) ? (a.evidence as unknown[]).map((e) => clean(e, 40)).slice(0, 8) : [],
    workImpact: pick(a.workImpact, ["none","missed-some","still-out","cant-return"] as const, "none"),
    county: clean(a.county, 60),
  };

  const plan = generateGamePlan(input);
  const planText = renderGamePlanText(plan);

  let crm: string = "unconfigured";
  let emailStatus = "skipped";
  if (hlConfigured()) {
    try {
      const fieldId = await getIntakeFieldId();
      const noteBody = [
        `CLAIM GAME PLAN LEAD (website) — ${new Date().toISOString()}`,
        `Primary address (conflicts check / engagement letter): ${address || "not provided"}`,
        `Evidence in hand: ${input.evidence.join(", ") || "none reported"}`,
        `Answers: ${JSON.stringify(input)}`,
        "— Generated Game Plan (as delivered to lead) —",
        planText,
      ].join("\n");
      const upsert = await hl(`/contacts/upsert`, {
        method: "POST",
        body: JSON.stringify({
          locationId: env("HIGHLEVEL_LOCATION_ID"),
          firstName, lastName, email,
          ...(phone ? { phone } : {}),
          ...parseAddress(address),
          source: "Claim Game Plan — website lead magnet",
          tags: [HL_TAG, GAMEPLAN_TAG, ...(plan.issues.some((i) => i.urgent) ? ["Urgent Review"] : [])],
          ...(fieldId ? { customFields: [{ id: fieldId, value: noteBody }] } : {}),
        }),
      });
      if (!upsert.ok) throw new Error(`upsert ${upsert.status}`);
      const data = (await upsert.json()) as { contact?: { id?: string } };
      const id = data?.contact?.id;
      crm = "created";
      if (id) {
        await hl(`/contacts/${id}/notes`, { method: "POST", body: JSON.stringify({ body: noteBody }) }).catch(() => null);
        emailStatus = await emailPlan(id, firstName, planText);
      }
    } catch (e) {
      crm = "failed";
      console.error("[gameplan-dead-letter]", JSON.stringify({
        at: new Date().toISOString(), email, firstName, lastName, phone, address, input,
        error: e instanceof Error ? e.message : String(e),
      }));
    }
  } else {
    console.error("[gameplan-dead-letter]", JSON.stringify({ at: new Date().toISOString(), reason: "hl_unconfigured", email, input }));
  }

  let followup = "skipped";
  if (phone) {
    try { followup = await triggerFollowupCall({ phone, firstName, incidentType: input.incidentType }); }
    catch { followup = "error"; }
  }

  return NextResponse.json({ ok: true, plan, crm, emailStatus, followup });
}
