const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

// Brand
const NAVY = "003756", DEEP = "02243A", INK = "021B2C", PAPER = "F7F5F1", GOLD = "C6A15B", SKY = "8FB8D4", SLATE = "3E6079", WHITE = "FFFFFF";
const W = 13.3, H = 7.5;

function darkSlide(title, eyebrow) {
  const s = pres.addSlide();
  s.background = { color: DEEP };
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: 0.7, y: 0.45, w: 11.9, h: 0.35, fontSize: 12, color: GOLD, charSpacing: 3, fontFace: "Georgia", bold: true });
  if (title) s.addText(title, { x: 0.7, y: 0.8, w: 11.9, h: 0.9, fontSize: 30, color: WHITE, fontFace: "Georgia", bold: false });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 1.72, w: 1.1, h: 0.045, fill: { color: GOLD } });
  return s;
}
function lightSlide(title, eyebrow) {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: 0.7, y: 0.45, w: 11.9, h: 0.35, fontSize: 12, color: SLATE, charSpacing: 3, fontFace: "Georgia", bold: true });
  if (title) s.addText(title, { x: 0.7, y: 0.8, w: 11.9, h: 0.9, fontSize: 30, color: NAVY, fontFace: "Georgia" });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 1.72, w: 1.1, h: 0.045, fill: { color: GOLD } });
  return s;
}
function bullets(s, items, opts = {}) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: opts.gap ?? 10 } })),
    { x: opts.x ?? 0.7, y: opts.y ?? 2.1, w: opts.w ?? 11.9, h: opts.h ?? 4.8, fontSize: opts.size ?? 15, color: opts.color ?? INK, fontFace: "Calibri", lineSpacingMultiple: 1.12, valign: "top" });
}
function card(s, x, y, w, h, head, body, dark = false) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.04, fill: { color: dark ? NAVY : WHITE }, line: { color: dark ? "1A4A66" : "D9D4CA", width: 0.75 } });
  s.addShape(pres.ShapeType.rect, { x, y, w, h: 0.05, fill: { color: GOLD } });
  s.addText(head, { x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.5, fontSize: 15, bold: true, color: dark ? "D9BC85" : NAVY, fontFace: "Georgia", margin: 0 });
  s.addText(body, { x: x + 0.18, y: y + 0.6, w: w - 0.36, h: h - 0.75, fontSize: 12.5, color: dark ? "E8E4DC" : "37424C", fontFace: "Calibri", lineSpacingMultiple: 1.1, valign: "top", margin: 0 });
}

// ———————— 1. Title
{
  const s = pres.addSlide();
  s.background = { color: DEEP };
  s.addShape(pres.ShapeType.rect, { x: 0, y: H - 1.15, w: W, h: 1.15, fill: { color: INK } });
  s.addText("WHITEFORD", { x: 0.7, y: 0.6, w: 3.4, h: 0.6, fontSize: 24, color: WHITE, fontFace: "Georgia", charSpacing: 5 });
  s.addShape(pres.ShapeType.rect, { x: 0.72, y: 1.18, w: 2.55, h: 0.02, fill: { color: GOLD } });
  s.addText("Mountain West · Personal Injury", { x: 0.7, y: 1.24, w: 4.5, h: 0.3, fontSize: 12, color: SKY, fontFace: "Georgia", italic: true });
  s.addText("Colorado PI Acquisition:\nTraffic & Lead Strategy", { x: 0.7, y: 2.5, w: 11.5, h: 1.9, fontSize: 44, color: WHITE, fontFace: "Georgia" });
  s.addText("Owned-asset growth engineered around Colorado's 2025–26 legal shifts\nPrepared for Brian Thackston · Digital Marketing Strategy · " + new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }), { x: 0.7, y: 4.6, w: 11, h: 0.9, fontSize: 16, color: "B9C6D0", fontFace: "Calibri", lineSpacingMultiple: 1.25 });
  s.addText("CONFIDENTIAL — INTERNAL DRAFT · PENDING ATTORNEY REVIEW", { x: 0.7, y: H - 0.85, w: 11.9, h: 0.4, fontSize: 10.5, color: GOLD, charSpacing: 2, fontFace: "Calibri" });
}

