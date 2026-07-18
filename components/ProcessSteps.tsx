import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    t: "Tell us what happened",
    d: "A free, confidential conversation — or start with the two-minute case estimator. We listen first; there is no obligation and no pressure.",
  },
  {
    n: "02",
    t: "We investigate and preserve",
    d: "Evidence disappears fast: camera footage gets overwritten, vehicles get repaired, witnesses scatter. We move early to preserve what proves your case.",
  },
  {
    n: "03",
    t: "We build the full value picture",
    d: "Medical costs, future care, lost income, and the human losses Colorado law now values more fully. Insurers discount what isn't documented — we document.",
  },
  {
    n: "04",
    t: "Negotiate from strength — try when needed",
    d: "Most cases resolve by negotiation. When an insurer won't be reasonable, your case is backed by a national trial platform that is genuinely prepared to go to court.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <Reveal>
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">How it works</p>
        <h2 className="mt-2 font-display text-2xl text-navy md:text-3xl">A clear process, from first contact to resolution</h2>
      </Reveal>
      <div className="relative mt-10 grid gap-6 md:grid-cols-4">
        <div className="absolute -top-[2px] left-0 hidden w-full md:block" aria-hidden>
          <Reveal>
            <div className="process-line h-[2px] w-full bg-gradient-to-r from-gold via-gold/60 to-gold/20" />
          </Reveal>
        </div>
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i}>
            <div className="lift-card h-full border-t-2 border-gold pt-5 md:border-t-0">
              <p className="font-display text-sm text-gold">{s.n}</p>
              <h3 className="mt-2 font-display text-lg text-navy">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-ink/70">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
