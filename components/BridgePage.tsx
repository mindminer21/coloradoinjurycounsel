import Link from "next/link";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import OfferStack from "./OfferStack";
import LawContext from "./LawContext";
import AttorneyCards from "./AttorneyCards";

export type BridgeContent = {
  eyebrow: string;
  h1: string;
  lede: string;
  story: { heading?: string; paragraphs: string[] }[];
  doNow: { t: string; d: string }[];
  snapshotPitch: string;
};

/** Story-first long-bridge template for cold traffic (strategy §3). */
export default function BridgePage({ c }: { c: BridgeContent }) {
  return (
    <>
      <section className="grain relative overflow-hidden bg-navy-deep text-white">
        <div className="sky-glow pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_-10%,rgba(143,184,212,0.25),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-16 md:px-6 md:pt-24">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">{c.eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl leading-[1.15] md:text-5xl">{c.h1}</h1>
          <div className="hairline mt-6 h-[3px] w-24 bg-gradient-to-r from-gold to-gold/30" aria-hidden />
          <p className="mt-6 text-lg leading-relaxed text-white/80">{c.lede}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="prose-wm py-12">
          {c.story.map((sec, i) => (
            <Reveal key={i}>
              <section>
                {sec.heading && <h2>{sec.heading}</h2>}
                {sec.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <aside className="mb-4 rounded-sm border-l-2 border-gold bg-white p-6 md:p-8">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">What to do right now</p>
            <div className="mt-4 space-y-4">
              {c.doNow.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-gold font-display text-xs font-bold text-navy-ink" aria-hidden>{i + 1}</span>
                  <p className="text-[0.98rem] leading-relaxed text-navy-ink/85"><strong className="text-navy">{d.t}.</strong> {d.d}</p>
                </div>
              ))}
            </div>
          </aside>
        </Reveal>

        <Reveal>
          <div className="my-10 rounded-sm bg-navy p-7 text-white md:p-9">
            <p className="font-display text-2xl leading-snug">{c.snapshotPitch}</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/case-estimator" className="cta-gold inline-flex rounded-sm bg-gold px-6 py-3.5 font-semibold text-navy-ink">
                {SITE.offers.snapshot.cta}
              </Link>
              <a href={SITE.phoneHref} className="inline-flex rounded-sm border border-white/30 px-6 py-3.5 font-semibold text-white hover:border-gold-soft hover:text-gold-soft">
                Call {SITE.phone} — 24/7
              </a>
            </div>
            <p className="mt-4 text-xs text-white/50">
              Free and confidential. Educational only — not legal advice, not a valuation, no attorney–client relationship created.
            </p>
          </div>
        </Reveal>
      </article>

      <LawContext />
      <OfferStack />
      <AttorneyCards />
    </>
  );
}
