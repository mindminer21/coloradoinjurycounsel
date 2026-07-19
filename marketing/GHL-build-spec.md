# HighLevel Build Specification
## Whiteford Mountain West — Colorado PI Intake Nurture
### For: Brian Thackston · Prepared by: Jeff Schell · Status: DRAFT — email copy pending attorney review
### Sub-account: Whiteford Schell IP (Location ID `tm68WWMrcAa3TqQbEAMa`)

---

## 1. What is already wired (no action needed — context only)

Two intake paths already create contacts in this sub-account automatically:

| Source | How it arrives | What's on the contact |
|---|---|---|
| Website estimator ("Colorado Case Value Snapshot") | API upsert from the website | Tag `Colorado Personal Injury Lead` · source `PI Site — <page path>` · note with all 8 answers, the value band shown, originating page/keyword, and any UTM parameters |
| AI phone intake ("Sky", (720) 821-3784) | API upsert from the phone system's post-call webhook | Tags `Colorado Personal Injury Lead` + `AI Phone Intake` (+ `Urgent Review` when flagged) · source `AI Phone Intake — Retell` · note with full structured intake summary + call-recording link |

Sky also places an outbound follow-up call to new estimator leads within minutes (business hours MT) and can book consultations directly onto the firm's Cal.com calendar mid-call. **Nothing in this spec should call, SMS, or double-touch a lead outside what's defined below.**

Existing test contacts safe to delete: "QA Test", "Pipeline Check", "Webhook Test", "Test EstimatorVerification".

---

## 2. BUILD ITEM 1 — Intake nurture workflow (the priority)

**Create: Automation → Workflows → Create Workflow → Start from Scratch → name it `PI — Intake Nurture (5-email)`**

**Trigger:** `Contact Tag Added` → tag equals `Colorado Personal Injury Lead` *(exact string; both intake paths apply it, so one workflow covers both)*

**Guard filters (add as workflow filters or an initial If/Else):**
- Contact does NOT have tag `client`
- Contact does NOT have tag `do-not-sequence`
- Contact has an email address

**Steps:**
1. Wait **15 minutes** → Send **Email 1** (copy in §5)
2. Wait **1 day** → Send **Email 2**
3. Wait **1 day** → Send **Email 3**
4. Wait **1 day** → Send **Email 4**
5. Wait **2 days** → Send **Email 5** → End

**Workflow settings:**
- **Allow re-entry: OFF** (a returning lead should not restart the drip)
- **Stop on reply: ON** (any inbound email reply removes them from the sequence)
- **Goal event:** Appointment Booked (any calendar) → exits the workflow
- Also exit when tag `do-not-sequence` is added (add as a secondary goal/exit condition)
- Time window: send only 7:00–20:00 America/Denver (avoid 2 a.m. sends when the 15-min wait lands overnight)

**Personalization used in the copy:** `{{contact.first_name}}` only. If first name is empty, GHL's default fallback is acceptable ("there" reads fine in every email).

---

## 3. BUILD ITEM 2 — Weekly cadence

**Create: `PI — Weekly Cadence`** (workflow or recurring broadcast, your call — broadcast is fine)

- **Audience:** everyone with tag `Colorado Personal Injury Lead`, EXCLUDING anyone currently active in `PI — Intake Nurture` and anyone tagged `client` or `do-not-sequence`
- **Cadence:** one email per week (suggest Tuesday 10:00 MT)
- **Content:** story-first, one idea per email, one CTA (the Snapshot at /case-estimator or the phone line). Four starter topics are included in §6 — Jeff will supply ongoing copy monthly.

---

## 4. BUILD ITEM 3 — Hygiene, alerts, reporting

**Sender hygiene (before any send):**
- Verified sending domain (SPF/DKIM/DMARC green in GHL email settings) — coordinate with Jeff on which domain
- From name: `Jeff Schell — Whiteford Mountain West` · monitored reply-to
- Open/click tracking ON
- **The attorney-advertising footer and unsubscribe line in the copy are compliance requirements — do not shorten, restyle, or remove.** If the template system appends its own unsubscribe, remove the duplicate, keep one.

