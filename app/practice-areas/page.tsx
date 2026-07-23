import type { Metadata } from "next";
import Link from "next/link";
import { getPillarEntries, type PillarType } from "@/lib/pillars";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Colorado Personal Injury Pillars | Whiteford Mountain West",
  description: "Browse Colorado injury guidance by legal problem, audience, and location. All pillar copy remains in attorney review.",
  alternates: { canonical: "/practice-areas" },
};

const SECTIONS: { type: PillarType; title: string; description: string }[] = [
  { type: "problem", title: "Problems", description: "Overview hubs for the claim and injury questions people bring to Whiteford." },
  { type: "audience", title: "Audiences", description: "DRAFT guidance written around the role or situation of the person making decisions." },
  { type: "location", title: "Locations", description: "Local Colorado context connected back to the relevant problem hub." },
];

export default function PracticeAreasPage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">DRAFT — attorney review pending</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">Colorado injury guidance, organized around your situation.</h1>
          <p className="mt-4 max-w-2xl text-white/75">Start with the legal problem, the audience guide closest to your circumstances, or a Colorado location. Every page links back into the same reviewed pillar network.</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        {SECTIONS.map((section) => {
          const entries = getPillarEntries(section.type);
          return (
            <Reveal key={section.type}>
              <section className="mb-12">
                <h2 className="border-b border-navy/10 pb-3 font-display text-2xl text-navy">{section.title}</h2>
                <p className="mt-3 max-w-3xl text-sm text-navy-ink/65">{section.description}</p>
                <div className="mt-5 grid gap-x-8 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => (
                    <Link
                      key={entry.sourceSlug}
                      href={entry.path}
                      className="rounded-sm py-1.5 text-[0.95rem] text-navy-ink/75 transition-colors hover:text-navy hover:underline hover:decoration-gold/60 hover:underline-offset-4"
                    >
                      {entry.title}
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>
      <CtaBand />
    </>
  );
}
