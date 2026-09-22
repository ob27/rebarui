---
title: Rebar UI — building out the catalogued component gaps
status: living document
---

# Building out the catalogued component gaps

`apps/docs/src/data/componentCatalog.{web,mobile,diagrams}.ts` lists 55 components identified by
cross-referencing 180+ published UI libraries against rebar-ui's current set (see
`/components` on the site — each renders as a "Planned" card today, no implementation). This is
the build-out plan for closing that list: for each one, a decision on whether it's a **component**
(a new primitive in `packages/core`) or a **block** (a super-component composed of existing
components, plumbed into `@rebar-ui/placement`), and — for blocks — which prerequisite components
have to exist first.

## The per-item workflow

For every row below, in order:

1. **Decide component vs. block**, if not already decided here. A component is a single primitive
   with its own behavior/state (like `Select` or `Dialog`); a block is a named, pre-decided
   *layout* of existing components an LLM picks by supplying content, not markup (like
   `card-grid` or `nav-index`) — see `ref/ARCHITECTURE.md`'s placement-layer section and
   `packages/placement/src/schema.ts`'s own doc comment for the exact distinction. If an item
   turns out to be neither — just a prop on an existing component — say so and don't build a new
   one (a few rows below are already flagged this way).
2. **Build to `ref/HEURISTICS.md`**, the same bar as every existing component: real semantic HTML
   or a Radix primitive underneath, `data-rebar-component`/`data-rebar-part` attributes,
   `--rebar-*` token-only styling, full keyboard operability, tests covering role/name/keyboard/
   attributes. Check the specific heuristics called out per row below — several of the 55 entries
   are exactly what motivated a heuristic in the #31-41 batch (see cross-references).
3. **For a block: build its prerequisite components first**, to the same bar, each shipped and
   tested independently before the block composes them.
4. **Build the block itself**, also to heuristics — same rigor as a component, plus: internal
   parts render in a fixed order (anatomical order, see `/docs` heuristics page), the document
   author never supplies a layout property, only content.
