import { HL_TAG } from "./site";

const HL_BASE = "https://services.leadconnectorhq.com";
const HL_VERSION = "2021-07-28";

export type LeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  pagePath: string;
  primaryKeyword?: string;
  utm?: Record<string, string>;
  answers: Record<string, string>;
  band: { low: number; high: number; qualifier: string };
};

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export function hlConfigured(): boolean {
  return Boolean(env("HIGHLEVEL_PIT") && env("HIGHLEVEL_LOCATION_ID"));
}

async function hlFetch(path: string, init: RequestInit, attempt = 1): Promise<Response> {
  const res = await fetch(`${HL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env("HIGHLEVEL_PIT")}`,
      Version: HL_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  if ((res.status >= 500 || res.status === 429) && attempt < 3) {
    await new Promise((r) => setTimeout(r, attempt * 800));
    return hlFetch(path, init, attempt + 1);
  }
  return res;
}

/** Create (upsert) contact with tag + estimator summary note. Throws on hard failure. */
export async function createLead(p: LeadPayload): Promise<{ contactId: string }> {
  const locationId = env("HIGHLEVEL_LOCATION_ID")!;
  const summaryLines = [
    `Case Estimator submission — ${new Date().toISOString()}`,
    `Page: ${p.pagePath}`,
    p.primaryKeyword ? `Keyword: ${p.primaryKeyword}` : null,
    p.utm && Object.keys(p.utm).length ? `UTM: ${JSON.stringify(p.utm)}` : null,
    `Educational band shown: $${p.band.low.toLocaleString()}–$${p.band.high.toLocaleString()} (${p.band.qualifier})`,
    `— Answers —`,
    ...Object.entries(p.answers).map(([k, v]) => `${k}: ${v}`),
  ].filter(Boolean);

  const upsert = await hlFetch(`/contacts/upsert`, {
    method: "POST",
    body: JSON.stringify({
      locationId,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      ...(p.phone ? { phone: p.phone } : {}),
      source: `PI Site — ${p.pagePath}`,
      tags: [HL_TAG],
    }),
  });
  if (!upsert.ok) throw new Error(`HL upsert failed: ${upsert.status} ${await upsert.text().catch(() => "")}`);
  const data = (await upsert.json()) as { contact?: { id?: string } };
  const contactId = data?.contact?.id;
  if (!contactId) throw new Error("HL upsert returned no contact id");

  // Attach full answers as a note (best-effort; do not fail the lead on note failure)
  try {
    await hlFetch(`/contacts/${contactId}/notes`, {
      method: "POST",
      body: JSON.stringify({ body: summaryLines.join("\n") }),
    });
  } catch (e) {
    console.error("[hl] note attach failed", e);
  }
  return { contactId };
}

/** Read back a contact to verify tag application (used by health verification). */
export async function getContact(contactId: string): Promise<unknown> {
  const res = await hlFetch(`/contacts/${contactId}`, { method: "GET" });
  if (!res.ok) throw new Error(`HL get contact failed: ${res.status}`);
  return res.json();
}

export async function getLocationName(): Promise<string> {
  const res = await hlFetch(`/locations/${env("HIGHLEVEL_LOCATION_ID")}`, { method: "GET" });
  if (!res.ok) throw new Error(`HL location fetch failed: ${res.status}`);
  const data = (await res.json()) as { location?: { name?: string } };
  return data?.location?.name || "unknown";
}
