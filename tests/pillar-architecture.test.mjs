import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentDir = path.join(root, "content", "pages");
const map = JSON.parse(fs.readFileSync(path.join(root, "content", "pillar-map.json"), "utf8"));
const redirects = JSON.parse(fs.readFileSync(path.join(root, "docs", "redirect-map.json"), "utf8"));
const pageFiles = fs.readdirSync(contentDir).filter((file) => file.endsWith(".json"));
const entriesBySource = new Map(map.pages.map((entry) => [entry.sourceSlug, entry]));
const entriesByPath = new Map(map.pages.map((entry) => [entry.path, entry]));

test("every content page has exactly one valid pillar classification", () => {
  assert.equal(map.pages.length, pageFiles.length);
  assert.equal(entriesBySource.size, pageFiles.length);
  for (const file of pageFiles) {
    const sourceSlug = file.replace(/\.json$/, "");
    const entry = entriesBySource.get(sourceSlug);
    assert.ok(entry, `missing map entry for ${sourceSlug}`);
    assert.ok(["problem", "audience", "location"].includes(entry.type));
  }
});

test("pillar paths are unique and follow the type contract", () => {
  assert.equal(entriesByPath.size, map.pages.length);
  for (const entry of map.pages) {
    assert.match(entry.path, /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)?\/$/);
    if (entry.type === "problem") assert.equal(entry.path.split("/").filter(Boolean).length, 1);
    if (entry.type === "audience") assert.match(entry.path, /^\/for\/[a-z0-9-]+\/$/);
    if (entry.type === "location") {
      assert.match(entry.path, /^\/[a-z0-9-]+\/[a-z0-9-]+-lawyer\/$/);
      assert.ok(entry.city);
    }
  }
});

test("all legacy pages have one permanent redirect and no legacy URL is reused", () => {
  const legacyEntries = map.pages.filter((entry) => entry.legacyPath);
  assert.equal(legacyEntries.length, 100);
  assert.equal(redirects.length, 100);
  const redirectBySource = new Map(redirects.map((redirect) => [redirect.source, redirect]));
  assert.equal(redirectBySource.size, 100);
  for (const entry of legacyEntries) {
    const redirect = redirectBySource.get(entry.legacyPath);
    assert.ok(redirect, `missing redirect for ${entry.legacyPath}`);
    assert.equal(redirect.destination, entry.path);
    assert.equal(redirect.statusCode, 301);
    assert.notEqual(`${redirect.source}/`, redirect.destination);
  }
});

test("every spoke is reachable from at least one problem hub", () => {
  const problems = map.pages.filter((entry) => entry.type === "problem" && entry.isHub);
  assert.ok(problems.length > 0);
  for (const entry of map.pages) {
    if (entry.type === "problem") continue;
    const parents = entry.parentHubs.map((parentPath) => entriesByPath.get(parentPath)).filter(Boolean);
    assert.ok(parents.length > 0, `orphan pillar ${entry.path}`);
    assert.ok(parents.some((parent) => parent.type === "problem" && parent.isHub));
    assert.ok(parents.some((parent) => parent.topics.some((topic) => entry.topics.includes(topic))));
  }
});

test("llms.txt lists every pillar URL", () => {
  const llms = fs.readFileSync(path.join(root, "public", "llms.txt"), "utf8");
  for (const entry of map.pages) assert.ok(llms.includes(entry.path), `llms.txt missing ${entry.path}`);
});

test("new audience drafts follow compliance and length rules", () => {
  const prohibited = /\b(maximum compensation|best|top|guaranteed|specialists?|experts?)\b/i;
  const legalFigure = /\$|%|§|C\.R\.S\.|\b\d+\s*(?:days?|months?|years?)\b/i;
  for (const entry of map.pages.filter((candidate) => candidate.origin === "draft-new")) {
    const page = JSON.parse(fs.readFileSync(path.join(contentDir, `${entry.sourceSlug}.json`), "utf8"));
    const customerCopy = JSON.stringify({
      heroSub: page.heroSub,
      intro: page.intro,
      sections: page.sections,
      localFacts: page.localFacts,
      faqs: page.faqs,
    });
    const words = JSON.stringify(page).match(/[A-Za-z0-9'-]+/g)?.length || 0;
    assert.ok(words >= 600 && words <= 1000, `${entry.sourceSlug} word count ${words}`);
    assert.ok(page.title.length <= 60);
    assert.match(page.title, /\| Whiteford(?: Mountain West)?$/);
    assert.ok(page.metaDescription.length >= 150 && page.metaDescription.length <= 160);
    assert.doesNotMatch(customerCopy, prohibited);
    assert.doesNotMatch(customerCopy, legalFigure);
  }
});

test("noindex layers and password gate remain present", () => {
  const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const config = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");
  const robots = fs.readFileSync(path.join(root, "app", "robots.ts"), "utf8");
  const middleware = fs.readFileSync(path.join(root, "middleware.ts"), "utf8");
  assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(config, /X-Robots-Tag/);
  assert.match(config, /noindex, nofollow/);
  assert.ok(robots.includes('allow: "/"'));
  assert.ok(robots.includes('disallow: ["/api/"]'));
  assert.match(middleware, /REVIEW_PASSWORD/);
  assert.match(middleware, /REVIEW_AUTH_TOKEN/);
});

test("one authoritative pillar plan exists", () => {
  const plans = fs.readdirSync(path.join(root, "docs")).filter((file) => /pillar.*(?:plan|architecture)|(?:plan|architecture).*pillar/i.test(file));
  assert.deepEqual(plans, ["11-pillar-architecture-plan.md"]);
});