5. **Plumb it into the DSL**: add the shape to the `Block` union in
   `packages/placement/src/schema.ts` (doc comment noting `unmeasured` until benchmarked, matching
   every existing block's own comment), a render case in `BlockRenderer.tsx`, tests covering DOM
   output and order, a row in `packages/placement/README.md`'s block table, and an `Entry` on
   `/blocks`. Components (non-block items) instead need: an export from `packages/core/src/
   index.ts`, a `/components/<slug>` reference page, and entries in `migrationEffort.ts` and
   `generate-props.mjs` — the same checklist every shipped component in this repo already follows.
6. **Update the catalogue and both index pages** once shipped: remove the entry from
   `componentCatalog.{web,mobile,diagrams}.ts` (or move it if a block absorbed multiple catalogue
   entries — several rows below do), which automatically clears its "Planned" tag and
   `/components/planned/<slug>` page; add the real one to `HAS_FULL_PAGE`/`COMPONENT_SECTIONS`.

## Phase A — not a new build at all (extend an existing component) — DONE

Two catalogue entries turned out, on inspection, to be a prop gap on something that already
ships, not a new component.

- **Masked Input** → **shipped.** `Input` (`packages/core/src/components/Input.tsx`) gained a
  `mask` prop (`9`=digit, `a`=letter, `*`=any, everything else a literal, e.g.
  `"(999) 999-9999"`), 4 new tests. An invalid character is skipped, not rejected outright —
  matches real masked-input behavior elsewhere, not a bug.
- **Banner / MessageBar / Inline Message** → **no change needed.** Checked `Alert` directly:
  it already has `title` + `children` (body) and, critically, no dismiss/close affordance —
  exactly the "persistent, not a dismissible toast" shape a Banner needs. The catalogue's own
  "arguably just an Alert variant" note was right; nothing to build.

## Phase B — blocks (composed of existing components, no new primitives needed) — DONE

- **Persona / User Card** → **shipped** as the `persona-card` block (`{ type: "persona-card",
  items: { name, meta?, avatarSrc?, avatarPlaceholder? }[] }`), composing `Avatar` + `Text`. Real
  bug caught building it: `Avatar`'s `fallback` prop is meant to be short initials, not a full
  name — passing the full name duplicated it right next to the visible label (Radix always
  renders `fallback` as real text). Added a small `initials()` helper in `BlockRenderer.tsx`.
- **List / ListItem** → **shipped** as an extension of `data-list`'s existing item shape
  (`meta`, `avatarSrc`, `avatarPlaceholder`, `action` added to `DataListItem`) rather than a new
  block — same `initials()` fix applied here too.
- **Wizard** → **shipped**, but as a real component (`packages/core/src/components/Wizard.tsx`)
  wrapped by a thin `wizard` block, not a block with its own state model — matches how `nav-bar`/
  `nav-index`/`page-index` already wrap real components. Real validation-gating: Next/Submit is
  disabled while the current step's `required` fields are empty (added `required?: boolean` to
  the shared `FormField` type in schema.ts, and a required-indicator asterisk to the static `form`
  block's fields too, closing a real heuristic #26 gap that predated this work). 4 component tests
  + 3 block-level tests, all passing.

## Phase C — components, no dependencies, roughly ascending complexity

Straightforward primitives — build in any order, no cross-dependencies within this phase.

**Web:**
NumberInput, PinInput/OTP Input, SegmentedControl, Editable/Inline Edit, ScrollArea (flagged in
the catalogue as "arguably a styling utility" — check whether `Box` plus a CSS class covers it
before building a new component), ColorPicker, Combobox/Autocomplete (closes the real gap in
heuristic #27 — `Select` has no type-to-filter today, checked against source), MultiSelect (pairs
with heuristic #37, tokenized multi-value input), Cascader, Pagination, TreeView, Drawer/Sheet,
SplitButton, Resizable Panels/Split Pane, FileUpload/Uploader (closes heuristic #38's drag-and-drop
fallback requirement — ship the non-drag `Browse` button as non-optional, not bolted on after),
RichTextEditor (flag as a stretch item — genuinely more complex than everything else on this list;
consider scoping a minimal version first rather than a full editor).

**Mobile:** Action Sheet, Bottom Sheet, Pull-to-Refresh, Picker Wheel, Tab Bar (ties to heuristic
#23, follow platform conventions — bottom on iOS, top on Android, per that heuristic's own
forward-looking guidance), Swipe Actions.

## Phase D — components with a real prerequisite

- **Calendar** (standalone month-grid) → build first.
- **DatePicker** → depends on Calendar (composes it into a popover) + `Input` (already exists) for
  the manual-entry half already covered by `Form`'s `kind: "date"` field per heuristic #27's note —
  decide whether `DatePicker` wraps that existing pattern or is fully separate before starting.
- **TimePicker** → same shape as DatePicker, no calendar dependency, can build in parallel with it.
- **Table/DataTable as a real standalone component** (distinct from the existing lightweight
  `table` block, which stays as-is for simple static grids) → depends on `Pagination` (Phase C) for
  its default pagination behavior and reuses `Checkbox` (already exists) for row selection. See
  heuristic #33 (icon-grid and table views) for the one real behavioral requirement: this should be
  buildable as an alternate view mode alongside a future file/data-browser, not just a bare grid.
  Also see the new heuristic #32/#33 area's "Tables" component-level default note on virtualization
  vs. pagination being distinct problems — this component should support both, not treat one as a
  bigger version of the other.
- **Advanced Data Grid** (catalogue: `data-grid`, under Diagram in the catalogue but really a Web
  concept) → likely superseded by the Table work above once it supports virtualization and
  row-grouping; re-evaluate whether this needs a fully separate component once Table ships, rather
  of committing to build both independently up front.

## Phase E — diagram/chart primitives (separate initiative, lower priority)

The remaining 21 catalogue entries under Diagram (`cartesian-charts`, `pie-chart`, `radar-chart`,
`gauge`, `heatmap`, `treemap`, `sankey-diagram`, `funnel-chart`, `candlestick-chart`, `box-plot`,
`waterfall-chart`, `geo-chart`, `gantt-chart`, `sparkline`, `word-cloud`, `node-link-graph`,
`flowchart`, `org-chart`, `mind-map`, `diagram-minimap`, `pivot-table`) are all genuine rendering
primitives, not compositions of other rebar-ui components — none of these are block candidates.
Each needs real charting/graph-rendering logic (see `/benchmarks`' own hand-authored
`ScatterChart`/`LineChart` SVG helpers for the one piece of prior art in this repo, referenced by
heuristic #16) and represents meaningfully more scope than Phases A-D combined. Treat as a
separate initiative with its own plan once Phases A-D are done, not something to interleave
item-by-item with the rest of this list — the two kinds of work don't share much implementation
surface, and mixing them would make progress on either harder to track.

## Sequencing

A (extend-existing) → B (blocks, no new primitives) → C (standalone components) → D (components
with a real prerequisite, in the dependency order listed) → E (charts/diagrams, own future plan).
Within a phase, order is not significant except where a dependency is called out.
