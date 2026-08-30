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
 * `hero`, `section-header`, and `doc-section` were added to rebuild this project's own marketing
 * site through the placement layer (dogfooding, per ref/PLAN.md) instead of hand-authored Rebar
 * JSX — also unmeasured. `doc-section` intentionally supports only a tiny inline markup
 * (backtick-code, `[label](href)` links) inside its prose text, not full markdown — see
 * `ProseNode` below. `props-table` was added for the same dogfooding reason, to rebuild
 * apps/docs's own /components/* reference pages — it takes already-generated `PropRow[]` data
 * rather than reading apps/docs's generated component-props.json itself, since this package has
 * no dependency on any one consuming app's build output.
 */

export type IconName = "close" | "info" | "refresh" | "clock";
export type Tone = "info" | "warning" | "success" | "error";

export interface Action {
  label?: string;
  icon?: IconName;
  /** If set, the action renders as a link (via the renderer's `renderLink`) instead of a plain button. */
  href?: string;
  /**
   * Button emphasis — only respected by `hero` (banner/header/callout actions stay a fixed small
   * secondary style, unaffected by this). Defaults to `"secondary"`.
   */
  variant?: "primary" | "secondary";
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

/**
 * One row of a component's prop reference, as generated from real TypeScript types (see
 * apps/docs/scripts/generate-props.mjs) — the `props-table` block renders exactly this shape, so
 * a page passes the already-generated rows in rather than the renderer reaching into any
 * generated-data file itself (this package has no dependency on any one consuming app's build).
 */
export interface PropRow {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string | null;
}

/**
 * One paragraph, code sample, or list inside a `doc-section`. `text` supports a deliberately tiny
 * inline markup, not full markdown: `` `code` `` for inline code and `[label](href)` for a link —
 * exactly the two inline patterns actual prose on this site's own docs pages needed, nothing more.
 */
export type ProseNode =
  | { kind: "text"; text: string }
  | { kind: "code"; code: string }
  | { kind: "list"; items: string[]; ordered?: boolean };

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
  | { type: "modal"; title: string; blocks: Block[]; confirmLabel?: string; cancelLabel?: string }
  | { type: "hero"; badge?: string; title: string; subtitle: string; actions?: Action[]; codeSnippet?: string }
  | { type: "section-header"; kicker?: string; title: string; subtitle?: string }
  | { type: "doc-section"; heading?: string; level?: 2 | 3; body: ProseNode[] }
  | { type: "props-table"; heading?: string; rows: PropRow[] };
