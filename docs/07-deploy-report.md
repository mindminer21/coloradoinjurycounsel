# Deploy Report

## Status: READY — blocked only on one human secret
Everything is staged for a single-command production deploy. The build is committed, QA-passed, and `scripts/deploy.sh` is prepared and tested for syntax.

## Unblock checklist (≈2 minutes of Jeff's time)
1. Go to **vercel.com → Account Settings → Tokens → Create** (scope: *Jeff and Majid* team)
2. Save the token as **`vercel-token.txt`** in **Desktop/ClaudeDrop**
3. Tell Claude "token's there" — deploy, env vars, and HighLevel verification then run unattended

## What the deploy script does (scripts/deploy.sh)
1. `vercel link` → creates project **whiteford-mountain-west-injury** in team `jeff-and-majid` (team_ySSHOEyF8rwKbMyYuW2w2lQ8) — a NEW project; no existing Schell IP site is touched
2. Sets production env vars (values never printed):
   - `HIGHLEVEL_PIT` (from secure file-drop, held in session)
   - `HIGHLEVEL_LOCATION_ID` = tm68WWMrcAa3TqQbEAMa
   - `HEALTH_KEY` (random, generated — guards the tag-verification endpoint)
3. `vercel deploy --prod` from the repo (full source; Vercel builds Next 15 automatically)

## Post-deploy verification plan (automatic)
- `GET <prod>/api/health/highlevel` → expects `{configured:true, reachable:true, locationName:"Whiteford Sch…"}` — proof the PIT works from Vercel runtime (sandbox could not reach HL directly; the production runtime can)
- `GET <prod>/api/health/highlevel?verify=tag&key=<HEALTH_KEY>` → creates disposable test contact, reads back tags, expects `["Colorado Personal Injury Lead"]` — hard proof of the exact tag
- Sample 10 production URLs → HTTP 200
- `<prod>/sitemap.xml` → 106 URLs

## Domains
Initial: `whiteford-mountain-west-injury.vercel.app`. Brand-domain recommendation + DNS cutover steps: see `02-domain-decision.md`.

## Google Search Console — manual steps (no GSC OAuth in this environment)
1. search.google.com/search-console → Add property → URL-prefix → production URL
2. Verify via Vercel DNS TXT (if domain) or HTML-tag method (add tag via env/layout on request)
3. Sitemaps → submit `sitemap.xml`
4. Expect slow initial crawl on a fresh domain; interlinking + practice-areas hub accelerate discovery

## Env var names (values withheld)
`HIGHLEVEL_PIT` · `HIGHLEVEL_LOCATION_ID` · `HEALTH_KEY` · (optional later: `NEXT_PUBLIC_BASE_URL` on domain cutover)
