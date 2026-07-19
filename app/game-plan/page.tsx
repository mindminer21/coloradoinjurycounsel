import type { Metadata } from "next";
import GamePlanWizard from "@/components/GamePlanWizard";
import LawContext from "@/components/LawContext";
import CtaBand from "@/components/CtaBand";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Claim Game Plan — AI-Guided Injury Claim Review | Whiteford",
  description:
    "Answer a few questions and get a personalized Colorado injury Claim Game Plan: the issues in your claim, the evidence to preserve now, and a hypothetical strategy — free, in minutes. Call (720) 821-3784.",
  alternates: { canonical: `${SITE.baseUrl}/game-plan` },
};

export default function GamePlanPage() {
  return (
    <>
      <section className="bg-navy-ink pb-16 pt-14 text-paper md:pb-24 md:pt-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Not another &quot;free consultation&quot;
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium md:text-5xl">
              Build your free Claim Game Plan — in about 3 minutes.
            </h1>
            <p className="mt-5 text-paper/75 md:text-lg">
              Our intake intelligence narrows down the issues in your claim, shows you the evidence to
              preserve before it disappears, and lays out how cases like yours typically unfold — then a
              Whiteford attorney reviews your answers and follows up personally.
            </p>
            <p className="mt-3 text-sm text-paper/50">
              Educational, not legal advice · Your answers go straight to the attorney team · Free, no obligation
            </p>
          </div>
          <div className="mt-10">
            <GamePlanWizard />
          </div>
        </div>
      </section>
      <LawContext />
      <CtaBand />
    </>
  );
}
