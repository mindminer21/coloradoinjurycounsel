import Link from "next/link";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-6xl text-navy">404</p>
      <h1 className="mt-4 font-display text-2xl text-navy">That page has moved or never existed.</h1>
      <p className="mt-3 text-navy-ink/70">Try our practice areas, or get an estimated value for your case.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/practice-areas" className="rounded-sm border border-navy/20 px-5 py-3 font-semibold text-navy">Practice areas</Link>
        <Link href="/case-estimator" className="cta-gold rounded-sm bg-gold px-5 py-3 font-semibold text-navy-ink">Case estimator</Link>
      </div>
    </section>
  );
}
