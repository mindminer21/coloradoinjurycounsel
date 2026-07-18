import Link from "next/link";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function CtaBand({ context }: { context?: string }) {
  return (
    <section className="grain relative overflow-hidden bg-navy py-16 text-white md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_80%_0%,rgba(198,161,91,0.18),transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[{ l: "12%", d: 0 }, { l: "45%", d: 5 }, { l: "78%", d: 9 }].map((p, i) => (
          <span key={i} className="particle bottom-[8%]" style={{ left: p.l, width: 4, height: 4, ["--dur" as never]: "17s", ["--delay" as never]: `${p.d}s`, ["--op" as never]: 0.4, ["--drift" as never]: "20px" }} />
        ))}
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
        <Reveal>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">
            What could {context || "your case"} be worth?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            The free {SITE.offers.snapshot.name} walks through the factors that actually drive Colorado injury
            case value — severity, treatment, fault, and documented losses — and returns an educational range in
            about two minutes. No obligation, and no pressure. Want a real answer instead? Book a free
            {" "}{SITE.offers.session.name} and leave with a plan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/case-estimator"
              className="cta-gold inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-4 font-semibold text-navy-ink shadow-[0_10px_30px_rgba(198,161,91,0.35)] transition-transform hover:-translate-y-0.5"
            >
              {SITE.offers.snapshot.cta}
            </Link>
            <a
              href={SITE.calBookingUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-sm border border-gold/60 px-7 py-4 font-semibold text-gold-soft transition-colors hover:bg-gold hover:text-navy-ink"
            >
              {SITE.offers.session.cta}
            </a>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-7 py-4 font-semibold text-white transition-colors hover:border-gold-soft hover:text-gold-soft">
              Or call {SITE.phone} — 24/7
            </a>
          </div>
          <p className="mt-5 text-xs text-white/45">
            Educational estimate only — not legal advice, not a case valuation, and no attorney–client relationship is created.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