// ———————— 2. Why now
{
  const s = darkSlide("Two Colorado laws just redrew the market", "Why now");
  card(s, 0.7, 2.1, 5.95, 2.3, "HB24-1472 — caps raised (2025)", "Non-economic damages cap rose to $1.5M for most tort actions filed on/after Jan 1, 2025 ($2.125M wrongful death; biennial inflation adjustment from 2028).\n\nSerious cases are being valued under new math — education converts.", true);
  card(s, 6.85, 2.1, 5.75, 2.3, "SB26-174 — lead-buying banned (Aug 2026)", "Third-party legal lead generation becomes a deceptive trade practice. Competitors renting pipeline from lead brokers lose supply.\n\nOwned organic + first-party lead capture is the compliant moat.", true);
  s.addText("Strategic conclusion: every dollar goes into assets we own — rankings, list, brand — not rented leads.", { x: 0.7, y: 4.75, w: 11.9, h: 0.6, fontSize: 17, color: "D9BC85", fontFace: "Georgia", italic: true });
  s.addText("Sources: leg.colorado.gov/bills/hb24-1472 · leg.colorado.gov/bills/SB26-174", { x: 0.7, y: 6.8, w: 11.9, h: 0.3, fontSize: 10, color: "7E93A3", fontFace: "Calibri" });
}

// ———————— 3. What's already live
{
  const s = lightSlide("The asset stack is already built and live", "Current state");
  card(s, 0.7, 2.05, 3.95, 2.15, "100 SEO landing pages", "Opportunity-ranked Colorado PI keywords across 6 intent clusters. Unique content, FAQ + LegalService schema, 11-point QA passed, CWV-friendly static build.");
  card(s, 4.8, 2.05, 3.95, 2.15, "Case-value estimator", "8-question educational tool → name/email gate → range with disclaimers. Every submission lands in GHL tagged + source-attributed (UTMs, page, keyword).");
  card(s, 8.9, 2.05, 3.7, 2.15, "“Sky” AI phone intake", "24/7 voice agent on (720) 821-3784: compliant intake, live Cal.com booking, recording + structured summary to GHL. Outbound speed-to-lead calls new estimator leads in minutes.");
  card(s, 0.7, 4.4, 3.95, 2.15, "CRM rails (GHL)", "Tag: “Colorado Personal Injury Lead” + “AI Phone Intake” / “Urgent Review.” Full intake note, recording link, source fields on every contact. Dead-letter logging — no lead silently lost.");
  card(s, 4.8, 4.4, 3.95, 2.15, "Brand + creative", "Premium mountain-west design system, real attorney bios linked to whitefordlaw.com, scroll-driven courtroom film (labeled dramatization) for site + future ads.");
  card(s, 8.9, 4.4, 3.7, 2.15, "Production", "whiteford-mountain-west-injury.vercel.app · sitemap (106 URLs) · needs: GSC submission, brand domain decision.");
}

// ———————— 4. Funnel
{
  const s = darkSlide("One funnel, two front doors, everything owned", "Architecture");
  const steps = [
    ["TRAFFIC", "SEO · content · earned media · paid (gated)"],
    ["BRIDGE", "100 intent-matched landing pages (warm) · story pages (cold)"],
    ["CAPTURE", "Estimator “Snapshot”  ·  Sky phone intake 24/7"],
    ["FOLLOW-UP", "5-email sequence · Sky outbound call · retargeting"],
    ["CONVERT", "“Claim Game Plan Session” (Cal.com) → engagement"],
  ];
  let x = 0.7;
  const w = 2.28, gap = 0.14;
  steps.forEach(([h, b], i) => {
    card(s, x, 2.3, w, 2.5, h, b, true);
    if (i < steps.length - 1) s.addText("→", { x: x + w - 0.02, y: 3.25, w: gap + 0.04, h: 0.4, fontSize: 16, color: GOLD, align: "center", margin: 0 });
    x += w + gap;
  });
  bullets(s, [
    "Traffic-temperature mapping (DotCom Secrets): hot → home/estimator · warm search → matching landing page · cold social → story-first bridge pages (to build)",
    "81% of conversions happen at contact 5+ — the follow-up layer is where the compounding happens (email + AI callback + retargeting)",
    "Everything converts toward traffic we OWN: the tagged, attributed GHL list",
  ], { y: 5.1, size: 13.5, color: "E8E4DC", gap: 7 });
}

