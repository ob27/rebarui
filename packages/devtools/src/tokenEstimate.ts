import type { ComponentCounts } from "./useComponentCounts";
import { COMPLEXITY, type Complexity } from "./migrationEffort";

/**
 * A documented estimation MODEL, not a measured cost — every constant here is a stated,
 * editable assumption. The methodology and reasoning behind each number is written out in full
 * on the docs site (see MODEL_DOCS_PATH below) rather than left implicit in code, specifically
 * so this doesn't repeat the mistake ref/ASSESSMENT.md flagged in the original brainstorm
 * (fabricated token/dollar precision presented as fact). This estimate is presented as a model
 * with visible assumptions instead.
 */
export const MODEL_DOCS_PATH = "/docs/token-estimate";

// Tokens to author ONE instance of a component the first time, in a headless/no-styling
// context — just wiring logic and props, no visual decisions. Same tiers as migrationEffort.ts.
const BASE_AUTHORING_COST: Record<Complexity, number> = {
  simple: 30,
  medium: 80,
  complex: 150,
};

// Extra tokens paid on EACH iteration when building directly against AntD instead of headless
// — reconciling a logic change with AntD's specific prop names, component shape, and visual
// rules.
const ANTD_ITERATION_TAX: Record<Complexity, number> = {
  simple: 10,
  medium: 25,
  complex: 50,
};

// rebar-ui's own per-iteration cost — NOT zero. Previously this model assumed the headless path
// had no iteration tax at all, which the real iteration experiment on /benchmarks (three tiers,
// iterated round-by-round to an actual measured crossover, not an extrapolation) contradicts:
// rebar-ui's average per-round cost across that experiment was ~92.5% of antd's own — a real,
// modest ~7.5% saving per round, not the ~0% this model previously implied. Grounded here at a
// slightly more conservative 93% of ANTD_ITERATION_TAX (rounded up, so this model doesn't overstate
// rebar's per-round advantage beyond what was actually measured), same rounding discipline as
// REBAR_FIRST_BUILD_DISCOUNT below.
const REBAR_ITERATION_TAX: Record<Complexity, number> = {
  simple: 9,
  medium: 23,
  complex: 47,
};

// One-time cost to migrate a single already-built Rebar component to AntD. Codemod-covered
// components (@rebar-ui/migrate-antd actually handles the rename) cost a small flat review
// pass; everything else falls to the manual/LLM-assisted path (MIGRATION_PROMPT.md) and is
// modeled as a multiple of that component's own base authoring cost, since restructuring
// already-correct code with semantic judgment is cheaper than a from-scratch build but not
// free.
const CODEMOD_REVIEW_COST = 5;
const MANUAL_MIGRATION_MULTIPLIER = 1.5;

// The one constant below actually grounded in a real measurement, not an assumption: the real
// n=15 /benchmarks runs (PreviewPanel, both text- and image-driven) found rebar-ui's own
// placement-layer build costs ~3% LESS than antd's direct build on the very first build alone —
// 30,211 vs 31,231 tokens (text), 30,787 vs 31,765 (image, refined prompt) — averaging ~3.2%.
// Previously this model assumed antdDirect and rebarOnly had an IDENTICAL first-build cost (same
// `base`), with rebar's whole advantage coming from the (still unmeasured — see ANTD_ITERATION_TAX
// above) per-iteration tax. That assumption undersold Rebar: this discount corrects it using real,
// whole-component data, rounded down from the measured ~3.2% to stay conservative. Real, but at a
// coarser granularity than this per-component-type model: whole-panel builds, not isolated
// per-type costs (we haven't measured what one Button vs one Card costs in isolation) — see
// /benchmarks for the source numbers.
const REBAR_FIRST_BUILD_DISCOUNT = 0.03;

