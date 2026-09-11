/**
 * The placement layer's schema: named blocks — super-components made of `rebar-ui` components,
 * not layout primitives. An LLM authoring a `Block[]` document picks which block fits each piece
 * of content and supplies that content
 * — it never decides direction, gap, nesting, or any other layout property. `BlockRenderer`
 * (this package) is the only thing that turns a document into an actual component tree.
 *
 * The first three blocks (banner/checklist/callout) plus `header` are validated by the real,
 * repeated (n=15) measurements on /benchmarks — see ref/ARCHITECTURE.md#the-placement-layer.
 * `feature-grid` and `pillar-grid` cover this project's own marketing site (apps/docs). `form`,
 * `table`, `data-list`, `filter-bar`, `tabs`, and `modal` were added to cover the Simple/
 * Composite/Complex tiers on /benchmarks (a settings form, a filterable list with a modal, a
 * tabbed wizard) — none measured in isolation yet, same caveat as feature-grid/pillar-grid.
 * `hero`, `section-header`, and `doc-section` were added to rebuild this project's own marketing
 * site through the placement layer (dogfooding, per ref/PLAN.md) instead of hand-authored Rebar
 * JSX — also unmeasured. `doc-section` intentionally supports only a tiny inline markup
 * (backtick-code, `[label](href)` links, `*emphasis*`) inside its prose text, not full markdown —
 * see `ProseNode` below. `props-table` was added for the same dogfooding reason, to rebuild
 * apps/docs's own /components/* reference pages — it takes already-generated `PropRow[]` data
 * rather than reading apps/docs's generated component-props.json itself, since this package has
 * no dependency on any one consuming app's build output. `nav-bar` wraps `rebar-ui`'s `NavBar` —
 * a horizontal site nav that collapses overflowing items into a trailing popover once they'd
 * cross half the header's width (see ref/HEURISTICS.md's "Nav overflow" rule); added to dogfood
 * that rule on this project's own site header, unmeasured like the rest of this batch. `nav-index`
 * wraps `rebar-ui`'s `NavIndex` — a vertical link index with search and category chips that only
 * appear once the list is long enough to need them (ref/HEURISTICS.md #11, IA as pyramid); added
 * after apps/docs independently hand-rolled this same shape twice for its own `/components` and
 * `/docs` sidebars — a real component now instead of page-local duplication, unmeasured like the
 * rest of this batch. `page-index` wraps `rebar-ui`'s `SectionNav` — the in-page counterpart to
 * `nav-index` (indexes headings on the *current* page, not links to other ones). By default it
 * takes no `sections` prop: `BlockRenderer` derives them itself by scanning the document's own
 * top-level `doc-section` blocks for a `heading`, slugifying each into an anchor id assigned to
 * that section's own `Heading` — the document author places one `page-index` block, gets an index
 * of whatever headings actually exist, and never has to invent or keep IDs in sync by hand. A page
 * whose content isn't `doc-section`-shaped (a bespoke reference page with its own heading
 * structure) can pass an explicit `sections` list instead, which wins over auto-derivation — this
 * is what lets a page migrate its right-hand index from a hand-authored `SectionNav` call onto the
 * real `page-index` block (same component underneath either way, so nothing about how it looks or
 * behaves changes) without first having to restructure its entire body into `doc-section` blocks.
 * `card-grid` is a wrapping grid of cards (title, optional body, optional link, optional status
 * tags) for an open-ended index/directory of many similar named things — added after this
 * project's own `/components` page was caught hand-authoring exactly this shape directly (a
 * `Stack` + `.map()` + `Card`), rather than through a named block like every other repeating
 * layout on this site; unmeasured like the rest of this batch. Distinct from `feature-grid` (no
 * link, no tags — a handful of short callouts) and `pillar-grid` (a fixed small set with a
 * mandatory CTA): `card-grid` items may each have a different subset of optional fields, which is
 * exactly the shape a directory of components — some documented, some not, some merely planned —
 * actually has.
 *
 * `iframe` wraps `rebar-ui`'s `Iframe` — a real `<iframe>` with a required, not optional, `title`
 * (an embed with no accessible name is a real, common gap). `comparison` is the first block whose
 * own layout isn't single-column: two labeled panels side by side, each holding its own nested
 * `Block[]`, rendered recursively the same way `tabs`/`modal` already nest — added specifically
 * so this project's own homepage could print *both* sides of its "build in Rebar, migrate to
 * antd" comparison (the antd side via an `iframe` block embedding a real separate build) instead
 * of only the Rebar side, closing a real gap found auditing `apps/docs` (PACKER_COVERAGE.md).
 * `BlockRenderer` measures the left panel's real rendered height (`ResizeObserver`) and applies it
 * to the right panel, so an embedded iframe — which needs an explicit height, unlike normal
 * content — always matches its sibling instead of drifting out of sync on theme toggle, content
 * change, or window resize; this lives inside the block's own renderer, not hand-authored by
 * whoever uses it, so any future comparison gets it for free.
 *
 * `heuristic` covers one entry of a heuristics/design-principles page: a heading, a bolded one-line
 * rule, `doc-section`-style prose for the rationale (same tiny inline markup), and an optional code
 * sample and/or a real nested `Block[]` demo. Added to finish converting this project's own
 * `/docs/heuristics` off hand-authored JSX. Distinct from `doc-section` specifically because a
 * heuristic's `rule` needs its own fixed bold styling separate from the rationale that follows it,
 * and because it carries its own stable `id` rather than slugifying one from `title` (this
 * project's real heuristic ids are hand-picked and already referenced elsewhere, e.g. by a
 * `page-index` block's own explicit `sections` list). Two of its 46 entries first needed small
 * schema additions elsewhere before they could print too: `nav-bar`'s `resizable` flag (a bordered,
 * real-CSS-`resize`-able demo wrapper, for interactively showing its overflow-collapse behavior —
 * off by default, since a real site header should never actually be user-resizable) and the new
 * `spin-card` block below (a small centered card showing a real `Spin` loading overlay, generic
 * rather than one-off since nothing about it is specific to heuristics content).
 *
 * `spin-card` is a small, centered card demonstrating a loading state — a real `Spin` overlaying a
 * few lines of content, sized and labeled by the caller rather than hardcoded, even though its
 * first real use (a "fetching" demo on `/docs/heuristics`) only ever needed one specific size/tip.
 *
 * `site-header` is a real site nav bar — logo (optionally linked, optionally with an icon image),
 * a `NavBar` capped at half the header's own width (ref/HEURISTICS.md "Nav overflow" — the logo and
 * trailing content always keep guaranteed room), and optional trailing content pushed to the far
 * edge: plain text (a version string), a login action, or a signed-in user's avatar. Distinct from
 * the plain `header` block above (a page-content title bar, not a site-wide nav) — added after this
 * project's own hand-authored `SiteHeader.tsx` component turned out to be exactly this same
 * shape, worth a real block rather than every consuming app re-inventing the same logo+nav+trailing
 * composition and 50%-width-cap flex arithmetic by hand.
 *
 * `scatter-chart`, `line-chart`, and `stacked-bar-chart` wrap `rebar-ui`'s chart components of the
 * same names — promoted from hand-drawn, one-off SVG helpers this project's own `/benchmarks`
 * pages used to keep locally (see ref/HEURISTICS.md #16, "charts ship with context": each has an
 * optional but recommended `title`, rendered as a real visible caption, not just an accessible
 * name). Added ahead of actually migrating `/benchmarks`' own charts through the Packer, so that
 * migration has a real, already-proven block to print through rather than degrading into some
 * generic table/text representation once it happens. Each block's `yFormat` is deliberately
 * absent — a function isn't serializable `Block[]` data — so a block-rendered chart always uses
 * its component's plain-number default formatter; a caller needing a custom one (a "$" prefix, a
 * "%" suffix) uses the real component directly instead of the block. None of the three is a bare
 * 1:1 pass-through to its canvas component — each renders inside a shared `ChartFilterFooter`
 * sub-component (`BlockRenderer.tsx`): one toggle button per series (`scatter-chart`/`line-chart`)
 * or per distinct segment label across every bar at once (`stacked-bar-chart`, since the "series" a
 * viewer thinks in there is the repeated category, not one specific bar), hiding/showing it without
 * touching the underlying data. Omitted entirely when there's only one series/label to toggle — a
 * footer that can only ever show one state isn't a real control. This is what makes each of these
 * a genuine block rather than the canvas component wearing a block's name.
 *
 * `card-kanban` wraps `rebar-ui`'s `Kanban` (drag-reorder cards/columns, optional per-section
 * dividers and per-column/per-section card limits, a per-column sort toggle) with the chrome a
 * real board needs above it: a title, an optional "shared with" avatar row, a "Share" action
 * (copies a link, reusing `CodeBlock`'s copy/confirm convention), a search box that filters the
 * board's cards, and an optional "Board settings" button opening a real `Dialog` around a nested
 * `Block[]` document — the same recursive-content pattern `modal`/`tabs` already use, so a board's
 * settings form is whatever the caller composes (a rename field, a visibility toggle, a danger
 * zone), not a fixed shape this schema would have to guess at. `KanbanColumnData`/`KanbanCardData`
 * mirror `rebar-ui`'s own `KanbanColumn`/`KanbanCard` shapes but are redefined here rather than
 * imported, same as `WizardStep` above — this package's `Block[]` documents are a serializable wire
 * format, independent of a component's own prop types even when the two currently look identical.
 * The board's own state (which column/section each card sits in) lives in `BlockRenderer`, the
 * same "uncontrolled, caller re-renders on change" contract `Kanban` itself uses — a printed board
 * is a real, usable one, not a static mock. Unmeasured, like the rest of this batch.
 *
 * `sticky-kanban` is the exact same board (same schema shape, same chrome) with one difference:
 * `Kanban`'s `cardVariant="sticky"` instead of the default — postit-style cards (procedurally
 * varied rotation/shadow, a caller-or-auto-assigned color) capped at 3 per column, click (not drag)
 * opens an edit form for a sticky's title/description/tags/color rather than a caller-supplied
 * modal. A mutation of the same primitive, not a second component or a second block schema.
 *
 * `table` was upgraded from a bare hand-rolled `<Box as="table">` (its original, since-fixed
 * gap — it never actually used the real `rebar-ui` `Table` component) to render through `Table`
 * for real: sortable columns, and two new optional fields — `searchPlaceholder` (a box filtering
 * rows whose cells match anywhere) and `filters` (named exact-match filters against a specific
 * column, collapsing into a "More filters" popover past 2, the same bounded-then-collapse
 * convention `nav-bar`'s own overflow already uses). The schema shape (`columns: string[]`,
 * `rows: TableRow[]`) didn't change — every existing `table` block (the Simple/Composite/Complex
 * tier specs on /benchmarks) keeps working unmodified; the new fields are additive and optional.
 *
 * `side-panel` wraps `rebar-ui`'s `SidePanel` — a persistent, non-modal side panel (the Slack
 * "thread"/"details" pattern), rendered beside a nested `main: Block[]` document rather than over
 * it. Distinct from `modal` (a forced-open `Dialog`, a backdrop overlay meant for a static-render
 * context only): a side panel has no backdrop and is meant for a real, live page — the main
 * content stays fully visible and interactive while it's open. Unmeasured, like the rest of this
 * batch.
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

export interface CardGridItem {
  title: string;
  body?: string;
  href?: string;
  linkLabel?: string;
  /** Lifecycle status pills (e.g. "Planned", "No reference page") — see ref/HEURISTICS.md #41. */
  tags?: { label: string; tone?: Tone }[];
}

