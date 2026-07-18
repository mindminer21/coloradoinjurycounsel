const pptxgen = require("pptxgenjs");
const fs = require("fs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

const NAVY = "003756", DEEP = "02243A", INK = "021B2C", PAPER = "F7F5F1", GOLD = "C6A15B", GOLDSOFT = "D9BC85", SKY = "8FB8D4", SLATE = "3E6079", WHITE = "FFFFFF", LINE = "D9D4CA";
const W = 13.3, H = 7.5;
const logoW = fs.readFileSync("/tmp/logo-white.png").toString("base64");
const logoN = fs.readFileSync("/tmp/logo-navy.png").toString("base64");
const LOGO_AR = 317 / 71.67; // svg viewBox ratio

let pageNo = 0;
function chrome(s, dark) {
  pageNo++;
  if (pageNo === 1) return;
  // top-right logo
  const lw = 1.5, lh = lw / LOGO_AR;
  s.addImage({ data: "image/png;base64," + (dark ? logoW : logoN), x: W - lw - 0.55, y: 0.42, w: lw, h: lh });
  // footer rule + page number
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: H - 0.52, w: W - 1.4, h: 0.012, fill: { color: dark ? "1E4C68" : LINE } });
  s.addText("Whiteford Mountain West · Colorado PI Acquisition Strategy — Confidential Draft", { x: 0.7, y: H - 0.48, w: 8, h: 0.3, fontSize: 8.5, color: dark ? "7E93A3" : "8A8478", fontFace: "Calibri", margin: 0 });
  s.addText(String(pageNo), { x: W - 1.2, y: H - 0.48, w: 0.5, h: 0.3, fontSize: 9, color: dark ? "7E93A3" : "8A8478", align: "right", fontFace: "Calibri", margin: 0 });
}
function ridges(s, yTop, dark) {
  // layered mountain motif
  const c1 = dark ? "0B3C5C" : "E4DFD4", c2 = dark ? "062E49" : "DAD4C6";
  s.addShape(pres.ShapeType.triangle, { x: -0.6, y: yTop, w: 3.4, h: 1.35, fill: { color: c1 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.triangle, { x: 1.9, y: yTop + 0.3, w: 4.4, h: 1.05, fill: { color: c2 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.triangle, { x: 5.2, y: yTop + 0.12, w: 3.7, h: 1.23, fill: { color: c1 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.triangle, { x: 8.0, y: yTop + 0.36, w: 4.2, h: 0.99, fill: { color: c2 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.triangle, { x: 11.0, y: yTop + 0.15, w: 3.4, h: 1.2, fill: { color: c1 }, line: { type: "none" } });
}
function darkSlide(title, eyebrow) {
  const s = pres.addSlide();
  s.background = { color: DEEP };
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: 0.7, y: 0.48, w: 9.5, h: 0.35, fontSize: 12, color: GOLD, charSpacing: 3, fontFace: "Georgia", bold: true, margin: 0 });
  if (title) s.addText(title, { x: 0.7, y: 0.84, w: 10.9, h: 0.85, fontSize: 29, color: WHITE, fontFace: "Georgia", margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 1.72, w: 1.1, h: 0.045, fill: { color: GOLD } });
  chrome(s, true);
  return s;
}
function lightSlide(title, eyebrow) {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: 0.7, y: 0.48, w: 9.5, h: 0.35, fontSize: 12, color: SLATE, charSpacing: 3, fontFace: "Georgia", bold: true, margin: 0 });
  if (title) s.addText(title, { x: 0.7, y: 0.84, w: 10.9, h: 0.85, fontSize: 29, color: NAVY, fontFace: "Georgia", margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 1.72, w: 1.1, h: 0.045, fill: { color: GOLD } });
  chrome(s, false);
  return s;
}
function card(s, x, y, w, h, head, body, dark = false, headSize = 14.5) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: dark ? NAVY : WHITE }, line: { color: dark ? "174662" : LINE, width: 0.75 }, shadow: { type: "outer", color: "021B2C", opacity: dark ? 0.35 : 0.12, blur: 8, offset: 3, angle: 90 } });
  s.addShape(pres.ShapeType.rect, { x, y, w, h: 0.055, fill: { color: GOLD } });
  s.addText(head, { x: x + 0.2, y: y + 0.16, w: w - 0.4, h: 0.55, fontSize: headSize, bold: true, color: dark ? GOLDSOFT : NAVY, fontFace: "Georgia", margin: 0, valign: "top" });
  s.addText(body, { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.86, fontSize: 12, color: dark ? "E8E4DC" : "37424C", fontFace: "Calibri", lineSpacingMultiple: 1.12, valign: "top", margin: 0 });
}
function stat(s, x, y, w, big, label, dark = false) {
  s.addText(big, { x, y, w, h: 0.75, fontSize: 34, color: dark ? GOLDSOFT : NAVY, fontFace: "Georgia", align: "center", margin: 0 });
  s.addText(label, { x, y: y + 0.78, w, h: 0.75, fontSize: 11.5, color: dark ? "AFC2CF" : SLATE, align: "center", fontFace: "Calibri", lineSpacingMultiple: 1.05, margin: 0 });
}

