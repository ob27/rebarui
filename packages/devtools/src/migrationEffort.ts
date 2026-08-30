import type { ComponentCounts } from "./useComponentCounts";

export type Complexity = "simple" | "medium" | "complex";

export const COMPLEXITY: Record<string, Complexity> = {
  box: "simple",
  stack: "simple",
  text: "simple",
  heading: "simple",
  button: "simple",
  input: "simple",
  card: "simple",
  alert: "simple",
  "form-item": "simple",
  checkbox: "simple",
  radio: "simple",
  switch: "simple",
  avatar: "simple",
  "aspect-ratio": "simple",
  progress: "simple",
  dialog: "medium",
  tabs: "medium",
  "radio-group": "medium",
  select: "medium",
  tooltip: "medium",
  popover: "medium",
  dropdown: "medium",
  slider: "medium",
  accordion: "medium",
  toast: "medium",
  carousel: "medium",
  form: "complex",
  divider: "simple",
  tag: "simple",
  badge: "simple",
  empty: "simple",
  skeleton: "simple",
  spin: "simple",
  breadcrumb: "simple",
  statistic: "simple",
  steps: "medium",
  result: "simple",
  descriptions: "simple",
  timeline: "simple",
  rate: "medium",
};

const WEIGHT: Record<Complexity, number> = { simple: 1, medium: 2, complex: 3 };

export type MigrationEffort = "Low" | "Medium" | "High";

export interface MigrationEstimate {
  score: number;
  effort: MigrationEffort;
}

/**
 * A rough, configurable heuristic — not a measured cost. See ref/ASSESSMENT.md on why this
 * replaces the original brainstorm's fabricated token/dollar figures with a bucketed label
 * derived from real component counts instead.
 */
export function estimateMigrationEffort(counts: ComponentCounts): MigrationEstimate {
  let score = 0;
  for (const [type, count] of Object.entries(counts.byType)) {
    const complexity = COMPLEXITY[type] ?? "medium";
    score += WEIGHT[complexity] * count;
  }

  const effort: MigrationEffort = score < 10 ? "Low" : score < 30 ? "Medium" : "High";
  return { score, effort };
}
