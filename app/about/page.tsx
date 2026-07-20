import type { Metadata } from "next";
import AttorneyCards from "@/components/AttorneyCards";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Attorneys | Whiteford Mountain West — Denver Personal Injury",
  description:
    "Meet the Whiteford Mountain West team: Denver-based Managing Director Jeffrey Schell with trial partners Masten Childers III and Paul Nussbaum of Whiteford's national litigation platform.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">About us</p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            Big-firm resources. Front-porch accessibility.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75">
            Whiteford Mountain West is the Colorado front door to Whiteford — a full-service law firm with a
            national litigation platform. Injured Coloradans get a Colorado attorney you can meet with
            face-to-face, backed by top-tier national trial lawyers who have handled some of the most complex
            injury litigation in the country.
          </p>
        </div>
      </section>
      <AttorneyCards full />
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <Reveal>
          <div className="prose-wm">
            <h2>Why this structure works for injured Coloradans</h2>
            <p>
              Most injury firms are either small local shops or high-volume settlement mills. We built Whiteford
              Mountain West differently: local leadership in Denver for accessibility and accountability, connected
              to a deep national bench for the moments that decide cases — complex liability investigation, coverage
              disputes, and trial.
            </p>
            <p>
              Call <a href={SITE.phoneHref} className="font-semibold">{SITE.phone}</a> to schedule your free
              consultation — our intake team will find a time that works for you. If your case isn&apos;t one we can
              help with, we&apos;ll tell you straight and point you in the right direction.
            </p>
          </div>
        </Reveal>
      </section>
      <CtaBand />
    </>
  );
}
