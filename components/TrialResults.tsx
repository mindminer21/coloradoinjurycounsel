/**
 * TrialResults — national trial credibility band.
 * COMPLIANCE: every item below is a real, publicly reported Whiteford result
 * (sources: whitefordlaw.com news/practice pages, co-counsel press releases).
 * Amounts and descriptions must not be edited without re-verification.
 * Colorado RPC 7.1: adjacent disclaimer required — do not remove.
 * Each card links to the corresponding whitefordlaw.com press release (verified 2026-07).
 */
const RESULTS = [
  {
    stat: "$8.4M",
    label: "Medical malpractice verdict",
    detail:
      "Secured at trial in Marion County, Kentucky (2025) by a team led by Masten Childers III — our lead trial counsel — reported as one of the largest medical-malpractice recoveries in Central Kentucky history.",
    href: "https://www.whitefordlaw.com/news-events/record-verdict-in-kentucky",
  },
  {
    stat: "$140M",
    label: "Federal court judgment",
    detail:
      "Won by Whiteford trial lawyers in the U.S. District Court for the District of Columbia after a decade-long international litigation — the kind of long-haul firepower most injury firms cannot match.",
    href: "https://www.whitefordlaw.com/news-events/whiteford-team-achieves-significant-verdict-as-judge-orders-iraq-to-pay-140m",
  },
  {
    stat: "100+",
    label: "Families represented after a mass disaster",
    detail:
      "When UPS Flight 2976 crashed into a Louisville neighborhood, more than one hundred affected community members turned to Whiteford's trial team to pursue their recoveries.",
    href: "https://www.whitefordlaw.com/news-events/following-emotional-good-morning-america-interviews-kentucky-attorneys-comment-on-the-15-lawsuits-filed-to-help-ups-plane-crash-victims-recover",
  },
  {
    stat: "Month-long trial",
    label: "Landmark class-action victory",
    detail:
      "A complete defense victory for the City of Baltimore in a nationally significant, decade-long federal class action — proof this bench tries the hard cases all the way through verdict.",
    href: "https://www.whitefordlaw.com/news-events/whiteford-wins-nationally-significant-housing-case-for-the-city-of-baltimore-and",
  },
] as const;

export default function TrialResults() {
  return (
    <section aria-labelledby="results-heading" className="bg-navy-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
          The record behind your case
        </p>
        <h2 id="results-heading" className="mt-3 font-display text-3xl font-medium md:text-4xl">
          A national trial firm shows up differently.
        </h2>
        <p className="mt-4 max-w-2xl text-paper/75">
          Insurance companies know which firms settle cheap and which firms try cases. Whiteford&rsquo;s
          trial lawyers have taken on hospitals, governments, and global defendants — and won.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-sm border border-paper/15 bg-paper/[0.04] p-6 transition-colors hover:border-gold-soft/50 hover:bg-paper/[0.07] focus-visible:border-gold-soft"
            >
              <div className="font-display text-3xl text-gold-soft md:text-[2.1rem]">{r.stat}</div>
              <div className="mt-2 text-sm font-semibold">{r.label}</div>
              <p className="mt-3 text-[0.83rem] leading-relaxed text-paper/65">{r.detail}</p>
              <span className="mt-4 inline-block text-[0.72rem] font-semibold text-gold-soft/80 transition-colors group-hover:text-gold-soft">
                Read the announcement →
              </span>
            </a>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-[0.72rem] leading-relaxed text-paper/45">
          Results obtained by Whiteford attorneys in various matters and jurisdictions, including
          matters outside Colorado and outside personal injury. Prior results do not guarantee a
          similar outcome. Every case is different and depends on its own facts and applicable law.
        </p>
      </div>
    </section>
  );
}
