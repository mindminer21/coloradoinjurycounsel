import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import ts from "typescript";

const src = fs.readFileSync(new URL("../lib/estimate.ts", import.meta.url), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
fs.writeFileSync("/tmp/estimate.compiled.mjs", js);
const { estimate } = await import("/tmp/estimate.compiled.mjs");

const base = {
  incidentType: "car", location: "denver-metro", severity: "moderate", treatment: "ongoing",
  timeSince: "under-6mo", liability: "clear", medicalCosts: "5k-25k", lostWages: "under-5k",
};

test("returns a coherent band", () => {
  const b = estimate(base);
  assert.ok(b.low >= 2500, "floor respected");
  assert.ok(b.high > b.low, "high > low");
  assert.ok(Array.isArray(b.drivers) && b.drivers.length > 0);
  assert.ok(b.cautions.some((c) => c.includes("policy limits")), "always cautions on policy limits");
});

test("severity monotonicity", () => {
  const minor = estimate({ ...base, severity: "minor" });
  const cat = estimate({ ...base, severity: "catastrophic", treatment: "hospitalized", medicalCosts: "over-250k" });
  assert.ok(cat.high > minor.high, "catastrophic > minor");
});

test("disputed liability reduces band", () => {
  const clear = estimate(base);
  const disputed = estimate({ ...base, liability: "disputed" });
  assert.ok(disputed.high <= clear.high, "disputed <= clear");
  assert.ok(disputed.cautions.some((c) => c.toLowerCase().includes("comparative")), "comparative negligence caution present");
});

test("old incidents warn about deadlines", () => {
  const old = estimate({ ...base, timeSince: "over-3yr" });
  assert.ok(old.cautions.some((c) => c.toLowerCase().includes("deadline")), "deadline caution");
});

test("cap context always present", () => {
  const b = estimate(base);
  assert.ok(b.cautions.some((c) => c.includes("$1.5M")), "cap context present");
});

test("band rounding is clean", () => {
  const b = estimate(base);
  assert.strictEqual(b.low % 500, 0, "low rounded");
  assert.strictEqual(b.high % 500, 0, "high rounded");
});
