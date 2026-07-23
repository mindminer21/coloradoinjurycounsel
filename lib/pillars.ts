import fs from "fs";
import path from "path";

export type PillarType = "problem" | "audience" | "location";

export type PillarEntry = {
  sourceSlug: string;
  legacyPath: string | null;
  path: string;
  type: PillarType;
  title: string;
  topics: string[];
  city: string | null;
  origin: "existing" | "draft-new";
  reviewStatus: string;
  isHub: boolean;
  parentHubs: string[];
};

export type PillarMap = {
  version: number;
  generatedAt: string;
  site: string;
  reviewStatus: string;
  pillarTypes: Record<PillarType, string>;
  magnets: { path: string; label: string }[];
  topicHubs: Record<string, string>;
  pages: PillarEntry[];
};

let cache: PillarMap | null = null;

export function getPillarMap(): PillarMap {
  if (!cache) {
    const file = path.join(process.cwd(), "content", "pillar-map.json");
    cache = JSON.parse(fs.readFileSync(file, "utf8")) as PillarMap;
  }
  return cache;
}

export function getPillarEntries(type?: PillarType): PillarEntry[] {
  const pages = getPillarMap().pages;
  return type ? pages.filter((entry) => entry.type === type) : pages;
}

export function normalizePillarPath(value: string): string {
  const stripped = value.split("?")[0].replace(/^\/+|\/+$/g, "");
  return `/${stripped}/`;
}

export function getPillarEntryByPath(value: string): PillarEntry | null {
  const target = normalizePillarPath(value);
  return getPillarMap().pages.find((entry) => entry.path === target) || null;
}

export function getPillarEntryBySourceSlug(sourceSlug: string): PillarEntry | null {
  return getPillarMap().pages.find((entry) => entry.sourceSlug === sourceSlug) || null;
}

export function getPillarConnections(entry: PillarEntry) {
  const sharesTopic = (candidate: PillarEntry) =>
    candidate.sourceSlug !== entry.sourceSlug &&
    candidate.topics.some((topic) => entry.topics.includes(topic));

  const related = getPillarMap().pages.filter(sharesTopic);
  return {
    parents: entry.parentHubs
      .map((parentPath) => getPillarEntryByPath(parentPath))
      .filter((candidate): candidate is PillarEntry => Boolean(candidate && candidate.sourceSlug !== entry.sourceSlug)),
    problems: related.filter((candidate) => candidate.type === "problem"),
    audiences: related.filter((candidate) => candidate.type === "audience"),
    locations: related.filter((candidate) => candidate.type === "location"),
  };
}
