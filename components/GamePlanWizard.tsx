"use client";
import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";

type Answers = Record<string, string>;

type PlanIssue = { title: string; body: string; urgent: boolean };
type Plan = {
  profile: string;
  issues: PlanIssue[];
  evidenceChecklist: string[];
  strategy: { phase: string; body: string }[];
  insurerBriefing: string[];
  disclaimer: string;
};

const STEPS: { key: string; label: string; help?: string; options: [string, string][] }[] = [
  {
    key: "incidentType",
    label: "Let's narrow this down. What kind of incident were you hurt in?",
    options: [
      ["car", "Car or SUV crash"], ["truck", "Commercial truck crash"], ["motorcycle", "Motorcycle crash"],
      ["pedestrian", "Hit as a pedestrian"], ["bicycle", "Hit while cycling"], ["rideshare", "Rideshare (Uber/Lyft) crash"],
      ["slip-fall", "Fall or unsafe property"], ["dog-bite", "Dog bite"], ["ski", "Ski / mountain recreation"],
      ["work", "Work-related injury"], ["other", "Something else"],
    ],
  },
  {
    key: "timeSince",
    label: "When did it happen?",
    help: "Timing drives everything — some Colorado claims have much shorter clocks than people expect.",
    options: [
      ["under-6mo", "Less than 6 months ago"], ["6-12mo", "6–12 months ago"],
      ["1-2yr", "1–2 years ago"], ["2-3yr", "2–3 years ago"], ["over-3yr", "More than 3 years ago"],
    ],
  },
  {
    key: "govInvolved",
    label: "Was any government vehicle, employee, or public property involved?",
    help: "A city bus, a public road hazard, a government driver — this changes your deadlines dramatically.",
    options: [["no", "No"], ["yes", "Yes"], ["unsure", "I'm not sure"]],
  },
  {
    key: "injuries",
    label: "What best describes the injuries?",
    help: "Your honest sense is fine — this shapes the plan, it isn't a medical assessment.",
    options: [
      ["soft-tissue", "Soft tissue — sprains, whiplash, bruising"],
      ["fractures", "Broken bones / fractures"],
      ["head-spine", "Head, brain, or spine involvement"],
      ["catastrophic", "Catastrophic or permanent injury"],
      ["unsure", "Still being evaluated"],
    ],
  },
  {
    key: "treatment",
    label: "What treatment has happened so far?",
    options: [
      ["none", "None yet"], ["er-only", "ER or urgent care only"],
      ["ongoing", "Ongoing treatment (PT, specialists)"], ["surgery", "Surgery performed or recommended"],
      ["hospitalized", "Hospitalized overnight or longer"],
    ],
  },
  {
    key: "faultPicture",
    label: "How does fault look right now?",
    options: [
      ["other-clear", "Clearly the other party's fault"], ["shared", "Fault may be shared"],
      ["disputed", "The other side denies fault"], ["unknown", "Not clear yet"],
    ],
  },
  {
    key: "insurerContact",
    label: "Where do things stand with the insurance company?",
    options: [
      ["none", "No contact yet"], ["reported-only", "Reported the claim, nothing more"],
      ["adjuster-calls", "An adjuster has been calling me"], ["gave-statement", "I gave a recorded statement"],
      ["offer-received", "They've already made an offer"],
    ],
  },
  {
    key: "workImpact",
    label: "How has this affected your work?",
    options: [
      ["none", "No missed work"], ["missed-some", "Missed some work, back now"],
      ["still-out", "Still unable to work"], ["cant-return", "Can't return to my old job"],
    ],
  },
  {
    key: "county",
    label: "Where in Colorado did it happen?",
    options: [
      ["Denver metro", "Denver metro"], ["El Paso County (Colorado Springs)", "Colorado Springs area"],
      ["Northern Colorado", "Northern Colorado (Fort Collins / Greeley)"], ["Boulder County", "Boulder county"],
      ["the I-70 mountain corridor", "Mountain communities / I-70 corridor"], ["the Western Slope", "Western Slope"],
      ["Southern Colorado", "Southern Colorado / Pueblo"], ["Colorado", "Elsewhere in Colorado"],
    ],
  },
];

