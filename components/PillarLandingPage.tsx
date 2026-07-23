import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import {
  getPillarConnections,
  getPillarEntryBySourceSlug,
  getPillarMap,
  type PillarEntry,
} from "@/lib/pillars";
import { SITE } from "@/lib/site";
import AnimatedHero from "@/components/AnimatedHero";
import TrustBar from "@/components/TrustBar";
import ProcessSteps from "@/components/ProcessSteps";
import LawContext from "@/components/LawContext";
import AttorneyCards from "@/components/AttorneyCards";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import OfferStack from "@/components/OfferStack";
import Reveal from "@/components/Reveal";

const isInjurySite = SITE.baseUrl.includes("injury");

export function buildPillarMetadata(entry: PillarEntry): Metadata {
  const page = getPage(entry.sourceSlug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: entry.path },
    openGraph: { title: page.title, description: page.metaDescription, url: entry.path },
  };
}

function PillarLinkGroup({
  title,
  entries,
}: {
  title: string;
  entries: PillarEntry[];
}) {
  if (!entries.length) return null;
  return (
    <div>
      <h3 className="font-display text-lg text-navy">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {entries.map((item) => (
          <Link
            key={item.sourceSlug}
            href={item.path}
            className="rounded-sm border border-navy/10 bg-white px-4 py-3 text-sm font-medium text-navy transition-colors hover:border-gold/60 hover:text-slateblue"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PillarNetwork({ entry }: { entry: PillarEntry }) {
  const connections = getPillarConnections(entry);
  const magnets = getPillarMap().magnets;
  const parentSources = new Set(connections.parents.map((item) => item.sourceSlug));
  const problems = connections.problems.filter((item) => !parentSources.has(item.sourceSlug));

  return (
    <section className="border-y border-navy/10 bg-paper py-14 md:py-16" aria-labelledby="pillar-network-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">
          {entry.origin === "draft-new" ? "DRAFT — attorney review pending" : "Explore this pillar"}
        </p>
        <h2 id="pillar-network-title" className="mt-2 font-display text-2xl text-navy md:text-3xl">
          Related guidance by problem, audience, and location
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-ink/65">
          Move between the main problem guides, guidance written for particular audiences, and local Colorado pages.
          These links are part of the DRAFT architecture pending Jeff&apos;s attorney review.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <PillarLinkGroup title="Parent problem hubs" entries={connections.parents} />
          <PillarLinkGroup title="Sibling problem hubs" entries={problems} />
          <PillarLinkGroup title="Audience guidance" entries={connections.audiences} />
          <PillarLinkGroup title="Colorado locations" entries={connections.locations} />
        </div>
        <div className="mt-10 rounded-sm bg-navy p-6 text-white">
          <h3 className="font-display text-xl text-gold-soft">
            {isInjurySite ? "Free claim-planning tools" : "Free estate-planning tool"}
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {magnets.map((magnet) => (
              <Link key={magnet.path} href={magnet.path} className="rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-navy-ink">
                {magnet.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PillarLandingPage({ entry }: { entry: PillarEntry }) {
  const page = getPage(entry.sourceSlug);
  if (!page) notFound();

  const related = page.related
    .map((sourceSlug) => ({
      entry: getPillarEntryBySourceSlug(sourceSlug),
      page: getPage(sourceSlug),
    }))
    .filter((item) => item.entry && item.page);
  const parent = entry.parentHubs
    .map((parentPath) => getPillarMap().pages.find((candidate) => candidate.path === parentPath))
    .find((candidate) => candidate && candidate.sourceSlug !== entry.sourceSlug);
  const breadcrumbItems = [
    { name: "Home", item: SITE.baseUrl },
    ...(parent ? [{ name: parent.title, item: `${SITE.baseUrl}${parent.path}` }] : []),
    { name: page.h1, item: `${SITE.baseUrl}${entry.path}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        name: SITE.name,
        url: `${SITE.baseUrl}${entry.path}`,
        image: `${SITE.baseUrl}/brand/whiteford_og_logo.jpg`,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.state,
          postalCode: SITE.address.zip,
          addressCountry: "US",
        },
        areaServed: { "@type": "State", name: "Colorado" },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          ...crumb,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {entry.origin === "draft-new" && (
        <div className="bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-navy-ink">
          DRAFT customer-facing copy — pending Jeff&apos;s attorney review
        </div>
      )}
      <AnimatedHero
        eyebrow={page.heroEyebrow || page.geoLabel || (isInjurySite ? "Colorado Personal Injury" : "Colorado Trusts & Estates")}
        h1={page.h1}
        sub={page.heroSub}
        compact
      />
      <TrustBar />

      <article className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="prose-wm py-12 md:py-16">
          {page.intro.map((paragraph, index) => (
            <Reveal key={index} delay={Math.min(index, 2)}>
              <p className={index === 0 ? "!text-[1.2rem] !leading-relaxed !text-navy-ink/90" : undefined}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        {page.localFacts && page.localFacts.length > 0 && (
          <Reveal>
            <aside className="mb-12 rounded-sm border-l-2 border-gold bg-white p-6 md:p-8">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slateblue">
                {page.geoLabel ? `${page.geoLabel} context` : "Colorado context"}
              </p>
              <ul className="mt-4 space-y-2">
                {page.localFacts.map((fact, index) => (
                  <li key={index} className="relative pl-6 text-[0.98rem] leading-relaxed text-navy-ink/80">
                    <span className="absolute left-0 top-[0.55em] h-[6px] w-[6px] rotate-45 bg-gold" aria-hidden />
                    {fact}
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        )}

        <div className="prose-wm pb-4">
          {page.sections.map((section, index) => (
            <Reveal key={index}>
              <section>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
              </section>
            </Reveal>
          ))}
        </div>
      </article>

      <PillarNetwork entry={entry} />
      <LawContext />
      <OfferStack />
      <ProcessSteps />
      <AttorneyCards />
      <Faq items={page.faqs} />
      <CtaBand />

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className="font-display text-xl text-navy">
            {isInjurySite ? "Related Colorado injury resources" : "Related Colorado estate resources"}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {related.map(({ entry: relatedEntry, page: relatedPage }) => (
              <Link
                key={relatedEntry!.sourceSlug}
                href={relatedEntry!.path}
                className="group rounded-sm border border-navy/10 bg-white p-4 text-sm font-medium text-navy transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
              >
                {relatedPage!.h1}
                <span className="mt-1 block text-xs font-normal text-navy-ink/50 group-hover:text-slateblue">
                  {relatedPage!.metaDescription.slice(0, 80)}…
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
