# Content generation instructions (per-page JSON)

You are writing landing-page content for Whiteford Mountain West, a Colorado personal-injury practice (real firm — accuracy matters). For EACH brief in your assigned chunk file, write one JSON file to `/home/claude/whiteford-pi/content/pages/<slug>.json`.

## Study first (required)
1. Read `/home/claude/whiteford-pi/content/pages/denver-car-accident-lawyer.json` — the exemplar. Match its schema EXACTLY, its quality, tone (confident, plain-English, empathetic, zero hype), and its length (±20%).
2. Read your chunk file for the 10 briefs (slug, keyword, cluster, angle). The `angle` is your content thesis — build the page around it so no two pages feel alike.
3. Read `/home/claude/whiteford-pi/content/briefs/all-slugs.json` to choose 5–6 `related` slugs (must exist there; pick topically/geographically adjacent ones; always include one `value`-cluster slug).

## Schema (all fields required unless noted)
slug, keyword, cluster (copy from brief), title (≤60 chars, includes keyword naturally, ends "| Whiteford Mountain West" or "| Whiteford" if long), metaDescription (150–160 chars, includes phone (720) 821-3784 when it fits), h1 (natural-case keyword phrasing, NOT stuffed), heroSub (1–2 sentences, empathetic + concrete), heroEyebrow, geoLabel (city/region name, or omit for statewide/value/law pages), intro (3 paragraphs; first = emotional+concrete hook), sections (EXACTLY 3, each: heading, paragraphs[2], optional bullets[3–5] on ONE section only), localFacts (3–4 concrete Colorado/city-specific strings — real roads, real institutions, real patterns; omit only for value/law cluster pages), faqs (EXACTLY 5, each a: 60–110 words, genuinely useful), related (5–6 slugs).

## Word budget
600–1,000 words per page total. Do not pad. Do not go thin.

## Cluster-specific direction
- geo-casetype / metro: lead with the city's real geography (roads, corridors, courts, hospitals). NEVER invent statistics or crash counts — patterns and place names only.
- state-casetype: statewide practice depth, venue variety, case-type mechanics.
- mountain: resort/terrain specifics, waivers, seasonal patterns. Ski pages may reference the Colorado Ski Safety Act GENERALLY (duties + inherent-risk concept) without quoting numbers.
- value: HONEST education about how value forms; debunk "calculators"; drive to /case-estimator as the honest alternative. FAQs about ranges must stay qualitative.
- law: explain the LANDSCAPE conversationally, but see the hard rule below.

## HARD COMPLIANCE RULES (violations = rejected page)
1. NO specific legal figures ANYWHERE: no statute numbers, no dollar caps, no deadline durations ("two years", "182 days"), no percentages ("50%"). The site injects a vetted law block on every page. Refer generally: "Colorado's 2025 damages-law changes", "Colorado's filing deadlines vary by claim type and can be short", "Colorado's comparative-fault rules can reduce or bar recovery". EXCEPTION — none. Even law-cluster pages describe direction ("caps rose substantially in 2025") without figures.
2. NO guarantees, "maximum compensation", "we always win", "best/top/#1", "specialists/experts in".
3. NO invented case results, settlements, testimonials, client stories, or statistics.
4. NO named victims or real incidents (aviation-disaster references, specific crashes = forbidden).
5. Attorneys may be referenced only as: "our Denver-based team", "Whiteford's national trial platform". No bios (site renders those).
6. Phone: (720) 821-3784. CTA concept: free consultation + the case estimator. Weave one estimator mention into the final section or intro naturally.
7. Valid JSON, UTF-8, no markdown inside strings, no trailing commas. Use straight apostrophes (').

## Return format
After writing all 10 files, return ONLY: a line per file `written: <slug> (<total word count>)`, or `FAILED: <slug> — reason`.
