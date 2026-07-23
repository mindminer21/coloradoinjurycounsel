import PillarLandingPage, { buildPillarMetadata } from "@/components/PillarLandingPage";
import { getPillarEntryByPath } from "@/lib/pillars";

const entry = getPillarEntryByPath("/car-accidents/");

export const metadata = entry ? buildPillarMetadata(entry) : {};

export default function CarAccidentPillarPage() {
  if (!entry) return null;
  return <PillarLandingPage entry={entry} />;
}
