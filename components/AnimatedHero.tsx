import Link from "next/link";
import { SITE } from "@/lib/site";

function WordRise({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="word-rise" aria-label={text} role="text">
      {words.map((w, i) => (
        <span key={i} className="w" aria-hidden="true">
          <span style={{ ["--i" as never]: i }}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

const PARTICLES = [
  { l: "8%", s: 5, d: 0, dur: 18, op: 0.4, drift: 30 },
  { l: "22%", s: 3, d: 4, dur: 15, op: 0.5, drift: -24 },
  { l: "38%", s: 6, d: 8, dur: 21, op: 0.35, drift: 18 },
  { l: "55%", s: 4, d: 2, dur: 17, op: 0.45, drift: -30 },
  { l: "68%", s: 3, d: 10, dur: 14, op: 0.5, drift: 22 },
  { l: "81%", s: 5, d: 6, dur: 19, op: 0.4, drift: -16 },
  { l: "92%", s: 4, d: 12, dur: 16, op: 0.45, drift: 26 },
];

export default function AnimatedHero({
  eyebrow,
  h1,
  sub,
  compact = false,
}: {
  eyebrow?: string;
  h1: string;
  sub: string;
  compact?: boolean;
}) {
  return (
    <section className="grain relative overflow-hidden bg-navy-deep text-white">
      {/* atmosphere */}
      <div className="sky-glow pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_-10%,rgba(143,184,212,0.30),transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_12%_8%,rgba(198,161,91,0.14),transparent_55%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,27,44,0.35),transparent_35%)]" aria-hidden />
      {/* gold dust */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle bottom-[12%]"
            style={{
              left: p.l, width: p.s, height: p.s,
              ["--dur" as never]: `${p.dur}s`, ["--delay" as never]: `${p.d}s`,
              ["--op" as never]: p.op, ["--drift" as never]: `${p.drift}px`,
            }}
          />
        ))}
      </div>
      <Ridges />
      <div className={`relative z-[2] mx-auto max-w-6xl px-4 md:px-6 ${compact ? "pb-28 pt-14 md:pb-32 md:pt-20" : "pb-36 pt-16 md:pb-44 md:pt-24"}`}>
        {eyebrow && (
          <p className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">
            <span className="mr-3 inline-block h-[1px] w-8 translate-y-[-3px] bg-gold/60" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl font-display text-4xl leading-[1.12] md:text-[3.4rem]">
          <WordRise text={h1} />
        </h1>
        <div className="hairline mt-6 h-[3px] w-24 bg-gradient-to-r from-gold to-gold/30" aria-hidden />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{sub}</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/case-estimator"
            className="cta-gold inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-[0.95rem] font-semibold text-navy-ink shadow-[0_10px_35px_rgba(198,161,91,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(198,161,91,0.5)]"
          >
            {SITE.offers.snapshot.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a href={SITE.phoneHref} className="glass-dark inline-flex items-center gap-2 rounded-sm px-6 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-soft/60 hover:text-gold-soft">
            Call {SITE.phone} — answered 24/7
          </a>
        </div>
        <p className="mt-5 text-sm font-medium text-gold-soft/90">{SITE.offers.guarantee}<span className="ml-2 text-xs font-normal text-white/45">Contingency representation for injury cases.</span></p>
      </div>
    </section>
  );
}

function Ridges() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden>
      {/* atmospheric haze band above ridges */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,rgba(2,36,58,0.9),transparent)]" />
      <svg className="ridge-far relative block w-[112%]" viewBox="0 0 1440 190" preserveAspectRatio="none" style={{ height: "160px" }}>
        <defs>
          <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#155178" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0b3c5c" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M0,190 L0,120 L90,88 L170,118 L260,62 L350,108 L470,40 L560,96 L680,58 L800,110 L900,52 L1020,102 L1140,66 L1250,112 L1340,84 L1440,116 L1440,190 Z" fill="url(#rf)" />
        {/* snow caps */}
        <path d="M455,48 L470,40 L485,48 L478,52 L462,52 Z M885,60 L900,52 L915,60 L907,64 L893,64 Z" fill="#8FB8D4" opacity="0.5" />
      </svg>
      <svg className="ridge-near absolute bottom-0 block w-[112%]" viewBox="0 0 1440 150" preserveAspectRatio="none" style={{ height: "115px" }}>
        <defs>
          <linearGradient id="rn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#03304d" />
            <stop offset="1" stopColor="#02243a" />
          </linearGradient>
        </defs>
        <path d="M0,150 L0,96 L110,60 L210,98 L330,34 L440,88 L560,48 L700,100 L820,42 L950,92 L1080,50 L1200,96 L1320,64 L1440,92 L1440,150 Z" fill="url(#rn)" />
      </svg>
    </div>
  );
}
