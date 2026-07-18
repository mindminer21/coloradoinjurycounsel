# HighLevel Email Sequences — Whiteford Mountain West PI
### Soap-Opera intro (5 emails, days 0–5) + weekly cadence starters
### DRAFT — attorney review required before activation (advertising footers included)

**Trigger:** Contact tagged `Colorado Personal Injury Lead` (fires for both estimator + Sky phone intakes).
**Exit conditions:** replies, books a consultation, or tag `client` / `do-not-sequence` added.
**Footer (every email, non-negotiable):** *Attorney Advertising — Whiteford Mountain West, 2128 W. 32nd Ave., Suite 200, Denver, CO 80211 · (720) 821-3784. This email is general information, not legal advice; no attorney-client relationship exists unless engaged in writing. Prior results do not guarantee similar outcomes. [Unsubscribe]*

---

## Email 1 — Day 0, ~15 min after intake
**Subject:** Your Colorado case snapshot (and what it can't tell you)
**Preview:** The two things no calculator can see.

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

## Email 2 — Day 1
**Subject:** He used to work for the insurance companies
**Preview:** What Masten learned defending them.

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

## Email 3 — Day 2
**Subject:** The 14-day window most people waste
**Preview:** Three quiet mistakes, one epiphany.

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

## Email 4 — Day 3
**Subject:** "Lawyers just take a third and disappear" — and other things people believe
**Preview:** Fair question. Honest answer.

{{contact.first_name}},

Let's talk about the objection you may be politely not saying: *"Won't a lawyer just take a big cut of what I'd get anyway?"*

It's a fair question, and here's the honest answer: in cases with real injuries and real fault disputes, represented claimants generally recover substantially more — even after fees — because documented, trial-ready claims get valued differently by insurers. That's not a promise about your case; no honest lawyer makes those. It's a description of how claim evaluation works, from people who've sat on both sides of it.

And the structure protects you: **you pay no fee unless we recover for you.** Our interests are aligned — if your case is small enough to handle yourself, taking it wouldn't make sense for either of us, and we'll tell you that for free.

Also worth knowing, since 2025: Colorado significantly **raised** the caps on what injured people can recover for non-economic harm — the human losses. Cases are being valued under new math. Old assumptions (yours *or* an adjuster's) may be outdated.

**One conversation settles all of this: (720) 821-3784.**

— Jeff

---

## Email 5 — Day 5
**Subject:** Your deadline doesn't care either way
**Preview:** The one thing we can't do later.

{{contact.first_name}},

Last note from me in this series, and it's the plainest one.

Whatever you decide — handle it yourself, hire us, hire someone else — please decide *soon*. Not because of sales pressure: because Colorado's filing deadlines are real, they vary by claim type, some are surprisingly short, and once one passes, the strongest case in the world is worth nothing.

The Claim Game Plan Session is free, it's 30 minutes, and you leave knowing your deadline, your evidence priorities, and whether you need counsel at all. Worst case, you spend half an hour confirming you're fine on your own.

**Call (720) 821-3784** — or book directly and Sky will find a time that works.

Whatever you choose, I hope the recovery goes well.

— Jeff Schell
Managing Director, Whiteford Mountain West

---

## Weekly cadence starters (after day 5 — one per week, story first, offer last)
1. **The chain-law pileup nobody was "at fault" for** → how comparative fault actually gets argued (ties to: disputed-fault cases need preparation).
2. **What a $23 parking-lot camera fee taught us about evidence** → preservation letters and why day-one matters.
3. **The 2025 damages-cap change, explained like a neighbor would** → why old settlement assumptions are stale.
4. **"The adjuster was so nice"** → the difference between a nice person and a fair number.
(Continue drawing topics from the false-belief list in docs/10 §2c. Every email: one story, one idea, one CTA, full footer.)

---

## HighLevel setup (10 minutes, one-time — API can't create workflows, so UI it is)
1. **Automation → Workflows → Create**: trigger = *Contact Tag Added* = `Colorado Personal Injury Lead`.
2. Add the 5 emails above with waits (15 min → 1d → 1d → 1d → 2d). Paste bodies; personalize with {{contact.first_name}}.
3. **Exit/goal:** appointment booked OR contact replied OR tag `do-not-sequence`.
4. Filter guard: skip contacts also tagged `client` or `currently-represented` (Sky sets represented status in the note — optionally add a workflow branch on the `AI Phone Intake` tag to delay email 1 until after the call recording is reviewed).
5. Sender: jeff@ (verified domain), reply-to monitored inbox. Enable open/click tracking.
6. Weekly cadence: separate workflow or scheduled broadcasts to the tag, minus anyone in the intro sequence.