const EVIDENCE_OPTIONS: [string, string][] = [
  ["photos", "Photos or video of the scene"],
  ["police-report", "Police / incident report"],
  ["witnesses", "Witness names"],
  ["medical-records", "Medical records or bills"],
  ["incident-report", "Business incident report"],
  ["none-yet", "None of these yet"],
];

export default function GamePlanWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [evidence, setEvidence] = useState<string[]>([]);
  const [state, setState] = useState<"answering" | "evidence" | "contact" | "submitting" | "done" | "soft-error">("answering");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", website: "", consent: false });
  const [validationMsg, setValidationMsg] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [emailStatus, setEmailStatus] = useState("");

  const total = STEPS.length + 2; // + evidence + contact
  const progress = useMemo(() => {
    const done = state === "answering" ? step : state === "evidence" ? STEPS.length : total - 1;
    return Math.min(100, Math.round((done / total) * 100));
  }, [state, step, total]);

  function pick(key: string, v: string) {
    const next = { ...answers, [key]: v };
    setAnswers(next);
    if (step + 1 < STEPS.length) setStep(step + 1);
    else setState("evidence");
  }

  function toggleEvidence(v: string) {
    setEvidence((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev.filter((x) => x !== "none-yet" && v !== "none-yet"), v]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.firstName.trim() || !contact.lastName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setValidationMsg("Please provide your first name, last name, and a valid email.");
      return;
    }
    if (!contact.consent) {
      setValidationMsg("Please check the consent box so we can send your Game Plan.");
      return;
    }
    setValidationMsg("");
    setState("submitting");
    try {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const utm: Record<string, string> = {};
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
        const v = params.get(k);
        if (v) utm[k] = v;
      }
      const res = await fetch("/api/gameplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: { ...answers, evidence },
          contact: { firstName: contact.firstName, lastName: contact.lastName, email: contact.email, phone: contact.phone, address: contact.address },
          website: contact.website,
          utm,
        }),
      });
      const data = await res.json();
      if (data?.plan) {
        setPlan(data.plan as Plan);
        setEmailStatus(String(data.emailStatus || ""));
        setState("done");
      } else setState("soft-error");
    } catch {
      setState("soft-error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-sm border border-navy/10 bg-white shadow-[0_20px_60px_rgba(2,27,44,0.08)]">
      <div className="h-1.5 w-full bg-navy/10">
        <div className="step-bar h-full bg-gold" style={{ width: `${progress}%` }} aria-hidden />
      </div>
      <div className="p-6 md:p-10">
        {state === "answering" && (
          <div key={step}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slateblue">
              Narrowing your issues — {step + 1} of {total}
            </p>
            <h2 className="mt-2 font-display text-xl text-navy md:text-2xl">{STEPS[step].label}</h2>
            {STEPS[step].help && <p className="mt-2 text-sm text-navy-ink/60">{STEPS[step].help}</p>}
            <div className="mt-6 grid gap-2.5">
              {STEPS[step].options.map(([v, label]) => (
                <button key={v} onClick={() => pick(STEPS[step].key, v)}
                  className="group flex items-center justify-between rounded-sm border border-navy/15 bg-paper px-5 py-3.5 text-left text-[0.95rem] font-medium text-navy transition-all hover:-translate-y-px hover:border-gold hover:bg-white hover:shadow-md">
                  {label}
                  <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>→</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="mt-5 text-sm text-slateblue underline underline-offset-4">← Back</button>
            )}
          </div>
        )}

        {state === "evidence" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slateblue">Almost there — {STEPS.length + 1} of {total}</p>
            <h2 className="mt-2 font-display text-xl text-navy md:text-2xl">What evidence do you already have?</h2>
            <p className="mt-2 text-sm text-navy-ink/60">Select everything that applies — your plan will cover what to gather next.</p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {EVIDENCE_OPTIONS.map(([v, label]) => (
                <button key={v} onClick={() => toggleEvidence(v)}
                  className={`rounded-sm border px-5 py-3.5 text-left text-[0.95rem] font-medium transition-all ${
                    evidence.includes(v) ? "border-gold bg-gold/10 text-navy" : "border-navy/15 bg-paper text-navy hover:border-gold"}`}>
                  {evidence.includes(v) ? "✓ " : ""}{label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button onClick={() => setState("contact")}
                className="cta-gold rounded-sm bg-gold px-6 py-3.5 font-semibold text-navy-ink transition-transform hover:-translate-y-0.5">
                Continue →
              </button>
              <button onClick={() => { setState("answering"); setStep(STEPS.length - 1); }} className="text-sm text-slateblue underline underline-offset-4">← Back</button>
            </div>
          </div>
        )}

        {state === "contact" && (
          <form onSubmit={submit} noValidate>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slateblue">Last step — {total} of {total}</p>
            <h2 className="mt-2 font-display text-xl text-navy md:text-2xl">Where should we send your Game Plan?</h2>
            <p className="mt-2 text-sm text-navy-ink/60">
              You&apos;ll see it on screen immediately, get a copy by email, and our Colorado team saves your answers so the attorney reviewing your matter starts fully briefed.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-navy">
                First name*
                <input value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} required autoComplete="given-name"
                  className="mt-1.5 w-full rounded-sm border border-navy/20 bg-paper px-4 py-3 text-navy-ink outline-none transition-colors focus:border-gold" />
              </label>
              <label className="block text-sm font-medium text-navy">
                Last name*
                <input value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} required autoComplete="family-name"
                  className="mt-1.5 w-full rounded-sm border border-navy/20 bg-paper px-4 py-3 text-navy-ink outline-none transition-colors focus:border-gold" />
              </label>
              <label className="block text-sm font-medium text-navy sm:col-span-2">
                Email*
                <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required autoComplete="email"
                  className="mt-1.5 w-full rounded-sm border border-navy/20 bg-paper px-4 py-3 text-navy-ink outline-none transition-colors focus:border-gold" />
              </label>
              <label className="block text-sm font-medium text-navy sm:col-span-2">
                Phone <span className="font-normal text-navy-ink/50">(optional — our team can call to walk through the plan)</span>
                <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} autoComplete="tel"
                  className="mt-1.5 w-full rounded-sm border border-navy/20 bg-paper px-4 py-3 text-navy-ink outline-none transition-colors focus:border-gold" />
              </label>
              <label className="block text-sm font-medium text-navy sm:col-span-2">
                Primary home address <span className="font-normal text-navy-ink/50">(street, city, state ZIP — so we can run our conflicts check and have your paperwork ready if you choose to engage us)</span>
                <input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} autoComplete="street-address"
                  placeholder="123 Main St, Denver, CO 80211"
                  className="mt-1.5 w-full rounded-sm border border-navy/20 bg-paper px-4 py-3 text-navy-ink outline-none transition-colors focus:border-gold" />
              </label>
              <input tabIndex={-1} autoComplete="off" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })}
                name="website" className="hidden" aria-hidden="true" />
            </div>
            <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-navy-ink/70">
              <input type="checkbox" checked={contact.consent} onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
                className="mt-0.5 h-4 w-4 accent-[#C6A15B]" />
              <span>
                I agree that Whiteford Mountain West may contact me about my inquiry by email or phone, including sending my Game Plan
                and related information. I understand this Game Plan is general educational information — it is <strong>not legal
                advice about my case and does not create an attorney–client relationship</strong>.
              </span>
            </label>
            {validationMsg && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{validationMsg}</p>}
            <button type="submit" className="cta-gold mt-6 w-full rounded-sm bg-gold px-6 py-4 font-semibold text-navy-ink transition-transform hover:-translate-y-0.5">
              Build my Claim Game Plan
            </button>
          </form>
        )}

        {state === "submitting" && (
          <div className="py-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-navy/20 border-t-gold" aria-hidden />
            <p className="mt-4 text-sm text-navy-ink/60">Narrowing your issues and assembling your plan…</p>
          </div>
        )}

        {state === "done" && plan && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slateblue">Your Claim Game Plan</p>
            <h2 className="mt-2 font-display text-2xl text-navy">Here&apos;s how a claim like yours typically gets handled.</h2>
            <p className="mt-3 rounded-sm border border-navy/10 bg-paper px-4 py-3 text-sm text-navy-ink/80"><strong>Matter profile:</strong> {plan.profile}</p>

            <h3 className="mt-8 font-display text-lg text-navy">Issues we spotted</h3>
            <div className="mt-3 grid gap-3">
              {plan.issues.map((i) => (
                <div key={i.title} className={`rounded-sm border p-4 ${i.urgent ? "border-gold bg-gold/[0.07]" : "border-navy/10 bg-white"}`}>
                  <div className="text-sm font-semibold text-navy">
                    {i.urgent && <span className="mr-2 rounded-sm bg-gold px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-navy-ink">Time-sensitive</span>}
                    {i.title}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-ink/75">{i.body}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 font-display text-lg text-navy">Evidence to preserve now</h3>
            <ul className="mt-3 grid gap-2">
              {plan.evidenceChecklist.map((e) => (
                <li key={e.slice(0, 40)} className="flex gap-2.5 text-sm leading-relaxed text-navy-ink/80"><span className="text-gold">✓</span>{e}</li>
              ))}
            </ul>

            <h3 className="mt-8 font-display text-lg text-navy">A hypothetical strategy arc</h3>
            <div className="mt-3 grid gap-3">
              {plan.strategy.map((s) => (
                <div key={s.phase} className="rounded-sm border border-navy/10 bg-white p-4">
                  <div className="text-sm font-semibold text-navy">{s.phase}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-ink/75">{s.body}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 font-display text-lg text-navy">Before you talk to any insurer</h3>
            <ul className="mt-3 grid gap-2">
              {plan.insurerBriefing.map((b) => (
                <li key={b.slice(0, 40)} className="flex gap-2.5 text-sm leading-relaxed text-navy-ink/80"><span className="text-gold">•</span>{b}</li>
              ))}
            </ul>

            <div className="mt-9 rounded-sm border border-navy/10 bg-paper p-5">
              <p className="text-sm text-navy-ink/80">
                {emailStatus === "sent"
                  ? "📬 A copy of this Game Plan is on its way to your inbox."
                  : "📬 A copy of this Game Plan will arrive in your inbox shortly."}{" "}
                The next step — and the one that actually protects your claim — is a free follow-up session where a Whiteford attorney pressure-tests this plan against your specific facts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={SITE.calBookingUrl} target="_blank" rel="noopener noreferrer"
                  className="cta-gold rounded-sm bg-gold px-6 py-3.5 font-semibold text-navy-ink transition-transform hover:-translate-y-0.5">
                  Schedule my free attorney session
                </a>
                <a href={SITE.phoneHref} className="rounded-sm border border-navy/20 px-6 py-3.5 font-semibold text-navy transition-colors hover:border-gold hover:text-gold">
                  Or call {SITE.phone} — 24/7
                </a>
              </div>
            </div>

            <p className="mt-6 text-[0.72rem] leading-relaxed text-navy-ink/50">{plan.disclaimer}</p>
          </div>
        )}

        {state === "soft-error" && (
          <div className="py-10 text-center">
            <h2 className="font-display text-xl text-navy">We hit a snag building your plan.</h2>
            <p className="mt-3 text-sm text-navy-ink/70">
              Please call us at <a className="font-semibold text-gold" href={SITE.phoneHref}>{SITE.phone}</a> — answered 24/7 — and we&apos;ll walk through everything by phone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