**Alerts:**
- Trigger: `Contact Tag Added` = `Urgent Review` → immediate internal notification (SMS + email) to the intake team distribution — include contact name, phone, and the note preview

**Weekly dashboard (fields already populate — just surface them):**
- New leads by source (`PI Site — …` vs `AI Phone Intake — Retell`, and by UTM where present)
- Nurture performance: delivery / open / click / reply by email #
- Appointments booked (Cal.com bookings appear on the contact when made by Sky; website bookings land in Cal.com directly — reconcile weekly for now)
- Tag counts: total `Colorado Personal Injury Lead`, `Urgent Review`
- (As the firm logs them) signed cases by original source — this is the number that governs all spend decisions

**Test protocol before go-live:**
1. Add tag `Colorado Personal Injury Lead` to a test contact with your own email → confirm Email 1 arrives in ~15 min with footer + working unsubscribe
2. Reply to Email 1 → confirm sequence stops
3. Fresh test contact → let Emails 1–2 arrive → book a test appointment → confirm goal-exit
4. Add `do-not-sequence` mid-flow on a third test → confirm exit
5. Delete test contacts

---

## 5. EMAIL COPY — Intake nurture (paste as-is; pending attorney review)

**Footer for EVERY email (required, verbatim):**
> *Attorney Advertising — Whiteford Mountain West, 2128 W. 32nd Ave., Suite 200, Denver, CO 80211 · (720) 821-3784. This email is general information, not legal advice; no attorney-client relationship exists unless engaged in writing. Prior results do not guarantee similar outcomes. [Unsubscribe]*

---

### EMAIL 1 — wait 15 min · Subject: `Your Colorado case snapshot (and what it can't tell you)` · Preview: `The two things no calculator can see.`

{{contact.first_name}},

Thanks for using our case snapshot (or speaking with Sky). You now have an educational range — which puts you ahead of most people, who negotiate with insurers holding no reference point at all.

But I want to be straight with you about what that range *can't* see, because it's where cases are actually won or lost:

**1. Your evidence.** Camera footage gets overwritten in days. Vehicles get repaired. Witnesses move. The value of the exact same injury changes dramatically based on what can still be proven a month from now.

**2. Your deadline.** Colorado sets strict filing deadlines that vary by claim type — and some, like claims involving government vehicles, are far shorter than people expect.

Both of those have one thing in common: they only move in one direction.

Tomorrow I'll tell you about the person on our team who spent years on the *other* side of cases like yours — and why that changed how we prepare every claim.

— Jeff Schell
Managing Director, Whiteford Mountain West
**Free Claim Game Plan Session: (720) 821-3784**

---

### EMAIL 2 — wait 1 day · Subject: `He used to work for the insurance companies` · Preview: `What Masten learned defending them.`

{{contact.first_name}},

For years, Masten Childers was the lawyer insurance companies hired when the stakes got serious. State courts, federal courts, appeals — he defended major corporations and insurers, and he was very good at it.

Which means he sat in the rooms you never get to see. He watched how claims get evaluated, how adjusters decide who gets a real number and who gets the discount offer, and what makes a defense team quietly tell an insurer: *"pay this one — we don't want it in front of a jury."*

Today Masten is a partner on our team, representing injured people. And the biggest lesson he brought across is uncomfortable but useful:

**Insurers don't pay full value out of fairness. They pay it when a claim is prepared like it's going to trial.**

That single idea shapes everything about how Whiteford Mountain West handles Colorado injury cases — and it's why the "quick settlement" firms often leave so much on the table.

Tomorrow: the moment most people accidentally cut their own case value in half — usually in the first two weeks.

— Jeff
**(720) 821-3784** · Free Claim Game Plan Session

---

### EMAIL 3 — wait 1 day · Subject: `The 14-day window most people waste` · Preview: `Three quiet mistakes, one epiphany.`

{{contact.first_name}},

Here's what we see over and over in Colorado injury cases — three quiet, well-intentioned mistakes people make early:

1. **The treatment gap.** You feel "mostly okay," life is busy, you skip the follow-up. Weeks later, the adjuster reads that gap as proof you weren't really hurt.
2. **The recorded statement.** The other driver's insurer calls, friendly as can be, "just to get your side." Everything in that recording gets mined later.
3. **Waiting to see how it goes.** Evidence decays on its own schedule, not yours.

