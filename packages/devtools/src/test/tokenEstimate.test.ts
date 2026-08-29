import { describe, expect, it } from "vitest";
import { estimateTokenCost } from "../tokenEstimate";

describe("estimateTokenCost", () => {
  it("is zero across all three scenarios for an empty page", () => {
    const estimate = estimateTokenCost({ total: 0, byType: {} }, 5);
    expect(estimate.antdDirect).toBe(0);
    expect(estimate.rebarOnly).toBe(0);
    expect(estimate.rebarThenMigrate).toBe(0);
  });

  it("rebarOnly does not grow with iteration count (the core thesis: no re-styling tax)", () => {
    const counts = { total: 3, byType: { button: 3 } };
    const at1 = estimateTokenCost(counts, 1);
    const at10 = estimateTokenCost(counts, 10);
    expect(at1.rebarOnly).toBe(at10.rebarOnly);
  });

  it("antdDirect grows linearly with iteration count, rebarOnly stays flat", () => {
    const counts = { total: 3, byType: { button: 3 } };
    const at1 = estimateTokenCost(counts, 1);
    const at2 = estimateTokenCost(counts, 2);
    const antdGrowth = at2.antdDirect - at1.antdDirect;
    const rebarGrowth = at2.rebarOnly - at1.rebarOnly;
    expect(antdGrowth).toBeGreaterThan(0);
    expect(rebarGrowth).toBe(0);
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
