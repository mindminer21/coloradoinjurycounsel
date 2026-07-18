import type { Metadata } from "next";
import Link from "next/link";
import { getAllPages } from "@/lib/content";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Colorado Personal Injury Practice Areas | Whiteford Mountain West",
  description:
    "Every Colorado injury case type we handle — from car and truck accidents to ski injuries, wrongful death, and catastrophic harm. Find your situation.",
  alternates: { canonical: "/practice-areas" },
};

const CLUSTER_LABELS: Record<string, string> = {
  "geo-casetype": "Denver metro",
  "state-casetype": "Statewide Colorado",
  metro: "Cities across Colorado",
  mountain: "Mountain & ski communities",
  value: "Case value resources",
  law: "Colorado law guides",
};

export default function PracticeAreasPage() {
  const pages = getAllPages();
  const clusters = ["geo-casetype", "state-casetype", "metro", "mountain", "value", "law"] as const;
  return (
    <>
      <section className="bg-navy-deep py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-3xl md:text-5xl">Every case type. Every corner of Colorado.</h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Find the guide that matches your situation — each covers how these cases work in Colorado, what
            drives their value, and the questions worth asking before you talk to any insurer.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        {clusters.map((c) => {
          const items = pages.filter((p) => p.cluster === c);
          if (!items.length) return null;
          return (
            <Reveal key={c}>
              <section className="mb-12">
                <h2 className="border-b border-navy/10 pb-3 font-display text-xl text-navy">{CLUSTER_LABELS[c]}</h2>
                <div className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <Link key={p.slug} href={`/${p.slug}`} className="rounded-sm py-1.5 text-[0.95rem] text-navy-ink/75 transition-colors hover:text-navy hover:underline hover:decoration-gold/60 hover:underline-offset-4">
                      {p.h1}
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
