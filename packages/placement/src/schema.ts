/**
 * The placement layer's schema: named archetypal blocks, not layout primitives. An LLM authoring
 * a `Block[]` document picks which archetype fits each piece of content and supplies that content
 * — it never decides direction, gap, nesting, or any other layout property. `BlockRenderer`
 * (this package) is the only thing that turns a document into an actual component tree.
 *
 * The first three archetypes (banner/checklist/callout) plus `header` are validated by the real,
 * repeated (n=15) measurements on /benchmarks — see ref/ARCHITECTURE.md#the-placement-layer.
 * `feature-grid` and `pillar-grid` are new, added to cover this project's own marketing site
 * (apps/docs) so it could be built through this layer too, not measured in isolation yet.
 */

export type IconName = "close" | "info" | "refresh" | "clock";
export type Tone = "info" | "warning" | "success" | "error";

export interface Action {
  label?: string;
  icon?: IconName;
  /** If set, the action renders as a link (via the renderer's `renderLink`) instead of a plain button. */
  href?: string;
}

export interface FeatureGridItem {
  title: string;
  body: string;
}

export interface PillarGridItem {
  title: string;
  body: string;
  href: string;
  cta: string;
}

export type Block =
  | { type: "header"; title: string; action?: Action }
  | { type: "banner"; tone: Tone; icon?: IconName; text: string; action?: Action }
  | { type: "checklist"; heading?: string; items: string[] }
  | { type: "callout"; tone: Tone; icon?: IconName; title: string; subtitle?: string }
  | { type: "feature-grid"; items: FeatureGridItem[] }
  | { type: "pillar-grid"; items: PillarGridItem[] };
