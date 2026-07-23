import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillarLandingPage, { buildPillarMetadata } from "@/components/PillarLandingPage";
import { getPillarEntries, getPillarEntryByPath } from "@/lib/pillars";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPillarEntries()
    .filter((entry) => entry.path !== "/car-accidents/")
    .map((entry) => ({ pillar: entry.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<{ pillar: string[] }> }): Promise<Metadata> {
  const { pillar } = await params;
  const entry = getPillarEntryByPath(`/${pillar.join("/")}/`);
  return entry ? buildPillarMetadata(entry) : {};
}

export default async function RegisteredPillarPage({ params }: { params: Promise<{ pillar: string[] }> }) {
  const { pillar } = await params;
  const entry = getPillarEntryByPath(`/${pillar.join("/")}/`);
  if (!entry) notFound();
  return <PillarLandingPage entry={entry} />;
}