// Mirrors @rebar-ui/migrate-antd's actual coverage (packages/adapters/antd/src/transform.ts) —
// update this list if that adapter's coverage changes, so the estimate doesn't silently drift
// from what the codemod actually does.
const CODEMOD_SUPPORTED = new Set([
  "button",
  "input",
  "card",
  "alert",
  "form",
  "form-item",
  "checkbox",
  "radio",
  "radio-group",
  "switch",
  "select",
  "slider",
  "tooltip",
  "dialog",
]);

export interface TokenEstimateBreakdownRow {
  type: string;
  count: number;
  complexity: Complexity;
  codemodSupported: boolean;
}

export interface TokenEstimate {
  iterations: number;
  antdDirect: number;
  rebarOnly: number;
  rebarThenMigrate: number;
  migrationCost: number;
  /**
   * The iteration count at which rebar-ui-then-migrate first becomes cheaper than antd built
   * directly, solved in closed form (both totals are linear in iteration count). `null` only if
   * rebar's per-iteration tax is somehow not lower than antd's for this exact component mix — a
   * crossover always exists given the constants above, but this stays a real check rather than an
   * assumed one.
   *
   * Checked against the real, measured /benchmarks iteration experiment (13-17 rounds) before
   * trusting this — it does NOT land in that range (this model predicts ~44-74 for representative
   * mixes, several times higher). That's a real, understood gap, not a bug: /benchmarks measured
   * cost via fresh one-shot dispatches per round (each re-paying close to a full build's worth of
   * tokens), while this model assumes a lighter per-iteration "reconciliation tax" representing a
   * continuous, already-open coding session. Different iteration styles, not the same quantity
   * measured twice — see /docs/token-estimate for the full explanation. Do not "fix" the constants
   * below to force agreement with 13-17; that would fabricate a match that isn't real.
   */
  breakevenIterations: number | null;
  breakdown: TokenEstimateBreakdownRow[];
}

export function estimateTokenCost(counts: ComponentCounts, iterations: number): TokenEstimate {
  let antdBase = 0;
  let antdTaxPerIteration = 0;
  let rebarBase = 0;
  let rebarTaxPerIteration = 0;
  let migrationCost = 0;
  const breakdown: TokenEstimateBreakdownRow[] = [];

  for (const [type, count] of Object.entries(counts.byType)) {
    const complexity = COMPLEXITY[type] ?? "medium";

    antdBase += BASE_AUTHORING_COST[complexity] * count;
    antdTaxPerIteration += ANTD_ITERATION_TAX[complexity] * count;
    rebarBase += BASE_AUTHORING_COST[complexity] * count * (1 - REBAR_FIRST_BUILD_DISCOUNT);
    rebarTaxPerIteration += REBAR_ITERATION_TAX[complexity] * count;

    const codemodSupported = CODEMOD_SUPPORTED.has(type);
    migrationCost += codemodSupported
      ? CODEMOD_REVIEW_COST * count
      : BASE_AUTHORING_COST[complexity] * count * MANUAL_MIGRATION_MULTIPLIER;

    breakdown.push({ type, count, complexity, codemodSupported });
  }

  const antdDirect = antdBase + antdTaxPerIteration * iterations;
  const rebarOnly = rebarBase + rebarTaxPerIteration * iterations;
  const rebarThenMigrate = rebarOnly + migrationCost;

  // antdDirect(n) = antdBase + antdTaxPerIteration * n
  // rebarThenMigrate(n) = rebarBase + migrationCost + rebarTaxPerIteration * n
  // Solve antdDirect(n) = rebarThenMigrate(n) for n.
  const taxGap = antdTaxPerIteration - rebarTaxPerIteration;
  const breakevenIterations =
    taxGap > 0 ? Math.max(0, (rebarBase + migrationCost - antdBase) / taxGap) : null;

  return {
    iterations,
    antdDirect,
    rebarOnly,
    rebarThenMigrate,
    migrationCost,
    breakevenIterations,
    breakdown: breakdown.sort((a, b) => b.count - a.count),
  };
}