// ———— 1. TITLE
{
  const s = pres.addSlide(); pageNo++;
  s.background = { color: DEEP };
  ridges(s, 5.6, true);
  s.addShape(pres.ShapeType.rect, { x: 0, y: H - 0.75, w: W, h: 0.75, fill: { color: INK } });
  const lw = 3.1, lh = lw / LOGO_AR;
  s.addImage({ data: "image/png;base64," + logoW, x: 0.75, y: 0.75, w: lw, h: lh });
  s.addText("Mountain West · Personal Injury", { x: 0.78, y: 0.78 + lh + 0.06, w: 5, h: 0.32, fontSize: 13, color: SKY, fontFace: "Georgia", italic: true, margin: 0 });
  s.addText("Colorado PI Acquisition:", { x: 0.72, y: 2.6, w: 12, h: 0.85, fontSize: 40, color: WHITE, fontFace: "Georgia", margin: 0 });
  s.addText("Traffic & Lead Strategy", { x: 0.72, y: 3.42, w: 12, h: 0.85, fontSize: 40, color: GOLDSOFT, fontFace: "Georgia", margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: 0.75, y: 4.45, w: 1.4, h: 0.05, fill: { color: GOLD } });
  s.addText("Owned-asset growth engineered around Colorado's 2025–26 legal shifts", { x: 0.72, y: 4.62, w: 10.5, h: 0.4, fontSize: 16, color: "C7D3DC", fontFace: "Calibri", margin: 0 });
  s.addText([
    { text: "Prepared for Brian Thackston · Digital Marketing Strategy   |   ", options: {} },
    { text: "Confidential — internal draft, pending attorney review", options: { color: GOLD } },
  ], { x: 0.72, y: H - 0.62, w: 12, h: 0.4, fontSize: 11, color: "9FB0BC", fontFace: "Calibri", margin: 0 });
}

// ———— 2. WHY NOW
{
  const s = darkSlide("Two Colorado laws just redrew the market", "Why now");
  card(s, 0.7, 2.15, 5.95, 2.5, "Damage caps raised — HB24-1472 (2025)", "Non-economic damages cap rose to $1.5M for most tort actions filed on/after Jan 1, 2025 ($2.125M wrongful death; biennial inflation adjustments from 2028).\n\nSerious cases are being valued under new math — education converts.", true);
  card(s, 6.85, 2.15, 5.75, 2.5, "Lead-buying banned — SB26-174 (Aug 2026)", "Third-party legal lead generation becomes a deceptive trade practice in Colorado. Competitors renting pipeline from lead brokers lose their supply.\n\nOwned organic + first-party capture is the compliant moat.", true);
  s.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 5.0, w: 11.9, h: 0.95, rectRadius: 0.05, fill: { color: "0A3350" }, line: { color: GOLD, width: 1 } });
  s.addText("Strategic conclusion:  every dollar goes into assets we own — rankings, list, brand — not rented leads.", { x: 0.95, y: 5.0, w: 11.4, h: 0.95, fontSize: 16.5, color: GOLDSOFT, fontFace: "Georgia", italic: true, valign: "middle", margin: 0 });
  s.addText("Sources: leg.colorado.gov/bills/hb24-1472 · leg.colorado.gov/bills/SB26-174", { x: 0.7, y: 6.25, w: 11.9, h: 0.3, fontSize: 9.5, color: "6E8496", fontFace: "Calibri", margin: 0 });
}

