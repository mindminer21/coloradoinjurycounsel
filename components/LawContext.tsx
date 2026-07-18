import Reveal from "./Reveal";

/**
 * The ONLY place legal specifics (statutes, dollar figures, deadlines) are stated.
 * Verified against primary sources 2026-07 (leg.colorado.gov). Content pages may not
 * state their own figures — they reference this block.
 */
export default function LawContext() {
  return (
    <section className="border-y border-navy/10 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">Colorado law, current</p>
          <h2 className="mt-2 font-display text-2xl text-navy md:text-3xl">What changed for Colorado injury claims in 2025</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Reveal delay={0}>
            <div className="lift-card glass-gold-edge h-full rounded-sm border border-navy/10 bg-paper p-6 hover:shadow-[0_20px_50px_rgba(2,27,44,0.12)]">
              <p className="font-display text-3xl text-navy">$1.5M</p>
              <p className="mt-2 text-sm font-semibold text-navy">Higher cap on non-economic damages</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-ink/70">
                For most Colorado tort cases <em>filed on or after January 1, 2025</em>, HB24-1472 raised the cap on
                non-economic damages (pain, suffering, loss of enjoyment) to $1,500,000 — adjusted for inflation
                every two years beginning in 2028. Economic damages such as medical bills and lost income are
                generally not capped.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="lift-card glass-gold-edge h-full rounded-sm border border-navy/10 bg-paper p-6 hover:shadow-[0_20px_50px_rgba(2,27,44,0.12)]">
              <p className="font-display text-3xl text-navy">$2.125M</p>
              <p className="mt-2 text-sm font-semibold text-navy">Wrongful-death non-economic cap</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-ink/70">
                The same law raised the non-economic cap in wrongful-death actions to $2,125,000 and, for the first
                time, allows siblings of the deceased to bring wrongful-death claims in certain circumstances.
                Medical-liability cases follow separate, phased caps.
              </p>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="lift-card glass-gold-edge h-full rounded-sm border border-navy/10 bg-paper p-6 hover:shadow-[0_20px_50px_rgba(2,27,44,0.12)]">
              <p className="font-display text-3xl text-navy">2–3 yrs</p>
              <p className="mt-2 text-sm font-semibold text-navy">Deadlines still apply — and vary</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-ink/70">
                Colorado&apos;s filing deadlines are unforgiving: generally two years for most injury claims and three
                years for motor-vehicle claims, with much shorter notice windows (182 days) for claims against
                government entities. Exceptions exist in both directions — confirm your specific deadline with an
                attorney promptly.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={1}>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-navy-ink/50">
            Sources: Colorado HB24-1472 (2024); C.R.S. §§ 13-21-102.5, 13-21-203, 13-80-101 et seq., 24-10-109. This
            summary is general information, not legal advice; amounts are subject to statutory adjustment and
            case-specific exceptions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
