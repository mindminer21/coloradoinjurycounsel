import Reveal from "./Reveal";

/** False-belief → reframe strip (strategy §2c). Short, honest, no hype. */
const FLIPS = [
  {
    myth: "“My case is too small to bother a lawyer.”",
    truth: "Maybe — and if so, we'll say exactly that, for free. But “small” cases with disputed fault or lingering symptoms are precisely where unrepresented people get shortchanged.",
  },
  {
    myth: "“The insurer's first offer is probably close to fair.”",
    truth: "First offers usually arrive before anyone knows the full cost of your injuries. Once you sign the release, it's over — even if your condition worsens.",
  },
  {
    myth: "“Hiring a lawyer means years in a courtroom.”",
    truth: "Most injury claims resolve by negotiation. Trial preparation is what changes the number — actually going to trial is the exception, not the plan.",
  },
  {
    myth: "“Lawyers just take a third and disappear.”",
    truth: "Our interests are aligned: no fee unless we recover for you, and a free straight answer up front about whether you need counsel at all.",
  },
];

export default function BeliefFlips() {
  return (
    <section className="border-y border-navy/10 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">Straight answers</p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl text-navy md:text-3xl">
            What people get wrong about injury claims
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {FLIPS.map((f, i) => (
            <Reveal key={i} delay={i % 2}>
              <div className="lift-card h-full rounded-sm border border-navy/10 bg-paper p-6">
                <p className="font-display text-[1.05rem] italic text-slateblue">{f.myth}</p>
                <div className="my-3 h-[2px] w-10 bg-gold" aria-hidden />
                <p className="text-[0.95rem] leading-relaxed text-navy-ink/80">{f.truth}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