// ———— 3. WHAT'S LIVE (stats + cards)
{
  const s = lightSlide("The asset stack is already built — live in staging", "Current state");
  stat(s, 0.7, 2.0, 2.9, "100", "SEO landing pages\n6 intent clusters, QA-passed");
  stat(s, 3.7, 2.0, 2.9, "24/7", "AI phone intake ('Sky')\nbooks consults live");
  stat(s, 6.7, 2.0, 2.9, "2 min", "case-value estimator\n→ tagged GHL lead");
  stat(s, 9.7, 2.0, 2.9, "100%", "source attribution\nUTM → GHL on every lead");
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 3.62, w: 11.9, h: 0.012, fill: { color: LINE } });
  card(s, 0.7, 3.9, 3.95, 2.5, "Capture, wired end-to-end", "Estimator + Sky both create GHL contacts tagged \"Colorado Personal Injury Lead\" with intake summaries, recordings, and source fields. Failed pushes dead-letter to logs — no lead silently lost.");
  card(s, 4.8, 3.9, 3.95, 2.5, "Speed-to-lead, automated", "New estimator leads with a phone number get an outbound follow-up call from Sky within minutes (business hours MT), offering to book the consultation while interest is hot.");
  card(s, 8.9, 3.9, 3.7, 2.5, "Staging link", "whiteford-mountain-west-injury.vercel.app\n\nRemaining: GSC submission, brand-domain decision, GHL email sequences (this deck's ask).");
}

// ———— 4. FUNNEL (diagram)
{
  const s = darkSlide("One funnel, two front doors, everything owned", "Architecture");
  const steps = [
    ["TRAFFIC", "SEO · content · earned media · paid (gated)"],
    ["BRIDGE", "100 intent-matched pages · story pages for cold"],
    ["CAPTURE", "Snapshot estimator · Sky phone intake"],
    ["FOLLOW-UP", "5-email sequence · AI callback · retargeting"],
    ["CONVERT", "Game Plan Session → engagement"],
  ];
  let x = 0.7; const w = 2.34, gap = 0.06, y = 2.3, h = 2.0;
  steps.forEach(([hd, bd], i) => {
    s.addShape(pres.ShapeType.chevron, { x, y, w: w + 0.25, h, fill: { color: i === 4 ? GOLD : NAVY }, line: { color: i === 4 ? GOLD : "174662", width: 0.75 } });
    s.addText(hd, { x: x + (i ? 0.3 : 0.12), y: y + 0.25, w: w - 0.3, h: 0.4, fontSize: 14.5, bold: true, color: i === 4 ? INK : GOLDSOFT, fontFace: "Georgia", margin: 0 });
    s.addText(bd, { x: x + (i ? 0.3 : 0.12), y: y + 0.7, w: w - 0.28, h: h - 0.85, fontSize: 10.5, color: i === 4 ? "1F2A33" : "DCE6ED", fontFace: "Calibri", lineSpacingMultiple: 1.1, margin: 0, valign: "top" });
    x += w + gap;
  });
  s.addText("The list is the asset", { x: 0.7, y: 4.75, w: 11.9, h: 0.45, fontSize: 16, color: GOLDSOFT, fontFace: "Georgia", italic: true, align: "center", margin: 0 });
  const notes = [
    "Warm searchers land on the page that matches their exact intent — never a generic homepage",
    "Most conversions happen at contact five-plus — the follow-up layer does the compounding",
    "Every path converts toward traffic we OWN: the tagged, attributed GHL list",
  ];
  s.addText(notes.map((t, i) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: 6 } })), { x: 1.6, y: 5.25, w: 10.2, h: 1.4, fontSize: 12.5, color: "DCE6ED", fontFace: "Calibri", lineSpacingMultiple: 1.1, margin: 0 });
}

// ———— 5. ECONOMICS (stats + chart)
{
  const s = lightSlide("The math that governs every channel", "Unit economics");
  stat(s, 0.7, 2.05, 2.9, "$12k", "planning fee per signed case\n(conservative blend)");
  stat(s, 3.7, 2.05, 2.9, "3 : 1", "minimum return on\nacquisition cost (Hormozi)");
  stat(s, 6.7, 2.05, 2.9, "$4,000", "ceiling per signed case");
  stat(s, 9.7, 2.05, 2.9, "≤ $500", "target cost per qualified lead\n(6–8 leads per signed case)");
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 3.68, w: 11.9, h: 0.012, fill: { color: LINE } });
  // budget arc chart
  s.addChart(pres.ChartType.bar, [{
    name: "Monthly paid budget",
    labels: ["Mo 1–2", "Mo 3–4", "Mo 5–6", "Mo 7+"],
    values: [0, 5000, 10000, 16000],
  }], {
    x: 0.7, y: 3.95, w: 6.6, h: 2.75, barDir: "col",
    chartColors: [NAVY], chartColorsOpacity: 100,
    showTitle: true, title: "Paid budget arc — gated, patient capital", titleFontSize: 12, titleColor: NAVY, titleFontFace: "Georgia",
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: SLATE, dataLabelFontSize: 10, dataLabelFormatCode: "$#,##0",
    catAxisLabelColor: SLATE, catAxisLabelFontSize: 10.5, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: false, valAxisMaxVal: 18000,
  });
  card(s, 7.6, 3.95, 5.0, 2.75, "Why the gate matters", "Contingency fees lag spend by 12–18 months — paid budget is patient capital, not cash-recycling.\n\nScale gates: blended paid CPL ≤ $500 and ≥1 attributed signed case in 90 days. Kill any ad at 2× target CPL with zero qualified leads; multiply winners.\n\nEvery channel is judged on cost per signed case — attribution is already live.");
}

