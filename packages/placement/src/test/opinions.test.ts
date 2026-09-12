import { describe, expect, it } from "vitest";
import { OPINION_BLOCK_TYPES, isOpinionBlockType } from "../opinions";

describe("opinions", () => {
  it("OPINION_BLOCK_TYPES covers exactly the blocks with a live source/onX binding, and no others", () => {
    expect([...OPINION_BLOCK_TYPES].sort()).toEqual(
      [
        "ai-chat",
        "table",
        "goal-tracker",
        "card-kanban",
        "sticky-kanban",
        "wizard",
        "scatter-chart",
        "line-chart",
        "stacked-bar-chart",
      ].sort(),
    );
  });

  it("isOpinionBlockType agrees with OPINION_BLOCK_TYPES", () => {
    expect(isOpinionBlockType("ai-chat")).toBe(true);
    expect(isOpinionBlockType("hero")).toBe(false);
    expect(isOpinionBlockType("site-header")).toBe(false);
  });
});