export interface PersonaCardItem {
  name: string;
  meta?: string;
  avatarSrc?: string;
  /** Same convention as `Avatar`'s own `placeholder` prop — an illustrated portrait when no
   * `avatarSrc` is set, deterministic per `name`. */
  avatarPlaceholder?: boolean;
}

export type FormField =
  | { kind: "text" | "email" | "date"; label: string; placeholder?: string; required?: boolean }
  | { kind: "textarea"; label: string; placeholder?: string; required?: boolean }
  | { kind: "select"; label: string; options: string[]; required?: boolean }
  | { kind: "checkbox"; label: string; checked?: boolean; required?: boolean };

export interface WizardStep {
  label: string;
  description?: string;
  /** `required` gates this step's Next/Submit button — see `Wizard` (`packages/core`) and
   * ref/HEURISTICS.md's note on JFace's wizard pattern (validation-gating, not just progress). */
  fields: FormField[];
}

export interface TableRow {
  cells: string[];
  actionLabel?: string;
}

export interface TableFilter {
  label: string;
  /** Which column (by index into the block's own `columns` array) this filter matches against. */
  columnIndex: number;
  options: string[];
}

export interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  /** Sticky-note background color — `sticky-kanban` only, ignored by `card-kanban`. */
  color?: string;
}