// ———— 6. OFFER LAYER
{
  const s = lightSlide("Sharpen the offer before buying traffic", "Offer layer");
  card(s, 0.7, 2.05, 5.95, 2.2, "Lead magnet — \"Colorado Case Value Snapshot\"", "Free 2-minute educational read on what drives cases like yours under the 2025 damages law. Reason-why naming, zero friction. Already built — this is the sharper wrapper.");
  card(s, 6.85, 2.05, 5.75, 2.2, "Consultation — \"Claim Game Plan Session\"", "Named and concrete, not another \"free consultation\": deadline check · evidence-preservation checklist · straight answer on whether counsel is warranted · insurer-conversation briefing.");
  card(s, 0.7, 4.45, 5.95, 2.05, "The guarantee (law-native)", "\"You pay no fee unless we recover for you.\" The contingency structure is the strongest trust lever in legal marketing — lead with it everywhere. (Attorney review: costs-vs-fees disclosure.)");
  card(s, 6.85, 4.45, 5.75, 2.05, "One core belief, repeated everywhere", "\"Insurers pay full value only to claimants prepared to go to trial — and that preparation is what a national trial platform provides from day one.\" Masten's insurer-defense past is the proof story.");
}

// ———— 7. ORGANIC
{
  const s = darkSlide("Organic engines — months 1–2, $0 media", "Traffic · earned & owned");
  card(s, 0.7, 2.1, 3.95, 4.0, "Own search", "Finish the last mile:\n\n• GSC submission + sitemap\n• Brand domain + GBP + review engine\n• Legal/local directory profiles (profiles only — no lead-gen products)\n• Monthly content additions where rankings emerge", true);
  card(s, 4.8, 2.1, 3.95, 4.0, "Publish weekly", "One 10–15 min \"master show\" video weekly — myth-busting Colorado injury topics, hook → story → offer.\n\nEach becomes: Shorts, landing-page embeds, the weekly email, GBP posts.\n\nOver-give, ask rarely (≥3.5:1).", true);
  card(s, 8.9, 2.1, 3.7, 4.0, "Earn the audience", "Colorado Target-100: safety-beat reporters, podcasts, ski/cycling communities, adjacent professionals.\n\nRelationship + education only — never paid referrals (RPC 7.2).\n\nNewsjack asset: the 2025 caps change is genuinely newsworthy.", true);
}

// ———— 8. PAID
{
  const s = lightSlide("Paid engines — gated, profitable, compliant", "Traffic · paid");
  const rows = [
    [{ text: "Channel", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: "Georgia" } }, { text: "Role", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: "Georgia" } }, { text: "Gate", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: "Georgia" } }],
    ["Google Search PPC", "First paid dollar. Long-tail \"case worth\" terms → Snapshot (cheap) · high-intent lawyer terms → call (Sky answers 24/7) · branded defense.", "CPL ≤ $500 · signed case in 90 days"],
    ["Meta retargeting", "Site visitors, estimator abandoners, video viewers — educational tone, film creative (dramatization labeled).", "Launches with PPC · $0.5–1k/mo"],
    ["Meta cold · YouTube pre-roll", "Only after organic proves the hooks. CO-geo, Snapshot goal, feeds retargeting pools.", "CPL ≤ 2× Google's"],
    ["Google LSA", "Economically excellent — but pay-per-lead format needs an SB26-174 legal read first.", "BLOCKED pending attorney review"],
    ["Excluded permanently", "Lead marketplaces · per-lead brokers · paid referrals · review buying.", "SB26-174 / RPC 7.2"],
  ];
  s.addTable(rows, { x: 0.7, y: 2.1, w: 11.9, colW: [2.6, 6.1, 3.2], fontSize: 11.5, fontFace: "Calibri", color: INK, border: { pt: 0.5, color: LINE }, fill: { color: WHITE }, valign: "middle", margin: 0.09, autoPage: false });
  s.addText("Kill at 2× target CPL with zero qualified leads. Multiply winners. Fix the worst funnel step before adding any new channel.", { x: 0.7, y: 6.35, w: 11.9, h: 0.5, fontSize: 12.5, color: SLATE, italic: true, fontFace: "Calibri", margin: 0 });
}

