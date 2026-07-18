# QA Checklist — Evidence

## Automated gates (run against production build output)

Per-page gates (11 checks × 100 pages): keyword in title/H1 · logo · all 3 attorneys named · NAP+phone · estimator CTA · attorney-advertising disclaimer · FAQPage schema · LegalService schema · canonical tag · vetted law block present

**Result: 100/100 pages pass all gates** (see qa-raw.json)

## Build & runtime
- next build: ✓ 114/114 static pages, zero errors
- First-load JS: 102–111KB (CWV-friendly, fully static landing pages)
- Estimator unit tests: 6/6 pass (band coherence, monotonicity, liability discount, deadline warnings, cap context, rounding)
- Prod server smoke: / , /case-estimator, sample landings → HTTP 200
- Lead API end-to-end: band returned; dead-letter logging verified when CRM unconfigured; honeypot returns fake-success; rate limit active
- Console errors across 6 screenshotted pages (2 viewports incl. 390px mobile): ZERO
- prefers-reduced-motion: all animation disabled via media query

## Screenshots captured
home desktop+mobile · denver-car landing · vail landing mobile · estimator · value page — all render correctly with real brand assets

## Estimator gates
- [x] Name + email required before reveal
- [x] Band + disclaimers rendered
- [x] Consent checkbox required
- [ ] HighLevel contact + tag readback — pending production deploy (sandbox cannot reach HL; verified post-deploy via /api/health/highlevel?verify=tag)
- [x] Failure path tested (soft error + dead-letter + phone fallback)