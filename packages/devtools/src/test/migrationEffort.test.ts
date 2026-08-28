import { describe, expect, it } from "vitest";
import { estimateMigrationEffort } from "../migrationEffort";

describe("estimateMigrationEffort", () => {
  it("labels an empty page Low", () => {
    expect(estimateMigrationEffort({ total: 0, byType: {} }).effort).toBe("Low");
  });

  it("weighs complex components (e.g. form) more heavily than simple ones", () => {
    const simpleHeavy = estimateMigrationEffort({
      total: 5,
      byType: { button: 5 },
    });
    const complexHeavy = estimateMigrationEffort({
      total: 5,
      byType: { form: 5 },
    });
    expect(complexHeavy.score).toBeGreaterThan(simpleHeavy.score);
  });

  it("treats an unknown component type as medium complexity rather than throwing", () => {
    expect(() =>
      estimateMigrationEffort({ total: 1, byType: { "future-widget": 1 } }),
    ).not.toThrow();
  });

  it("crosses into Medium and High at the documented thresholds", () => {
    expect(estimateMigrationEffort({ total: 9, byType: { button: 9 } }).effort).toBe("Low");
    expect(estimateMigrationEffort({ total: 10, byType: { button: 10 } }).effort).toBe(
      "Medium",
    );
    expect(estimateMigrationEffort({ total: 10, byType: { form: 10 } }).effort).toBe("High");
  });
});
