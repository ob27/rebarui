/**
 * The placement layer's schema: named archetypal blocks, not layout primitives. An LLM authoring
 * a `Block[]` document picks which archetype fits each piece of content and supplies that content
 * — it never decides direction, gap, nesting, or any other layout property. `BlockRenderer`
 * (this package) is the only thing that turns a document into an actual component tree.
 *
 * The first three archetypes (banner/checklist/callout) plus `header` are validated by the real,
 * repeated (n=15) measurements on /benchmarks — see ref/ARCHITECTURE.md#the-placement-layer.
 * `feature-grid` and `pillar-grid` cover this project's own marketing site (apps/docs). `form`,
 * `table`, `data-list`, `filter-bar`, `tabs`, and `modal` were added to cover the Simple/
 * Composite/Complex tiers on /benchmarks (a settings form, a filterable list with a modal, a
 * tabbed wizard) — none measured in isolation yet, same caveat as feature-grid/pillar-grid.
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

export type FormField =
  | { kind: "text" | "email" | "date"; label: string; placeholder?: string }
  | { kind: "textarea"; label: string; placeholder?: string }
  | { kind: "select"; label: string; options: string[] }
  | { kind: "checkbox"; label: string; checked?: boolean };

export interface TableRow {
  cells: string[];
  actionLabel?: string;
}

export interface DataListItem {
  title: string;
  badge?: string;
}

export type Block =
  | { type: "header"; title: string; action?: Action }
  | { type: "banner"; tone: Tone; icon?: IconName; text: string; action?: Action }
  | { type: "checklist"; heading?: string; items: string[] }
  | { type: "callout"; tone: Tone; icon?: IconName; title: string; subtitle?: string }
  | { type: "feature-grid"; items: FeatureGridItem[] }
  | { type: "pillar-grid"; items: PillarGridItem[] }
  | { type: "form"; heading?: string; fields: FormField[]; submitLabel?: string }
  | { type: "table"; columns: string[]; rows: TableRow[] }
  | { type: "data-list"; items: DataListItem[] }
  | { type: "filter-bar"; searchPlaceholder?: string; filterLabel?: string; filterOptions?: string[]; actionLabel?: string }
  | { type: "tabs"; tabs: { label: string; blocks: Block[] }[] }
  | { type: "modal"; title: string; blocks: Block[]; confirmLabel?: string; cancelLabel?: string };
