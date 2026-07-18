# Domain Decision

## Recommendation: ONE brand domain, path-based pages
**Recommended purchase: `whitefordmountainwest.com`** (or `.law` variant) — pending Jeff's approval since domain purchase costs money and needs brand sign-off.

### Why single-domain beats a keyword-domain cluster
1. **Authority consolidation.** 100 pages + future content compound backlink equity into one domain. Splitting across exact-match domains (e.g. denvercaraccidentlawyer.com) fragments authority and reads as spam network to modern Google.
2. **EMD value is dead; brand is a ranking asset.** Google devalued exact-match domains years ago; E-E-A-T signals (real firm, real attorneys, consistent NAP) now dominate legal SERPs — they attach to a brand domain.
3. **SB26-174 optics.** A branded firm site is unambiguously firm advertising; a fleet of keyword domains resembles the lead-gen patterns the statute targets. Single brand domain = cleanest compliance posture.
4. **Operations.** One GSC property, one analytics property, one deploy — maintainable by a small team.

### Interim state (live now)
Production runs on the Vercel subdomain `whiteford-mountain-west-injury.vercel.app` until the brand domain is purchased and pointed. `NEXT_PUBLIC_BASE_URL` env var switches all canonicals/sitemap/OG URLs in one redeploy.

### DNS cutover steps (when domain purchased)
1. Vercel → Project → Settings → Domains → add `whitefordmountainwest.com` + `www`
2. At registrar: `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`
3. Set `NEXT_PUBLIC_BASE_URL=https://whitefordmountainwest.com` in Vercel env → redeploy
4. Add property in GSC, submit `/sitemap.xml`, set canonical domain
5. 301s are automatic (Vercel redirects the .vercel.app to the primary domain)
