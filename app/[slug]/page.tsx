import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPage } from "@/lib/content";
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

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.metaDescription, url: `/${page.slug}` },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const related = page.related.map((s) => ({ slug: s, page: getPage(s) })).filter((r) => r.page);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        name: SITE.name,
        url: `${SITE.baseUrl}/${page.slug}`,
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
        priceRange: "Free consultation",
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.baseUrl },
          { "@type": "ListItem", position: 2, name: page.h1, item: `${SITE.baseUrl}/${page.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnimatedHero eyebrow={page.heroEyebrow || page.geoLabel || "Colorado Personal Injury"} h1={page.h1} sub={page.heroSub} compact />
      <TrustBar />

      <article className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="prose-wm py-12 md:py-16">
          {page.intro.map((p, i) => (
            <Reveal key={i} delay={Math.min(i, 2)}>
              <p className={i === 0 ? "!text-[1.2rem] !leading-relaxed !text-navy-ink/90" : undefined}>{p}</p>
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
                {page.localFacts.map((f, i) => (
                  <li key={i} className="relative pl-6 text-[0.98rem] leading-relaxed text-navy-ink/80">
                    <span className="absolute left-0 top-[0.55em] h-[6px] w-[6px] rotate-45 bg-gold" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        )}

        <div className="prose-wm pb-4">
          {page.sections.map((s, i) => (
            <Reveal key={i}>
              <section>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>
      </article>

      <LawContext />
      <OfferStack />
      <ProcessSteps />
      <AttorneyCards />
      <Faq items={page.faqs} />
      <CtaBand context={page.geoLabel ? `a ${page.geoLabel} case like yours` : "your case"} />

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className="font-display text-xl text-navy">Related Colorado injury resources</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {related.map(({ slug: s, page: rp }) => (
              <Link
                key={s}
                href={`/${s}`}
                className="group rounded-sm border border-navy/10 bg-white p-4 text-sm font-medium text-navy transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
              >
                {rp!.h1}
                <span className="mt-1 block text-xs font-normal text-navy-ink/50 group-hover:text-slateblue">
                  {rp!.metaDescription.slice(0, 80)}…
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