export interface KanbanSectionData {
  id: string;
  /** A divider label within a column — omit for a column with no dividers. */
  label?: string;
  cardIds: string[];
  limit?: number;
}

export interface KanbanColumnData {
  id: string;
  title: string;
  sections: KanbanSectionData[];
  limit?: number;
}

export interface DataListItem {
  title: string;
  badge?: string;
  /** An avatar/meta row, closing the "List / ListItem" catalogue gap (avatar + title + meta +
   * action, distinct from a data Table) as an extension of this existing block rather than a new
   * one — see ref/COMPONENT_BUILD_PLAN.md, Phase B. */
  meta?: string;
  avatarSrc?: string;
  avatarPlaceholder?: boolean;
  action?: Action;
}

export interface GoalTrackerGoalData {
  id: string;
  text: string;
  completed: boolean;
}

export interface GoalTrackerFocusAreaData {
  id: string;
  text: string;
  goals: GoalTrackerGoalData[];
}

export interface AiChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** An avatar shown beside this message — omitted entirely unless `avatarFallback` is set,
   * matching `ChatThread`'s own `ChatMessage` shape exactly. */
  avatarFallback?: string;
  avatarSrc?: string;
  avatarPlaceholder?: boolean;
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
 * One paragraph, code sample, or list inside a `doc-section`. `text` (and each `list` item)
 * supports a deliberately tiny inline markup, not full markdown: `` `code` `` for inline code,
 * `[label](href)` for a link, and `*emphasis*` for `<em>` — exactly the three inline patterns
 * actual prose on this site's own docs pages needed, nothing more.
 */
