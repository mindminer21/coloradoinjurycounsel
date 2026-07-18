import fs from "fs";
import path from "path";

export type Faq = { q: string; a: string };
export type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
export type PageContent = {
  slug: string;
  keyword: string;
  cluster: "geo-casetype" | "state-casetype" | "metro" | "mountain" | "value" | "law";
  title: string;
  metaDescription: string;
  h1: string;
  heroSub: string;
  heroEyebrow?: string;
  intro: string[];
  sections: Section[];
  localFacts?: string[];
  faqs: Faq[];
  related: string[];
  geoLabel?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "pages");

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function getPage(slug: string): PageContent | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PageContent;
}

export function getAllPages(): PageContent[] {
  return getAllSlugs()
    .map((s) => getPage(s))
    .filter(Boolean) as PageContent[];
}
