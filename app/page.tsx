import type { Metadata } from "next";
import Link from "next/link";
import AnimatedHero from "@/components/AnimatedHero";
import TrustBar from "@/components/TrustBar";
import TrialResults from "@/components/TrialResults";
import ProcessSteps from "@/components/ProcessSteps";
import LawContext from "@/components/LawContext";
import AttorneyCards from "@/components/AttorneyCards";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import ScrollFilm from "@/components/ScrollFilm";
import OfferStack from "@/components/OfferStack";
import BeliefFlips from "@/components/BeliefFlips";

export const metadata: Metadata = {
  title: "Colorado Personal Injury Attorneys | Whiteford Mountain West — Denver",
  description:
    "Injured in Colorado? Whiteford Mountain West pairs Denver-based counsel with a national trial platform. Free consultation and an educational case-value estimator. (720) 821-3784.",
  alternates: { canonical: "/" },
};

const CASE_TYPES = [
  { href: "/car-accidents", label: "Car accidents", d: "Colorado's most common serious-injury claims" },
  { href: "/truck-accidents", label: "Truck accidents", d: "Commercial carriers, catastrophic outcomes" },
  { href: "/motorcycle-accidents", label: "Motorcycle crashes", d: "Fighting the bias against riders" },
  { href: "/pedestrian-accidents", label: "Pedestrians & cyclists", d: "Struck by drivers who didn't look" },
  { href: "/wrongful-death", label: "Wrongful death", d: "For families facing the unimaginable" },
  { href: "/ski-accidents", label: "Ski & mountain injuries", d: "Collisions, lifts, and resort claims" },
  { href: "/slip-and-fall", label: "Unsafe property", d: "Falls, security failures, winter ice" },
  { href: "/dog-bites", label: "Dog bites", d: "Colorado's strict-liability protections" },
  { href: "/catastrophic-injuries", label: "Catastrophic injury", d: "Brain, spine, burns — lifetime stakes" },
];

export default function HomePage() {
  return (
    <>
      <AnimatedHero
        eyebrow="Denver · Whiteford Mountain West"
        h1="Colorado injury law changed in 2025. Your case may be worth more than an insurer will tell you."
        sub="Whiteford Mountain West pairs Denver-based counsel with the trial depth of a national firm — for people across Colorado facing serious injuries and the insurers who undervalue them."
      />
      <TrustBar />
      <TrialResults />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">How we can help</p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl text-navy md:text-3xl">
            Serious representation for every kind of Colorado injury case
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_TYPES.map((c, i) => (
            <Reveal key={c.href} delay={i % 3}>
              <Link
                href={c.href}
                className="group block h-full rounded-sm border border-navy/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(2,27,44,0.10)]"
              >
                <h3 className="font-display text-lg text-navy group-hover:text-slateblue">{c.label}</h3>
                <p className="mt-1.5 text-sm text-navy-ink/60">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-sm text-navy-ink/60">
            Don&apos;t see your situation? <Link href="/practice-areas" className="font-semibold text-navy underline decoration-gold/60 underline-offset-4">Browse all case types</Link> or call — if we can&apos;t help, we&apos;ll say so.
          </p>
        </Reveal>
      </section>

      <LawContext />
      <ScrollFilm />
      <OfferStack />
      <BeliefFlips />
      <ProcessSteps />
      <AttorneyCards />
      <CtaBand />
    </>
  );
}
