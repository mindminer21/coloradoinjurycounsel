import { NextRequest, NextResponse } from "next/server";
import { hlConfigured } from "@/lib/highlevel";
import { HL_TAG } from "@/lib/site";

export const runtime = "nodejs";

const HL_BASE = "https://services.leadconnectorhq.com";
const HL_VERSION = "2021-07-28";

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

// Parse a one-line "street, city, ST 80211" address into HighLevel's native fields.
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

// ——— Custom field: "AI Call Intake Details" (auto-provisioned, id cached per instance) ———
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
    const created = await hl(`/locations/${loc}/customFields`, {
      method: "POST",
      body: JSON.stringify({ name: "AI Call Intake Details", dataType: "LARGE_TEXT", model: "contact" }),
    });
    if (created.ok) {
      const data = (await created.json()) as { customField?: { id: string } };
      intakeFieldId = data?.customField?.id || null;
    } else {
      console.error("[retell] custom field create failed", created.status, await created.text().catch(() => ""));
    }
  } catch (e) {
    console.error("[retell] custom field provisioning failed", e);
  }
  return intakeFieldId;
}

/**
 * Retell post-call webhook → HighLevel contact.
 * Configure in Retell: webhook URL = https://<site>/api/retell/webhook?key=<RETELL_WEBHOOK_SECRET>
 * Fires on `call_analyzed` events; reads custom analysis data emitted per agent instructions.
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (!env("RETELL_WEBHOOK_SECRET") || url.searchParams.get("key") !== env("RETELL_WEBHOOK_SECRET")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const event = String(body.event || "");
  if (event !== "call_analyzed") return NextResponse.json({ ok: true, ignored: event });

  const call = (body.call || {}) as Record<string, unknown>;
  const analysis = (call.call_analysis || {}) as Record<string, unknown>;
  const custom = (analysis.custom_analysis_data || {}) as Record<string, unknown>;
  const s = (k: string, max = 300) => String(custom[k] ?? "").replace(/[<>]/g, "").trim().slice(0, max);

  const outcome = s("call_outcome", 40) || "unknown";
  // Skip pure noise; keep everything else (partial intakes still matter)
  if (["spam", "wrong_number"].includes(outcome)) {
    return NextResponse.json({ ok: true, skipped: outcome });
  }

  const fullName = s("caller_full_name", 120) || "Unknown Caller";
  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ") || "(from phone intake)";
  const phone = s("callback_phone", 30) || String(call.from_number || "");
  let email = s("email", 140).toLowerCase().trim();
  // normalize spoken forms: "jeff at schellip dot com" → "jeff@schellip.com"
  if (email && !email.includes("@")) {
    email = email.replace(/\s+at\s+/g, "@").replace(/\s+dot\s+/g, ".").replace(/\s+/g, "");
  }
  email = email.replace(/\s+/g, "");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!hlConfigured()) {
    console.error("[retell-dead-letter]", JSON.stringify({ at: new Date().toISOString(), reason: "hl_unconfigured", custom }));
    return NextResponse.json({ ok: true, crm: "unconfigured" });
  }

  const noteLines = [
    `AI Phone Intake (Retell) — ${new Date().toISOString()}`,
    `Call outcome: ${outcome} · Priority: ${s("priority", 20) || "standard"}`,
    s("currently_represented") ? `⚠ Currently represented: ${s("currently_represented")}` : null,
    s("wrongful_death") === "true" ? "⚠ Wrongful death matter — handle with care" : null,
    `Consent to contact: ${s("consent_to_contact", 10) || "not captured"}`,
    `Primary address (conflicts check / engagement letter): ${s("primary_address", 200) || "not provided"}`,
    "— Incident —",
    `Type: ${s("incident_type", 60)} · Date: ${s("incident_date", 60)} · Location: ${s("incident_location", 120)}`,
    `Description: ${s("incident_description", 800)}`,
    `Injuries: ${s("injuries", 400)}`,
    `Treatment: ${s("treatment_status", 200)}`,
    `Other party/insurance: ${s("other_party_known", 300)} · Recorded statement given: ${s("gave_recorded_statement", 20)}`,
    `Police report: ${s("police_report", 120)}`,
    `Caller is injured party: ${s("caller_is_injured_party", 120)}`,
    `How found us: ${s("how_found_us", 120)}`,
    "— Attorney summary —",
    s("summary", 1200),
    `Recording: ${String(call.recording_url || "n/a")}`,
  ].filter(Boolean);

  try {
    const fieldId = await getIntakeFieldId();
    const intakeDetails = noteLines.join("\n");
    const upsert = await hl(`/contacts/upsert`, {
      method: "POST",
      body: JSON.stringify({
        locationId: env("HIGHLEVEL_LOCATION_ID"),
        firstName,
        lastName,
        ...(emailOk ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...parseAddress(s("primary_address", 200)),
        source: "AI Phone Intake — Retell",
        tags: [HL_TAG, "AI Phone Intake", ...(s("priority") === "urgent" ? ["Urgent Review"] : [])],
        ...(fieldId ? { customFields: [{ id: fieldId, value: intakeDetails }] } : {}),
      }),
    });
    if (!upsert.ok) throw new Error(`upsert ${upsert.status}`);
    const data = (await upsert.json()) as { contact?: { id?: string } };
    const id = data?.contact?.id;
    if (id) {
      await hl(`/contacts/${id}/notes`, { method: "POST", body: JSON.stringify({ body: noteLines.join("\n") }) }).catch((e) =>
        console.error("[retell] note failed", e)
      );
    }
    return NextResponse.json({ ok: true, crm: "created", contactId: id });
  } catch (e) {
    console.error("[retell-dead-letter]", JSON.stringify({
      at: new Date().toISOString(), error: e instanceof Error ? e.message : String(e),
      fullName, phone, emailOk, outcome, custom,
    }));
    return NextResponse.json({ ok: true, crm: "failed" });
  }
}