// ———————— 5. Economics
{
  const s = lightSlide("The math that governs every channel", "Unit economics");
  const rows = [
    [{ text: "Metric", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "Planning figure", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "Basis", options: { bold: true, color: WHITE, fill: { color: NAVY } } }],
    ["Blended gross fee / signed case", "$12,000 (conservative)", "Mix of soft-tissue + serious; validate vs. firm data"],
    ["LTGP : CAC floor", "3 : 1", "Hormozi scale threshold"],
    ["Max cost per signed case", "≈ $4,000", "Fee ÷ 3"],
    ["Qualified leads per signed case", "6–8", "50–60% lead→consult × 25–40% consult→sign"],
    ["Target blended cost / qualified lead", "≤ $500", "Ceiling ÷ leads-per-case; organic pulls blend far lower"],
    ["Cash reality", "Patient capital", "Contingency fees lag spend 12–18 mo — organic first, paid gated"],
  ];
  s.addTable(rows, { x: 0.7, y: 2.15, w: 11.9, colW: [4.2, 3.0, 4.7], fontSize: 13, fontFace: "Calibri", color: INK, border: { pt: 0.5, color: "D9D4CA" }, fill: { color: WHITE }, rowH: 0.52, valign: "middle", margin: 0.08 });
  s.addText("Every channel is measured on cost per signed case — attribution rails (UTM → GHL) are already live.", { x: 0.7, y: 6.35, w: 11.9, h: 0.5, fontSize: 14, color: SLATE, italic: true, fontFace: "Calibri" });
}

// ———————— 6. Offer layer
{
  const s = lightSlide("Fix the offer before buying traffic ($100M Offers)", "Offer layer");
  card(s, 0.7, 2.05, 5.95, 2.2, "Lead magnet — “Colorado Case Value Snapshot”", "Free 2-minute educational read on what drives cases like yours under the 2025 damages law. Reason-why + avatar + interval + container naming. Already built — this is the wrapper.");
  card(s, 6.85, 2.05, 5.75, 2.2, "Consultation — “Claim Game Plan Session”", "Named, stacked, concrete: deadline check · evidence-preservation checklist · straight answer on whether counsel is warranted · insurer-conversation briefing. Not another “free consultation.”");
  card(s, 0.7, 4.45, 5.95, 2.1, "The guarantee (law-native)", "“You pay no fee unless we recover for you.” The contingency structure IS the strongest trust lever — lead with it everywhere. (Attorney review: costs-vs-fees disclosure.)");
  card(s, 6.85, 4.45, 5.75, 2.1, "The Big Domino (one belief, everywhere)", "“Insurers pay full value only to claimants prepared to go to trial — and trial preparation is what a national platform provides from day one.” Masten's insurer-defense past is the proof story.");
}

// ———————— 7. Organic engines
{
  const s = darkSlide("Organic engines (months 1–2, $0 media)", "Traffic — earned & owned");
  bullets(s, [
    "Finish owned search: GSC submission · brand domain · GBP + review engine · legal/local directory profile layer (profiles only — no lead-gen products)",
    "Content engine: one weekly “master show” video (false-belief topics, hook-story-offer) → Shorts, landing-page embeds, weekly email, GBP posts · give:ask ≥ 3.5:1",
    "Dream 100 — Colorado edition (earned only): safety-beat reporters, CO podcasts, ski/cycling communities, adjacent professionals — relationship + education, never paid referrals (RPC 7.2)",
    "Warm outreach: Jeff's one-time network announcement + quarterly story · costs nothing, converts highest",
    "Newsjack asset: the 2025 damages-cap change is genuinely newsworthy — pitch as education, not promotion",
  ], { size: 15, color: "E8E4DC", gap: 12 });
}

// ———————— 8. Paid
{
  const s = lightSlide("Paid engines — gated, profitable, compliant", "Traffic — paid");
  const rows2 = [
    [{ text: "Channel", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "Role", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "Gate to scale", options: { bold: true, color: WHITE, fill: { color: NAVY } } }],
    ["Google Search PPC", "First paid dollar. Layer 1: long-tail “case worth” terms → Snapshot (cheap). Layer 2: high-intent lawyer terms → call (Sky answers 24/7). Branded defense from day one.", "CPL ≤ $500 · ≥1 attributed signed case in 90 days"],
    ["Meta retargeting", "Site visitors, estimator abandoners, video viewers. Educational tone, film creative (dramatization labeled).", "Launch with PPC; $500–1k/mo"],
    ["Meta cold + YouTube pre-roll", "Only after organic proves hooks. CO-geo, Snapshot goal, feeds retargeting.", "CPL ≤ 2× Google"],
    ["Google LSA", "Economically excellent — but pay-per-lead format needs SB26-174 legal read first.", "BLOCKED pending attorney review"],
    ["Excluded", "Lead marketplaces · per-lead brokers · paid referrals · review buying.", "Permanent (SB26-174 / RPC 7.2)"],
  ];
  s.addTable(rows2, { x: 0.7, y: 2.05, w: 11.9, colW: [2.5, 6.0, 3.4], fontSize: 12, fontFace: "Calibri", color: INK, border: { pt: 0.5, color: "D9D4CA" }, fill: { color: WHITE }, valign: "middle", margin: 0.08 });
  s.addText("Budget arc: $0 (mo 1–2) → $4–6k (mo 3–4) → $8–12k if gates pass → scale toward $4k/signed-case ceiling. Kill at 2× target CPL with zero qualified leads; 10× winners.", { x: 0.7, y: 6.45, w: 11.9, h: 0.7, fontSize: 13, color: SLATE, italic: true, fontFace: "Calibri" });
}