None of these feel like decisions. All of them are.

This is exactly why we built the free **Claim Game Plan Session** — 30 minutes with our Colorado team where you leave with: your specific deadline check, an evidence-preservation checklist for your incident type, the insurance-conversation briefing, and an honest answer on whether your case even needs a lawyer. (If it doesn't, we'll say so — it happens regularly, and people appreciate the straight answer.)

**Book yours: (720) 821-3784** — Sky, our intake assistant, can schedule you in about a minute, day or night.

— Jeff

---

### EMAIL 4 — wait 1 day · Subject: `"Lawyers just take a third and disappear" — and other things people believe` · Preview: `Fair question. Honest answer.`

{{contact.first_name}},

Let's talk about the objection you may be politely not saying: *"Won't a lawyer just take a big cut of what I'd get anyway?"*

It's a fair question, and here's the honest answer: in cases with real injuries and real fault disputes, represented claimants generally recover substantially more — even after fees — because documented, trial-ready claims get valued differently by insurers. That's not a promise about your case; no honest lawyer makes those. It's a description of how claim evaluation works, from people who've sat on both sides of it.

And the structure protects you: **you pay no fee unless we recover for you.** Our interests are aligned — if your case is small enough to handle yourself, taking it wouldn't make sense for either of us, and we'll tell you that for free.

Also worth knowing, since 2025: Colorado significantly **raised** the caps on what injured people can recover for non-economic harm — the human losses. Cases are being valued under new math. Old assumptions (yours *or* an adjuster's) may be outdated.

**One conversation settles all of this: (720) 821-3784.**

— Jeff

---

### EMAIL 5 — wait 2 days · Subject: `Your deadline doesn't care either way` · Preview: `The one thing we can't do later.`

{{contact.first_name}},

Last note from me in this series, and it's the plainest one.

Whatever you decide — handle it yourself, hire us, hire someone else — please decide *soon*. Not because of sales pressure: because Colorado's filing deadlines are real, they vary by claim type, some are surprisingly short, and once one passes, the strongest case in the world is worth nothing.

The Claim Game Plan Session is free, it's 30 minutes, and you leave knowing your deadline, your evidence priorities, and whether you need counsel at all. Worst case, you spend half an hour confirming you're fine on your own.

**Call (720) 821-3784** — or book directly and Sky will find a time that works.

Whatever you choose, I hope the recovery goes well.

— Jeff Schell
Managing Director, Whiteford Mountain West

---

## 6. Weekly cadence — four starter topics
1. **The chain-law pileup nobody was "at fault" for** → how comparative fault actually gets argued
2. **What a $23 parking-lot camera fee taught us about evidence** → preservation letters and why day-one matters
3. **The 2025 damages-cap change, explained like a neighbor would** → why old settlement assumptions are stale
4. **"The adjuster was so nice"** → the difference between a nice person and a fair number

Format for each: one story, one idea, one CTA (Snapshot at the website or the phone line), full footer.

---

## 7. Out of scope for this build (do NOT configure)
- Any SMS sequences (consent language review pending)
- Any changes to the phone system, Sky, or the Cal.com calendars
- Any third-party lead sources or lead-vendor integrations (prohibited — SB26-174)
- Purchasing/altering ad campaigns

**Questions → Jeff.** Target: live before Masten and Paul's Colorado implementation session.

---
## ADDENDUM — Claim Game Plan lead magnet (added later)
New trigger tag: **"PI Game Plan Lead"** — applied when someone completes the interactive Claim Game Plan at /game-plan.
- Start the 5-email PI nurture sequence on this tag (same sequence as the estimator leads, or a dedicated variant referencing "your Game Plan").
- The full generated Game Plan + all intake answers + primary address are saved on the contact ("AI Call Intake Details" custom field + note).
- The site also attempts to send the Game Plan email instantly via the Conversations API; if that fails, email #1 of the workflow should attach/restate the plan (content is in the contact's custom field).
- "Urgent Review" tag is added when time-sensitive issues were spotted (deadline risk, government entity, no treatment yet).
