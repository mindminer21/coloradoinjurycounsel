import type { Faq as FaqT } from "@/lib/content";
import Reveal from "./Reveal";

export default function Faq({ items, title = "Frequently asked questions" }: { items: FaqT[]; title?: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-16">
      <Reveal>
        <h2 className="font-display text-2xl text-navy md:text-3xl">{title}</h2>
      </Reveal>
      <div className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
        {items.map((f, i) => (
          <details key={i} className="faq group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-semibold text-navy transition-colors hover:text-slateblue">
              {f.q}
            </summary>
            <div>
              <p className="pb-5 pr-8 text-[0.98rem] leading-relaxed text-navy-ink/75">{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
