import Reveal from "./Reveal";

const ITEMS = [
  { k: "Free", v: "consultations — talk to us before you talk to an insurer" },
  { k: "No fee", v: "unless we recover for you — contingency representation for injury cases" },
  { k: "Denver", v: "based, with Whiteford's national trial platform behind every case" },
  { k: "24/7", v: "intake — a real conversation and a booked consultation, any hour" },
];

export default function TrustBar() {
  return (
    <section className="relative z-[3] border-b border-navy/10 bg-white">
      <div className="mx-auto -mt-10 max-w-6xl px-4 md:px-6">
        <div className="glass-gold-edge grid gap-x-8 gap-y-4 rounded-sm bg-[linear-gradient(135deg,#0b3c5c,#02243a)] px-6 py-6 text-white shadow-[0_24px_60px_rgba(2,27,44,0.35)] ring-1 ring-white/10 sm:grid-cols-2 md:grid-cols-4">
          {ITEMS.map((it, i) => (
            <Reveal key={it.k} delay={i}>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rotate-45 bg-gold" aria-hidden />
                <p className="text-sm leading-snug text-white/75">
                  <strong className="text-gold-soft">{it.k}</strong> {it.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="h-8" aria-hidden />
    </section>
  );
}