// ———————— 9. 90-day rollout
{
  const s = darkSlide("90-day rollout", "Execution");
  card(s, 0.7, 2.1, 2.9, 4.3, "Weeks 1–2", "GSC submission\n\nGBP + review engine\n\nWarm-outreach announcement\n\nGHL sequences live (your build — next slide)\n\nSky outbound: LIVE ✓\n\nBrand-domain decision", true);
  card(s, 3.75, 2.1, 2.9, 4.3, "Weeks 3–6", "Weekly master show launches\n\nDirectory / profile layer\n\nDream 100 built + engagement\n\n3 cold bridge pages\n\nWeekly email cadence begins", true);
  card(s, 6.8, 2.1, 2.9, 4.3, "Weeks 7–10", "PPC layer-2 (value terms) + branded + retargeting\n\nFirst earned-media pitches (caps-change angle)\n\nLSA legal decision", true);
  card(s, 9.85, 2.1, 2.75, 4.3, "Weeks 11–13", "PPC layer-1 (high-intent) if CPL gate passed\n\nFirst kill/scale review\n\nQuarterly report vs. unit economics", true);
}

// ———————— 10. GHL build (Brian's ask)
{
  const s = lightSlide("The GHL build — what we need from you", "Implementation · HighLevel");
  bullets(s, [
    "Workflow 1 — intake nurture: trigger on tag “Colorado Personal Injury Lead” → 5-email Soap-Opera sequence (copy supplied, ready to paste) with waits 15min / 1d / 1d / 1d / 2d · exit on reply, booking, or tag “do-not-sequence” · skip if tagged “client”",
    "Workflow 2 — weekly cadence: story-first broadcast to the tag (starters supplied), suppressing anyone inside Workflow 1",
    "Sender hygiene: verified sending domain, monitored reply-to, open/click tracking on, advertising footer + unsubscribe on every send (copy includes it)",
    "Notifications: “Urgent Review” tag → instant SMS/email to intake team · all bookings → case-worker calendar visibility",
    "Reporting: source/UTM fields already populate on every contact — build the weekly dashboard: leads by source · sequence engagement · booked sessions · signed cases",
    "Review engine (phase 2): post-matter review request flow (no incentives) → GBP",
  ], { size: 14.5, gap: 10 });
  s.addText("Everything referenced ships with this deck: email copy file + landing-page URL map + full strategy doc.", { x: 0.7, y: 6.6, w: 11.9, h: 0.5, fontSize: 13, color: SLATE, italic: true, fontFace: "Calibri" });
}

// ———————— 11. Guardrails + asks
{
  const s = darkSlide("Compliance guardrails & open items", "Before spend");
  bullets(s, [
    "Attorney-review gate before first paid dollar: contingency phrasing + costs disclosure · LSA vs. SB26-174 · dramatization labeling in ads · email/SMS footers + consent · Sky outbound script · review-request flow · offer names",
    "Permanent exclusions: no outcome promises, no manufactured scarcity, no purchased leads, no paid referrals, no “best lawyer” claims",
    "Semrush data refresh pending API units — keyword metrics currently methodology-based estimates",
    "Decisions needed: brand domain purchase · LSA position · call-tracking vendor (NAP-safe implementation specified)",
  ], { size: 15, color: "E8E4DC", gap: 12 });
  s.addText("Full detail: docs/10-traffic-strategy.md (attached as PDF companion)", { x: 0.7, y: 6.55, w: 11.9, h: 0.4, fontSize: 12.5, color: "7E93A3", fontFace: "Calibri" });
}

pres.writeFile({ fileName: "marketing/WMW-PI-Traffic-Strategy.pptx" }).then(() => console.log("deck written"));
