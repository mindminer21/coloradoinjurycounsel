/**
 * Educational rough-range heuristic. NOT a valuation.
 * Transparent inputs → wide band. Every consumer-facing render carries disclaimers.
 */
export type EstimateInput = {
  incidentType: string;
  location: string;
  severity: "minor" | "moderate" | "serious" | "severe" | "catastrophic";
  treatment: "none" | "er-only" | "ongoing" | "surgery" | "hospitalized";
  timeSince: "under-6mo" | "6-12mo" | "1-2yr" | "2-3yr" | "over-3yr";
  liability: "clear" | "shared" | "disputed" | "unknown";
  medicalCosts: "under-5k" | "5k-25k" | "25k-100k" | "100k-250k" | "over-250k";
  lostWages: "none" | "under-5k" | "5k-25k" | "25k-100k" | "over-100k";
};

export type EstimateBand = {
  low: number;
  high: number;
  qualifier: "limited" | "typical" | "elevated" | "significant" | "catastrophic";
  drivers: string[];
  cautions: string[];
};

const MED_MID: Record<EstimateInput["medicalCosts"], number> = {
  "under-5k": 2500, "5k-25k": 15000, "25k-100k": 60000, "100k-250k": 175000, "over-250k": 350000,
};
const WAGE_MID: Record<EstimateInput["lostWages"], number> = {
  none: 0, "under-5k": 2500, "5k-25k": 15000, "25k-100k": 60000, "over-100k": 150000,
};
const SEV_MULT: Record<EstimateInput["severity"], number> = {
  minor: 1.5, moderate: 2.25, serious: 3, severe: 4, catastrophic: 5,
};
const TREAT_ADJ: Record<EstimateInput["treatment"], number> = {
  none: 0.7, "er-only": 0.9, ongoing: 1.0, surgery: 1.2, hospitalized: 1.25,
};
const LIAB_ADJ: Record<EstimateInput["liability"], number> = {
  clear: 1.0, shared: 0.75, disputed: 0.55, unknown: 0.45,
};

function roundBand(n: number): number {
  if (n < 10000) return Math.round(n / 500) * 500;
  if (n < 100000) return Math.round(n / 2500) * 2500;
  if (n < 1000000) return Math.round(n / 25000) * 25000;
  return Math.round(n / 100000) * 100000;
}

export function estimate(i: EstimateInput): EstimateBand {
  const economic = MED_MID[i.medicalCosts] + WAGE_MID[i.lostWages];
  const multiplier = SEV_MULT[i.severity] * TREAT_ADJ[i.treatment];
  const raw = Math.max(economic * multiplier, economic + 2000) * LIAB_ADJ[i.liability];

  let low = roundBand(Math.max(raw * 0.5, 2500));
  let high = roundBand(Math.max(raw * 1.6, low * 2));
  if (high <= low) high = low * 2;

  const qualifier: EstimateBand["qualifier"] =
    high < 25000 ? "limited" : high < 100000 ? "typical" : high < 400000 ? "elevated" : high < 1000000 ? "significant" : "catastrophic";

  const drivers: string[] = [];
  if (MED_MID[i.medicalCosts] >= 60000) drivers.push("Documented medical costs are a primary driver of overall claim value.");
  if (WAGE_MID[i.lostWages] >= 15000) drivers.push("Lost income adds a distinct economic-damages component.");
  if (SEV_MULT[i.severity] >= 3) drivers.push("Higher injury severity typically increases the non-economic component (pain, suffering, life impact).");
  if (TREAT_ADJ[i.treatment] >= 1.2) drivers.push("Surgery or hospitalization tends to substantiate the seriousness of an injury.");
  if (drivers.length === 0) drivers.push("At this severity and cost level, ranges are driven mostly by documented economic losses.");

  const cautions: string[] = [];
  if (LIAB_ADJ[i.liability] < 1) cautions.push("Disputed or shared fault can reduce recovery under Colorado's modified comparative negligence rule — and can bar recovery entirely if a claimant is 50% or more at fault.");
  if (i.timeSince === "2-3yr" || i.timeSince === "over-3yr") cautions.push("Colorado filing deadlines may already be close or passed for older incidents — deadlines vary by claim type. Speak with an attorney promptly.");
  cautions.push("Insurance policy limits often cap what is practically recoverable regardless of case value.");
  cautions.push("Colorado caps non-economic damages in most tort cases filed on or after Jan 1, 2025 at $1.5M (subject to adjustment); economic damages (bills, lost income) are generally not capped.");

  return { low, high, qualifier, drivers, cautions };
}
