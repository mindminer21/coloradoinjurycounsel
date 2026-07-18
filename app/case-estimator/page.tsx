import type { Metadata } from "next";
import EstimatorWidget from "@/components/EstimatorWidget";
import AttorneyCards from "@/components/AttorneyCards";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Free Colorado Case Value Snapshot | Whiteford Mountain West",
  description:
    "The Colorado Case Value Snapshot: 8 quick questions, an educational value range, and what actually drives it — under the new 2025 damages law. Free and confidential.",
  alternates: { canonical: "/case-estimator" },
};

export default function EstimatorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep pb-16 pt-14 text-white md:pt-20">
        <div className="sky-glow pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_-10%,rgba(143,184,212,0.25),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">Free · Confidential · ~2 minutes</p>
          <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">The Colorado Case Value Snapshot</h1>
          <p className="mx-auto mt-5 max-w-xl text-white/75">
            What could your Colorado injury case be worth? Eight quick questions, an educational range, and an
            honest explanation of what actually drives it — under Colorado&apos;s new 2025 damages law.
          </p>
        </div>
      </section>
      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 pb-16 md:px-6">
        <EstimatorWidget />
        <Reveal>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-navy-ink/50">
            This estimator provides general educational information based on simplified assumptions and Colorado&apos;s
            current damages framework. It is not legal advice, not a valuation of any claim, and not an offer of
            representation. No attorney–client relationship is created. Actual outcomes depend on specific facts,
            available insurance, comparative fault, and filing deadlines.
          </p>
        </Reveal>
      </div>
      <AttorneyCards />
    </>
  );
}
