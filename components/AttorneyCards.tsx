import Image from "next/image";
import { getAttorneys, JURISDICTION_NOTE } from "@/lib/attorneys";
import Reveal from "./Reveal";

export default function AttorneyCards({ full = false }: { full?: boolean }) {
  const attorneys = getAttorneys();
  return (
    <section className="grain relative bg-navy-deep py-16 text-white md:py-20" id="attorneys">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">Your legal team</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
            A Denver front door. A national trial platform.
          </h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Whiteford Mountain West pairs Colorado-based leadership with the trial depth of Whiteford&apos;s
            full national litigation platform — so serious cases get serious resources.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {attorneys.map((a, i) => (
            <Reveal key={a.slug} delay={i}>
              <article className="lift-card glass-dark group h-full rounded-sm p-6 hover:border-gold/40">
                {a.photo ? (
                  <Image src={a.photo} alt={`${a.name}, ${a.title}`} width={112} height={112} className="h-28 w-28 rounded-sm object-cover object-top ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-sm bg-[linear-gradient(135deg,#0b3c5c,#02243a)] font-display text-3xl text-gold-soft ring-1 ring-white/10">
                    {a.initials}
                  </div>
                )}
                <h3 className="mt-5 font-display text-xl">
                  <a href={a.profileUrl} target="_blank" rel="noopener" className="transition-colors hover:text-gold-soft">
                    {a.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm font-medium text-gold-soft">{a.title}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-white/50">{a.location}</p>
                {full ? (
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
                    {a.bio.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                    <p className="text-xs text-white/50">Admitted: {a.admissions.join(" · ")}</p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-white/70">{a.bio[0]}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-white/45">{JURISDICTION_NOTE}</p>
      </div>
    </section>
  );
}
