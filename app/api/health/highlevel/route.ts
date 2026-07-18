import { NextRequest, NextResponse } from "next/server";
import { hlConfigured, getLocationName, createLead, getContact } from "@/lib/highlevel";

async function searchContacts(query: string): Promise<unknown> {
  const res = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${process.env.HIGHLEVEL_LOCATION_ID}&query=${encodeURIComponent(query)}&limit=5`,
    { headers: { Authorization: `Bearer ${process.env.HIGHLEVEL_PIT}`, Version: "2021-07-28", Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const data = (await res.json()) as { contacts?: Array<Record<string, unknown>> };
  return (data.contacts || []).map((c) => ({
    id: c.id, name: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(), email: c.email, phone: c.phone, tags: c.tags, source: c.source, dateAdded: c.dateAdded,
  }));
}

export const runtime = "nodejs";

/**
 * Diagnostic endpoint (safe: exposes no secrets).
 * GET /api/health/highlevel                   → config + location reachability
 * GET /api/health/highlevel?verify=tag&key=X  → creates a test contact, reads back tags (X must match HEALTH_KEY env)
 */
export async function GET(req: NextRequest) {
  if (!hlConfigured()) {
    return NextResponse.json({ configured: false, hint: "Set HIGHLEVEL_PIT and HIGHLEVEL_LOCATION_ID in Vercel env, then redeploy." });
  }
  const url = new URL(req.url);
  const verify = url.searchParams.get("verify");
  const key = url.searchParams.get("key");
  const find = url.searchParams.get("find");

  try {
    if (find && key && key === process.env.HEALTH_KEY) {
      return NextResponse.json({ query: find, results: await searchContacts(find) });
    }
    const locationName = await getLocationName();
    if (verify === "tag" && key && key === process.env.HEALTH_KEY) {
      const { contactId } = await createLead({
        firstName: "Test",
        lastName: "EstimatorVerification",
        email: `estimator-verify+${Date.now()}@schellip.com`,
        pagePath: "/api/health/highlevel",
        answers: { note: "automated tag verification — safe to delete" },
        band: { low: 0, high: 0, qualifier: "test" },
      });
      const contact = (await getContact(contactId)) as { contact?: { tags?: string[] } };
      return NextResponse.json({
        configured: true,
        locationName,
        verification: { contactId, tags: contact?.contact?.tags ?? [], note: "Test contact created — delete from HighLevel when convenient" },
      });
    }
    return NextResponse.json({ configured: true, reachable: true, locationName });
  } catch (e) {
    return NextResponse.json({ configured: true, reachable: false, error: e instanceof Error ? e.message : "unknown" }, { status: 502 });
  }
}
