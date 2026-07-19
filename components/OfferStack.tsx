import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

/** The named consultation offer, stacked ($100M Offers: concrete deliverables, guarantee-led). */
export default function OfferStack() {
  const o = SITE.offers.session;
  return (
    <section className="grain relative overflow-hidden bg-navy py-16 text-white md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_20%_0%,rgba(143,184,212,0.14),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">Not another &quot;free consultation&quot;</p>
              <h2 className="mt-2 font-display text-3xl leading-tight md:text-4xl">The {o.name}</h2>
              <p className="mt-4 max-w-xl text-white/75">{o.sub}</p>
              <div className="mt-7 rounded-sm border border-gold/50 bg-navy-deep/60 p-5">
                <p className="font-display text-xl text-gold-soft">{SITE.offers.guarantee}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">{SITE.offers.guaranteeNote}</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="/game-plan"
                  className="cta-gold inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-[0.95rem] font-semibold text-navy-ink shadow-[0_10px_35px_rgba(198,161,91,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  Build my free Claim Game Plan →
                </a>
                <a href={SITE.phoneHref} className="glass-dark inline-flex items-center rounded-sm px-6 py-3.5 text-[0.95rem] font-semibold text-white transition-colors hover:text-gold-soft">
                  Or call {SITE.phone} — answered 24/7
                </a>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-3">
            {o.deliverables.map((d, i) => (
              <Reveal key={d.t} delay={Math.min(i, 3)}>
                <div className="lift-card flex gap-4 rounded-sm border border-white/10 bg-navy-deep/70 p-5">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-gold font-display text-sm font-bold text-navy-ink" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-[1.05rem] text-gold-soft">{d.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{d.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={3}>
              <p className="px-1 text-xs leading-relaxed text-white/45">
                You leave with all four — whether or not you ever hire us. No pressure, no obligation, no fine print.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
