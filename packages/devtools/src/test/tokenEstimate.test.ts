import { describe, expect, it } from "vitest";
import { estimateTokenCost } from "../tokenEstimate";

describe("estimateTokenCost", () => {
  it("is zero across all three scenarios for an empty page", () => {
    const estimate = estimateTokenCost({ total: 0, byType: {} }, 5);
    expect(estimate.antdDirect).toBe(0);
    expect(estimate.rebarOnly).toBe(0);
    expect(estimate.rebarThenMigrate).toBe(0);
  });

  it("rebarOnly grows with iteration count, but slower than antdDirect (real per-round tax, not zero)", () => {
    const counts = { total: 3, byType: { button: 3 } };
    const at1 = estimateTokenCost(counts, 1);
    const at10 = estimateTokenCost(counts, 10);
    expect(at10.rebarOnly).toBeGreaterThan(at1.rebarOnly);
    expect(at10.rebarOnly - at1.rebarOnly).toBeLessThan(at10.antdDirect - at1.antdDirect);
  });

  it("antdDirect grows faster per iteration than rebarOnly (real, measured gap — not zero for rebar)", () => {
    const counts = { total: 3, byType: { button: 3 } };
    const at1 = estimateTokenCost(counts, 1);
    const at2 = estimateTokenCost(counts, 2);
    const antdGrowth = at2.antdDirect - at1.antdDirect;
    const rebarGrowth = at2.rebarOnly - at1.rebarOnly;
    expect(antdGrowth).toBeGreaterThan(0);
    expect(rebarGrowth).toBeGreaterThan(0);
    expect(rebarGrowth).toBeLessThan(antdGrowth);
  });

  it("computes a breakevenIterations that actually matches where the totals cross", () => {
    const counts = { total: 1, byType: { form: 1 } };
    const estimate = estimateTokenCost(counts, 5);
    expect(estimate.breakevenIterations).not.toBeNull();
    const n = estimate.breakevenIterations as number;
    expect(n).toBeGreaterThan(0);

    const justBefore = estimateTokenCost(counts, Math.max(0, n - 1));
    const justAfter = estimateTokenCost(counts, n + 1);
    // Before the computed breakeven point, antd is still cheaper (or roughly tied); after it,
    // rebar-ui-plus-migration has genuinely pulled ahead.
    expect(justBefore.rebarThenMigrate).toBeGreaterThanOrEqual(justBefore.antdDirect - 1);
    expect(justAfter.rebarThenMigrate).toBeLessThan(justAfter.antdDirect);
  });

  it("crosses over: rebarThenMigrate beats antdDirect once enough iterations accumulate", () => {
    const counts = { total: 1, byType: { form: 1 } };
    const fewIterations = estimateTokenCost(counts, 1);
    const manyIterations = estimateTokenCost(counts, 20);

    // With few iterations, the one-time migration cost can dominate.
    // With many iterations, the recurring AntD tax should win out and make the direct
    // path more expensive than Rebar + a single migration.
    expect(manyIterations.rebarThenMigrate).toBeLessThan(manyIterations.antdDirect);
    expect(fewIterations.antdDirect).toBeGreaterThan(0);
  });

  it("charges a small flat review cost for codemod-supported components, not a from-scratch rebuild", () => {
    const buttonOnly = estimateTokenCost({ total: 1, byType: { button: 1 } }, 1);
    const boxOnly = estimateTokenCost({ total: 1, byType: { box: 1 } }, 1);
    // Both are "simple" tier with the same base authoring cost, but Button is codemod-supported
    // (migrate-antd handles it) and Box is not (falls to the manual/LLM path) — migration cost
    // must be lower for the codemod-supported one.
    expect(buttonOnly.migrationCost).toBeLessThan(boxOnly.migrationCost);
  });

  it("treats an unknown component type as medium complexity rather than throwing", () => {
    expect(() =>
      estimateTokenCost({ total: 1, byType: { "future-widget": 1 } }, 5),
    ).not.toThrow();
  });

  it("returns a breakdown row per component type, sorted by count descending", () => {
    const estimate = estimateTokenCost(
      { total: 5, byType: { button: 3, dialog: 2 } },
      5,
    );
    expect(estimate.breakdown[0]).toMatchObject({ type: "button", count: 3 });
    expect(estimate.breakdown[1]).toMatchObject({ type: "dialog", count: 2 });
  });
});
