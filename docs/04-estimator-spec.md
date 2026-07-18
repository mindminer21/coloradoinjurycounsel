# Case-Value Estimator — Spec & Logic

## Flow
8 single-tap questions → name/email gate (+optional phone, consent checkbox, honeypot) → band reveal + drivers + cautions + call CTA. Answers first, contact before reveal (qualifies leads while keeping the education honest — intermediate context is shown at each step via `help` copy).

## Band heuristic (lib/estimate.ts — unit-tested, 6/6 passing)
```
economic  = mid(medicalCosts) + mid(lostWages)
raw       = max(economic × sevMult × treatAdj, economic + 2000) × liabAdj
band      = [max(raw×0.5, 2500) , max(raw×1.6, low×2)]  → rounded to clean steps
sevMult:  minor 1.5 · moderate 2.25 · serious 3 · severe 4 · catastrophic 5
treatAdj: none .7 · ER .9 · ongoing 1.0 · surgery 1.2 · hospitalized 1.25
liabAdj:  clear 1.0 · shared .75 · disputed .55 · unknown .45
```
Deliberately wide bands + qualifier labels (limited/typical/elevated/significant/catastrophic). Output copy never says "your case is worth" — always "cases with inputs like these have sometimes fallen in this educational range."

## Disclaimers (rendered at: consent checkbox, band reveal, page footer, /disclaimer)
Not legal advice · not a valuation/appraisal · no attorney-client relationship · not an offer of representation · outcomes vary (facts, policy limits, comparative fault, caps + exceptions, deadlines) · prior results ≠ future outcomes.

## Cautions engine (always shown)
- Comparative-negligence warning when liability ≠ clear
- Deadline urgency when incident ≥ 2 years old
- Policy-limits reality check (always)
- 2025 cap context: educational ceiling framing only (vetted figure lives in lib, reviewed)

## Lead pipeline (app/api/lead/route.ts)
1. Rate limit (8/10min/IP) + honeypot (silent fake-success) + sanitization + email regex
2. Band computed server-side (client can't tamper)
3. HighLevel upsert `/contacts/upsert` with tag **`Colorado Personal Injury Lead`**, source = page path; note attached with full answers + band + keyword + UTMs; 3× retry w/ backoff on 5xx/429
4. **Never drop a lead silently**: on HL failure or missing config → structured `[lead-dead-letter]` JSON to server logs (Vercel log stream) + user still gets band + soft-error path shows phone
5. Response includes `crm: created|failed|unconfigured` for observability

## HighLevel field map
| Field | Source |
|---|---|
| firstName/lastName/email/phone | contact gate |
| tags | `Colorado Personal Injury Lead` (exact) |
| source | `PI Site — <page path>` |
| note | timestamp, page, keyword, UTMs, band, all 8 answers |

## Verification endpoint
`GET /api/health/highlevel` → config + location reachability (no secrets exposed)
`GET /api/health/highlevel?verify=tag&key=<HEALTH_KEY>` → creates disposable test contact, reads back tags = live proof of the exact tag. Guarded by HEALTH_KEY env var.