// ———— 9. ROLLOUT (timeline)
{
  const s = darkSlide("90-day rollout", "Execution");
  const cols = [
    ["Weeks 1–2", "GSC submission · GBP + reviews\nWarm-outreach announcement\nGHL sequences live (your build)\nSky outbound: LIVE ✓\nBrand-domain decision"],
    ["Weeks 3–6", "Weekly master show launches\nDirectory / profile layer\nTarget-100 engagement begins\n3 cold bridge pages\nWeekly email cadence"],
    ["Weeks 7–10", "PPC value terms + branded\nRetargeting live\nFirst earned-media pitches\nLSA legal decision"],
    ["Weeks 11–13", "PPC high-intent terms (if gate passed)\nFirst kill/scale review\nQuarterly report vs. unit economics"],
  ];
  // timeline spine
  s.addShape(pres.ShapeType.rect, { x: 0.9, y: 2.42, w: 11.5, h: 0.02, fill: { color: GOLD } });
  let x = 0.7;
  cols.forEach(([hd, bd], i) => {
    s.addShape(pres.ShapeType.ellipse, { x: x + 1.35, y: 2.3, w: 0.26, h: 0.26, fill: { color: GOLD }, line: { color: DEEP, width: 2 } });
    card(s, x, 2.85, 2.9, 3.4, hd, bd, true, 15);
    x += 3.05;
  });
}

// ———— 10. GHL ASK
{
  const s = lightSlide("The GHL build — what we need from you", "Implementation · HighLevel");
  card(s, 0.7, 2.05, 5.95, 2.3, "1 · Intake nurture workflow", "Trigger: Contact Tag Added = \"Colorado Personal Injury Lead\" → 5-email sequence (copy supplied, paste-ready) with waits 15 min / 1d / 1d / 1d / 2d.\nExit on reply, booking, or \"do-not-sequence.\" Skip anyone tagged \"client.\"");
  card(s, 6.85, 2.05, 5.75, 2.3, "2 · Weekly cadence", "Story-first weekly broadcast to the same tag (starter topics supplied), suppressing anyone still inside the intro sequence.");
  card(s, 0.7, 4.55, 5.95, 2.0, "3 · Hygiene + alerts", "Verified sending domain, monitored reply-to, tracking on. Advertising footer + unsubscribe stay exactly as written (compliance). \"Urgent Review\" tag → instant SMS/email to intake.");
  card(s, 6.85, 4.55, 5.75, 2.0, "4 · Weekly dashboard", "Source/UTM fields already populate on every contact. Build: leads by source · sequence engagement · booked sessions · signed cases by source.");
}

// ———— 11. GUARDRAILS + CLOSE
{
  const s = darkSlide("Guardrails, open items & timing", "Before spend");
  card(s, 0.7, 2.1, 5.95, 2.3, "Attorney-review gate (before first paid dollar)", "Contingency phrasing + costs disclosure · LSA vs. SB26-174 · dramatization labels in ads · email/SMS footers + consent · AI outbound script · review-request flow · offer names.", true);
  card(s, 6.85, 2.1, 5.75, 2.3, "Permanent exclusions", "No outcome promises · no manufactured scarcity · no purchased leads · no paid referrals · no \"best lawyer\" claims.\n\nDecisions needed: brand domain · LSA position · call-tracking vendor.", true);
  s.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.75, w: 11.9, h: 1.35, rectRadius: 0.05, fill: { color: "0A3350" }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "Timing: ", options: { bold: true, color: GOLDSOFT } },
    { text: "Masten Childers and Paul Nussbaum are in Colorado in a few weeks for a practice implementation session — target: email sequences live and first dashboard numbers in hand before they arrive.", options: { color: "E8E4DC" } },
  ], { x: 0.95, y: 4.75, w: 11.4, h: 1.35, fontSize: 15, fontFace: "Georgia", valign: "middle", lineSpacingMultiple: 1.2, margin: 0 });
}

pres.writeFile({ fileName: "marketing/WMW-PI-Strategy-Deck-v2.pptx" }).then(() => console.log("deck v2 written"));
