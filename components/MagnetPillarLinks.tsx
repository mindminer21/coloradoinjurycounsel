import Link from "next/link";
import { getPillarEntryByPath } from "@/lib/pillars";

export default function MagnetPillarLinks({ paths }: { paths: string[] }) {
  const entries = paths
    .map((pillarPath) => getPillarEntryByPath(pillarPath))
    .filter((entry) => entry !== null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6" aria-labelledby="magnet-pillar-links">
      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">
        DRAFT — attorney review pending
      </p>
      <h2 id="magnet-pillar-links" className="mt-2 font-display text-2xl text-navy md:text-3xl">
        Continue with guidance for your problem, audience, and location
      </h2>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.sourceSlug}
            href={entry.path}
            className="rounded-sm border border-navy/10 bg-white p-5 font-medium text-navy transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slateblue">{entry.type}</span>
            <span className="mt-2 block">{entry.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
