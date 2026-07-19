/**
 * Claim Game Plan generator — the "technical lead magnet" engine.
 *
 * COMPLIANCE ARCHITECTURE (do not relax):
 * - This module is deliberately rules-based, not a free-generating LLM: every sentence
 *   below was authored for attorney review, so the "AI" can never hallucinate law,
 *   promise outcomes, or give advice about a specific case.
 * - NO statute numbers, NO deadline durations, NO dollar figures here. The vetted
 *   <LawContext /> component is the single source of legal figures on the site.
 * - Everything is framed as educational and hypothetical ("in cases with facts like
 *   these, attorneys typically…"). The disclaimer must always accompany the plan.
 */

export type GamePlanInput = {
  incidentType:
    | "car" | "truck" | "motorcycle" | "pedestrian" | "bicycle" | "rideshare"
    | "slip-fall" | "dog-bite" | "ski" | "work" | "other";
  timeSince: "under-6mo" | "6-12mo" | "1-2yr" | "2-3yr" | "over-3yr";
  govInvolved: "yes" | "no" | "unsure";
  injuries: "soft-tissue" | "fractures" | "head-spine" | "catastrophic" | "unsure";
  treatment: "none" | "er-only" | "ongoing" | "surgery" | "hospitalized";
  faultPicture: "other-clear" | "shared" | "disputed" | "unknown";
  insurerContact: "none" | "reported-only" | "adjuster-calls" | "gave-statement" | "offer-received";
  evidence: string[]; // photos | police-report | witnesses | medical-records | incident-report | none-yet
  workImpact: "none" | "missed-some" | "still-out" | "cant-return";
  county: string;
};

export type GamePlan = {
  profile: string;
  issues: { title: string; body: string; urgent: boolean }[];
  evidenceChecklist: string[];
  strategy: { phase: string; body: string }[];
  insurerBriefing: string[];
  disclaimer: string;
};

const TYPE_LABEL: Record<GamePlanInput["incidentType"], string> = {
  car: "car crash", truck: "commercial truck crash", motorcycle: "motorcycle crash",
  pedestrian: "pedestrian collision", bicycle: "bicycle collision", rideshare: "rideshare crash",
  "slip-fall": "fall on someone else's property", "dog-bite": "dog attack",
  ski: "ski-area incident", work: "work-related injury", other: "injury incident",
};

const EVIDENCE_BY_TYPE: Record<GamePlanInput["incidentType"], string[]> = {
  car: [
    "Photos of all vehicles, the roadway, skid marks, debris field, and traffic controls — from multiple angles, before repairs.",
    "The police report number and responding agency (you can request the report yourself).",
    "Names and phone numbers of every witness, even ones who 'didn't see much.'",
    "Your own dash-cam footage, and a note of nearby businesses whose cameras may have caught the crash — that footage is often overwritten within days.",
  ],
  truck: [
    "The trucking company name, DOT number, and trailer number from any photos you have.",
    "The police report number — commercial crashes often generate a more detailed investigation file.",
    "A written timeline of the crash while it's fresh: lane positions, speeds, what the driver said.",
    "Do not communicate with the carrier's 'rapid response' team before speaking with an attorney; trucking companies often have investigators on scene the same day.",
  ],
  motorcycle: [
    "Photos of your bike, gear, and helmet exactly as they were after the crash — don't repair or discard anything yet.",
    "The police report number, plus your own diagram of the intersection or roadway.",
    "Witness contacts — bias against riders is real, and neutral witnesses matter more in these cases.",
    "Nearby camera sources (intersections, businesses, doorbells) noted by address.",
  ],
  pedestrian: [
    "Photos of the crosswalk, signals, lighting conditions, and vehicle position.",
    "The police report number and any citation issued to the driver.",
    "Witness names — pedestrian cases often turn on a few seconds of observed behavior.",
    "The clothing and shoes you were wearing, preserved as-is.",
  ],
  bicycle: [
    "Your bike and helmet preserved as-is — they are physical evidence of impact forces.",
    "Photos of the roadway, bike lane markings, and vehicle position.",
    "The police report number and witness contacts.",
    "Ride-tracking app data (Strava, Garmin, phone) showing your speed and position.",
  ],
  rideshare: [
    "Screenshots of the trip in your rideshare app: driver, route, timestamps, receipt.",
    "The police report number, plus photos of vehicles and the scene.",
    "Which 'period' the driver was in (waiting, en route, carrying a passenger) — it affects which insurance applies; your trip screenshots help establish this.",
    "Witness names and any statement the driver made about the app being on.",
  ],
  "slip-fall": [
    "Photos of the exact hazard — the spill, ice patch, broken step, lighting — taken as soon as possible; hazards get fixed fast.",
    "The incident report if one was made, and the name of the manager or employee you reported it to.",
    "The shoes you were wearing, preserved as-is.",
    "Witness contacts, and a written note of what employees said ('we've been meaning to fix that' matters).",
  ],
  "dog-bite": [
    "Photos of your injuries on day one and as they heal — bite injuries change appearance quickly.",
    "The dog owner's name, address, and homeowner's/renter's insurance carrier if known.",
    "Animal-control or sheriff's report number.",
    "Names of anyone who knows the dog's history of aggression.",
  ],
  ski: [
    "Your lift ticket or pass, trail map, and photos of the run, signage, and conditions.",
    "The ski patrol incident report and the names of patrollers involved.",
    "Contact info for anyone who saw the collision or hazard.",
    "Your equipment preserved as-is, and any helmet-cam or phone footage.",
  ],
  work: [
    "The incident report you filed with your employer, and the date you reported it.",
    "Names of coworkers who saw the incident or the hazardous condition.",
    "Photos of the equipment, site, or condition involved.",
    "A list of every company on the site (general contractor, subs, equipment owners) — third-party claims beyond workers' comp often hide here.",
  ],
  other: [
    "Photos of the scene, the hazard, and your injuries, taken as early as possible.",
    "Any incident or police report number.",
    "Witness names and phone numbers.",
    "A dated, written account of what happened while your memory is fresh.",
  ],
};