export type ProseNode =
  | { kind: "text"; text: string }
  | { kind: "code"; code: string }
  | { kind: "list"; items: string[]; ordered?: boolean };

export interface NavBarItem {
  label: string;
  href: string;
}

export interface NavIndexItem {
  label: string;
  href: string;
  category?: string;
  /** Lifecycle status ("Planned", "Deprecated") — rendered as a real `Tag` pill, never appended
   * into `label` as text. See ref/HEURISTICS.md #41. */
  status?: string;
}

export interface SectionNavItem {
  id: string;
  label: string;
}

export type Block =
  | { type: "header"; title: string; action?: Action }
  | {
      type: "nav-bar";
      items: NavBarItem[];
      ariaLabel?: string;
      /** Wraps the rendered `NavBar` in a bordered, hand-resizable (real CSS `resize: horizontal`)
       * demo box — for interactively demonstrating the overflow-collapse behavior (ref/HEURISTICS.md
       * "Nav overflow"), never for a real site header, which should never actually be
       * user-resizable. Off by default. */
      resizable?: boolean;
    }
  | {
      type: "site-header";
      logo: { label: string; href?: string; iconSrc?: string };
      items: NavBarItem[];
      ariaLabel?: string;
      /** Right-aligned trailing content, pushed to the header's far edge. Omit for a header that
       * just ends after the nav. */
      trailing?:
        | { kind: "text"; text: string }
        | { kind: "login"; label?: string; href?: string }
        | {
            kind: "avatar";
            name: string;
            avatarSrc?: string;
            href?: string;
            placeholder?: boolean;
          };
      /** Adds a "Theme" popover to the header's trailing edge, alongside (not instead of)
       * `trailing` — two independent toggles, `sketch`/`clean` (labeled "Sketch"/"Simple") writing
       * `data-rebar-theme`, and `light`/`dark` writing/removing `data-theme`, the same two
       * attributes and values `RebarDevTools`' own dev-only panel already toggles. A visitor-facing
       * escape hatch onto the same real theme switch a developer gets in DevTools, not a new one.
       * Off by default. */
      themeToggle?: boolean;
    }
  | {
      type: "nav-index";
      items: NavIndexItem[];
      categoryLabels?: Record<string, string>;
      /** Display label per distinct `status` value — see ref/HEURISTICS.md #42 (status is a
       * second, independent filter dimension alongside category, once items carry more than one
       * distinct value). */
      statusLabels?: Record<string, string>;
      /** Label for the status-filter option covering items with no `status` set — defaults to
       * `NavIndex`'s own "Other" if omitted. */
      unstatusedLabel?: string;
      searchPlaceholder?: string;
      ariaLabel?: string;
    }
  | {
      type: "page-index";
      searchPlaceholder?: string;
      /** Explicit section list — overrides the default auto-derive-from-`doc-section`-headings
       * behavior (see the doc comment above). For a page whose content isn't built from
       * `doc-section` blocks (a bespoke reference page with its own heading structure, say) and
       * so has nothing for the Packer to scan, supply the same `{ id, label }` list the page would
       * otherwise pass straight to `SectionNav` by hand. */
      sections?: SectionNavItem[];
    }
  | { type: "banner"; tone: Tone; icon?: IconName; text: string; action?: Action }
  | { type: "checklist"; heading?: string; items: string[] }
  | {
      type: "goal-tracker";
      aspiration: string;
      focusAreas: GoalTrackerFocusAreaData[];
      celebration?: "none" | "small" | "big";
    }
  | {
      type: "ai-chat";
      title?: string;
      messages: AiChatMessageData[];
      placeholder?: string;
      /** Shows the dictation (voice-to-text) toggle on the input. Default `false`. */
      dictation?: boolean;
      /** Height of the scrollable transcript area, in px. Default `240`. */
      height?: number;
    }
  | { type: "callout"; tone: Tone; icon?: IconName; title: string; subtitle?: string }
  | { type: "feature-grid"; items: FeatureGridItem[] }
  | { type: "pillar-grid"; items: PillarGridItem[] }
  | { type: "card-grid"; items: CardGridItem[] }
  | { type: "persona-card"; items: PersonaCardItem[] }
  | { type: "form"; heading?: string; fields: FormField[]; submitLabel?: string }
  | {
      type: "table";
      columns: string[];
      rows: TableRow[];
      /** Enables per-column sort (the real `Table` component's own sort, not a fixed order) —
       * on by default. */
      sortable?: boolean;
      /** Shows a search box filtering rows whose cells match anywhere (case-insensitive
       * substring). Omit to skip it entirely. */
      searchPlaceholder?: string;
      /** Named filters, each matching a specific column's value exactly. More than 2 collapse
       * into a "More filters" popover — see ref/HEURISTICS.md's "Nav overflow" rule, the same
       * bounded-then-collapse convention `nav-bar` already uses. */
      filters?: TableFilter[];
      /** Shows an "Add row" button opening a small inline form (one text field per column,
       * labeled by that column's header). Submitting appends the row to the table's own local
       * component state — a real, working add flow, not a decorative button, but the new row is
       * ephemeral (local state only, lost on reload) since the block schema has no persistence
       * layer of its own; a caller needing the new row to stick needs its own storage, the same
       * way `card-kanban`'s board state is real-but-local for the same reason. */
      addable?: boolean | { label?: string };
      /** Shows an "Export CSV" button — downloads the currently visible rows (post search/filter)
       * as a real `.csv` file, entirely client-side. */
      exportable?: boolean;
      /** Shows a "Copy" button — copies the currently visible rows to the clipboard as
       * tab-separated values, so they paste cleanly into a spreadsheet. Same copy/confirm
       * convention as `CodeBlock`'s own Copy button (label flips to "Copied!" for 2s). */
      copyable?: boolean;
    }
  | { type: "data-list"; items: DataListItem[] }
  | { type: "filter-bar"; searchPlaceholder?: string; filterLabel?: string; filterOptions?: string[]; actionLabel?: string }
  | { type: "tabs"; tabs: { label: string; blocks: Block[] }[] }
  | { type: "modal"; title: string; blocks: Block[]; confirmLabel?: string; cancelLabel?: string }
  | { type: "wizard"; steps: WizardStep[]; submitLabel?: string; backLabel?: string; nextLabel?: string }
  | {
      type: "card-kanban";
      title: string;
      sharedWith?: { name: string; avatarSrc?: string }[];
      columns: KanbanColumnData[];
      cards: Record<string, KanbanCardData>;
      searchPlaceholder?: string;
      shareUrl?: string;
      /** Content shown inside the "Board settings" modal — omit to hide the button entirely. */
      settingsBlocks?: Block[];
    }
  | {
      type: "sticky-kanban";
      title: string;
      sharedWith?: { name: string; avatarSrc?: string }[];
      columns: KanbanColumnData[];
      cards: Record<string, KanbanCardData>;
      searchPlaceholder?: string;
      shareUrl?: string;
      settingsBlocks?: Block[];
    }
  | { type: "hero"; badge?: string; title: string; subtitle: string; actions?: Action[]; codeSnippet?: string }
  | { type: "section-header"; kicker?: string; title: string; subtitle?: string }
  | { type: "doc-section"; heading?: string; level?: 1 | 2 | 3; body: ProseNode[] }
  | { type: "props-table"; heading?: string; rows: PropRow[] }
  | {
      type: "iframe";
      src: string;
      title: string;
      /** Explicit pixel height — an iframe has no natural content height to size itself by,
       * unlike everything else this schema renders. Set automatically by a parent `comparison`
       * block (matching its other panel's real measured height) when omitted here. */
      height?: number;
    }
  | {
      type: "comparison";
      leftLabel: string;
      leftBlocks: Block[];
      rightLabel: string;
      rightBlocks: Block[];
    }
  | {
      type: "side-panel";
      /** The main content area, to the panel's left. */
      main: Block[];
      panel: {
        title: string;
        blocks: Block[];
        /** Whether the panel starts expanded or collapsed to its rail. Default `true`. */
        defaultOpen?: boolean;
      };
    }
  | {
      type: "heuristic";
      /** Explicit, not slugified from `title` — this project's own heuristics use hand-picked,
       * semantic anchor ids (`"beacon-point"`, not a mechanical slug of "44. A tracking
       * indicator..."), and existing external links/a `page-index` block's own `sections` list
       * may already reference a specific id, so nothing here is free to invent one. */
      id: string;
      title: string;
      /** The one-line bolded rule statement — deliberately a plain string, not `ProseNode[]`: every
       * real rule across this project's own 46 heuristics is one short sentence with no inline
       * code/links, and a dedicated field (rather than folding it into `rationale`) is what lets
       * `BlockRenderer` give it its own fixed bold styling, distinct from the rationale that follows. */
      rule: string;
      rationale: ProseNode[];
      /** An optional code sample shown as-is (Block JSON, real component JSX, whatever illustrates
       * the point) — not necessarily runnable Block data, just illustrative text. */
      code?: string;
      /** An optional *live*, real Block[] demo, rendered recursively the same way `tabs`/`modal`/
       * `comparison` already nest — distinct from `code` above (which is just displayed text): a
       * heuristic can have one, both, or neither. */
      exampleBlocks?: Block[];
    }
  | {
      type: "spin-card";
      /** A small, centered card showing a real `Spin` loading overlay over a few lines of content —
       * for demonstrating a loading state, not a real data-bound card. Defaults sized/labeled to
       * match this block's original real-world use (a "fetching" demo on /docs/heuristics). */
      tip?: string;
      items: string[];
      width?: number;
      minHeight?: number;
    }
  | {
      type: "scatter-chart";
      /** Rendered as a real, visible caption — see ref/HEURISTICS.md #16 (charts ship with
       * context). Optional only so a chart embedded somewhere its own heading already serves this
       * role doesn't get a duplicate one. */
      title?: string;
      /** Falls back to `title` when omitted — the chart's own accessible name. */
      ariaLabel?: string;
      height?: number;
      series: { label: string; color?: string; values: number[] }[];
    }
  | {
      type: "line-chart";
      title?: string;
      ariaLabel?: string;
      height?: number;
      xLabels: string[];
      labelStep?: number;
      crossoverIndex?: number;
      series: { label: string; color?: string; values: number[]; dashed?: boolean }[];
    }
  | {
      type: "stacked-bar-chart";
      title?: string;
      ariaLabel?: string;
      height?: number;
      bars: { label: string; segments: { label: string; value: number; color?: string }[] }[];
    }
  | {
      /** A small, static, presentational summary table — headers plus a plain grid of string/number
       * cells, no sorting/selection/pagination. Distinct from `table` (which pairs the real `Table`
       * component with search/filters over row objects): this exists for the exact
       * headers-plus-rows-of-cells shape a benchmark results table needs, with no column-keyed
       * object indirection to build. Renders through the same real `Table` component underneath. */
      type: "stats-table";
      headers: string[];
      rows: (string | number)[][];
    }
  | {
      /** A labeled, single-aspect-ratio image carousel — screenshots named `${prefix}-01.png`
       * through `${prefix}-NN.png` inside `dir` (a public/ path), per ref/HEURISTICS.md's carousel
       * rule (one aspect ratio only, no exceptions). `count` defaults to 15 to match this project's
       * own standard benchmark sample size. */
      type: "gallery";
      label: string;
      dir: string;
      prefix: string;
      count?: number;
    };