export function generateGamePlan(a: GamePlanInput): GamePlan {
  const typeLabel = TYPE_LABEL[a.incidentType];
  const issues: GamePlan["issues"] = [];

  // — Issue spotting: deadlines —
  if (a.govInvolved === "yes" || a.govInvolved === "unsure") {
    issues.push({
      title: "Possible government-entity notice requirement",
      urgent: true,
      body:
        a.govInvolved === "yes"
          ? "A government vehicle, employee, or public property appears to be involved. Claims against Colorado public entities require a formal written notice on a much shorter clock than ordinary claims — measured in months, not years — and missing it can end an otherwise strong claim. In cases like this, attorneys typically treat the notice letter as the first task on the file."
          : "You weren't sure whether a government entity is involved (public road maintenance, transit vehicle, public property). Because claims involving public entities carry a much shorter formal-notice clock, attorneys typically resolve this question first — it changes the entire timeline.",
    });
  }
  if (a.timeSince === "1-2yr" || a.timeSince === "2-3yr") {
    issues.push({
      title: "Your filing window needs immediate attention",
      urgent: true,
      body:
        "Based on when this happened, a meaningful part of your legal filing window has already run. Colorado's deadlines vary by claim type — some are shorter than people assume — and once a deadline passes, the claim is generally gone regardless of its merits. In this posture, attorneys typically calendar the exact deadline on day one and work backward from it.",
    });
  } else if (a.timeSince === "over-3yr") {
    issues.push({
      title: "Deadline viability must be checked first",
      urgent: true,
      body:
        "Given the time elapsed, the first question an attorney would examine is whether any claim remains timely — some circumstances pause or extend deadlines (for example, injuries discovered later, or claims involving minors), but this needs a specific legal check before anything else.",
    });
  }

  // — Fault posture —
  if (a.faultPicture === "shared") {
    issues.push({
      title: "Shared-fault arguments will be central",
      urgent: false,
      body:
        "You indicated fault may be shared. Colorado reduces recoveries in proportion to a person's share of fault, and bars recovery when that share gets too high — so insurers work hard to shift percentage points onto the injured person. In cases with facts like these, attorneys typically invest early in evidence that pins down the sequence of events (scene photos, witness statements, digital data) before memories soften.",
    });
  } else if (a.faultPicture === "disputed" || a.faultPicture === "unknown") {
    issues.push({
      title: "Liability is contested — evidence is the case",
      urgent: false,
      body:
        "When the other side denies fault, the claim's value tracks the strength of the liability evidence almost one-to-one. Hypothetically, the working strategy in this posture is investigation-first: lock down physical evidence, identify every camera, and get witness accounts in writing before the insurer's version of events hardens.",
    });
  }

  // — Treatment posture —
  if (a.treatment === "none") {
    issues.push({
      title: "The treatment gap is the insurer's favorite argument",
      urgent: true,
      body:
        "You haven't been evaluated by a doctor yet. Beyond your health — which comes first — gaps between an incident and treatment are the single most common reason adjusters discount claims ('if you were really hurt, you'd have seen someone'). Getting evaluated promptly protects both your recovery and your claim's credibility.",
    });
  } else if (a.treatment === "ongoing" || a.treatment === "surgery" || a.treatment === "hospitalized") {
    issues.push({
      title: "Don't let the insurer rush you to settle mid-treatment",
      urgent: false,
      body:
        "You're still treating. A settlement signed today would waive compensation for care you don't yet know you'll need. In cases like this, attorneys typically wait for the medical picture to stabilize — or for doctors to project future care — before valuing the claim, while using the waiting period to build the liability file.",
    });
  }

  // — Insurer contact posture —
  if (a.insurerContact === "gave-statement") {
    issues.push({
      title: "A recorded statement is already in the file",
      urgent: false,
      body:
        "You've given the insurer a recorded statement. That's not fatal — but everything in it will be compared against your medical records and later testimony, so consistency now matters. Attorneys typically request a copy of the statement early and shape the claim presentation around it.",
    });
  } else if (a.insurerContact === "offer-received") {
    issues.push({
      title: "An early offer is on the table — treat it as information",
      urgent: false,
      body:
        "Early offers are usually made before the full cost of the injury is knowable, which is precisely why they come early. Hypothetically, attorneys treat a first offer as the insurer's opening data point about how they've triaged the claim — useful information, rarely the end point.",
    });
  }

  // — Work impact —
  if (a.workImpact === "still-out" || a.workImpact === "cant-return") {
    issues.push({
      title: "Lost earning capacity needs to be documented now",
      urgent: false,
      body:
        "Your work has been significantly affected. Beyond past paychecks, claims like this often include diminished future earning capacity — which requires contemporaneous documentation: work restrictions from doctors, employer letters, and a record of missed opportunities. Attorneys typically start this paper trail immediately because it's hard to rebuild later.",
    });
  }
  if (a.incidentType === "work") {
    issues.push({
      title: "Workers' comp and third-party claims run on separate tracks",
      urgent: false,
      body:
        "Work injuries often involve two systems at once: the workers' compensation claim with your employer's carrier, and potential third-party claims against other companies or equipment makers involved. They have different deadlines, different rules, and different recoveries — attorneys typically map both tracks before either is compromised.",
    });
  }
  if (a.injuries === "head-spine" || a.injuries === "catastrophic") {
    issues.push({
      title: "Serious-injury claims justify serious infrastructure",
      urgent: false,
      body:
        "Head, spine, and catastrophic injuries change the scale of a claim: life-care planning, future medical projections, and expert testimony typically drive the outcome more than the initial bills do. This is where a firm's trial capacity matters most — insurers value these claims differently when the firm across the table actually tries cases.",
    });
  }

  // — Strategy arc (hypothetical, tailored) —
  const strategy: GamePlan["strategy"] = [
    {
      phase: "Phase 1 — Preserve & investigate (now)",
      body:
        `Lock down the evidence in the checklist below before it disappears, ${
          a.govInvolved !== "no" ? "resolve the government-entity question and calendar every notice deadline, " : "calendar the filing deadline, "
        }and stop direct insurer conversations while the facts are gathered. ${
          a.faultPicture === "disputed" || a.faultPicture === "unknown"
            ? "Because fault is contested, this phase is the case: camera canvass, witness statements in writing, and scene documentation come first."
            : "With fault reasonably clear, this phase moves fast and protects the record."
        }`,
    },
    {
      phase: "Phase 2 — Treat & document (weeks to months)",
      body:
        `${
          a.treatment === "none"
            ? "Get medically evaluated now, then follow the treatment plan without gaps — "
            : "Continue treatment without gaps — "
        }every appointment builds both your recovery and the claim's record. Meanwhile the file grows: medical records and bills, wage documentation${
          a.workImpact === "still-out" || a.workImpact === "cant-return" ? ", work restrictions and employer letters" : ""
        }, and a day-in-the-life record of how the injury actually affects you. Claims are won on documentation assembled during this phase.`,
    },
    {
      phase: "Phase 3 — Value, demand & resolve (after the picture stabilizes)",
      body:
        `Once the medical picture stabilizes, the claim gets valued on the full record — past and future medical care, lost earnings, and non-economic harm — and presented in a demand package. ${
          a.insurerContact === "offer-received"
            ? "The early offer you received becomes a data point, not an anchor. "
            : ""
        }Most claims resolve in negotiation; the ones that don't go to litigation, and insurers price that possibility into every offer based on whether the firm across the table actually tries cases. That's the quiet leverage a trial bench provides from day one.`,
    },
  ];

  const insurerBriefing = [
    "You are not required to give the other side's insurer a recorded statement — and what feels like a friendly intake call is a claims-evaluation interview.",
    "\"How are you doing today?\" is a documented question. \"Fine, thanks\" ends up in the file.",
    "Don't sign medical authorizations that give an insurer your entire history — scope matters.",
    "Politely decline to discuss fault, injuries, or settlement until you've spoken with an attorney; provide only basic identifying and policy information to your own insurer as your policy requires.",
    a.insurerContact === "adjuster-calls"
      ? "Since the adjuster is already calling: you can say, \"I'm getting advice on this claim — please put further questions in writing.\" That one sentence changes the dynamic."
      : "If an adjuster starts calling, one sentence changes the dynamic: \"I'm getting advice on this claim — please put further questions in writing.\"",
  ];

  const profile = `A ${typeLabel}${a.county ? ` in ${a.county}` : ""}, ${
    { "under-6mo": "within the last six months", "6-12mo": "six to twelve months ago", "1-2yr": "one to two years ago", "2-3yr": "two to three years ago", "over-3yr": "more than three years ago" }[a.timeSince]
  }, with ${
    { "soft-tissue": "soft-tissue injuries", fractures: "fracture injuries", "head-spine": "head or spine involvement", catastrophic: "catastrophic injuries", unsure: "injuries still being evaluated" }[a.injuries]
  } and ${
    { none: "no medical evaluation yet", "er-only": "an ER visit", ongoing: "ongoing treatment", surgery: "surgery", hospitalized: "hospitalization" }[a.treatment]
  }; fault ${
    { "other-clear": "appears to rest with the other party", shared: "may be shared", disputed: "is disputed", unknown: "is not yet clear" }[a.faultPicture]
  }.`;

  return {
    profile,
    issues,
    evidenceChecklist: EVIDENCE_BY_TYPE[a.incidentType],
    strategy,
    insurerBriefing,
    disclaimer:
      "This Game Plan is educational information about how injury claims generally work in Colorado — it is not legal advice about your case, and it does not create an attorney–client relationship. Every case depends on its specific facts; deadlines and outcomes vary. An attorney will give you the real picture in your free follow-up consultation. Attorney Advertising.",
  };
}

/** Plain-text rendering for CRM notes and email. */
export function renderGamePlanText(plan: GamePlan): string {
  const L: string[] = [];
  L.push("YOUR COLORADO CLAIM GAME PLAN — Whiteford Mountain West");
  L.push("");
  L.push("MATTER PROFILE: " + plan.profile);
  L.push("");
  L.push("ISSUES WE SPOTTED:");
  for (const i of plan.issues) L.push(`${i.urgent ? "[TIME-SENSITIVE] " : ""}${i.title} — ${i.body}`);
  L.push("");
  L.push("EVIDENCE TO PRESERVE NOW:");
  for (const e of plan.evidenceChecklist) L.push("• " + e);
  L.push("");
  L.push("A HYPOTHETICAL STRATEGY ARC:");
  for (const s of plan.strategy) L.push(`${s.phase}: ${s.body}`);
  L.push("");
  L.push("BEFORE YOU TALK TO ANY INSURER:");
  for (const b of plan.insurerBriefing) L.push("• " + b);
  L.push("");
  L.push(plan.disclaimer);
  return L.join("\n");
}
