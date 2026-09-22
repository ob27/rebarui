# Component Backlog

Consolidates four pieces of work requested via `ref/TOM_v1.md`'s prompt queue, done in one pass:

1. A full heuristic design review — every one of the 130 shipped `packages/core` components scored
   1-10 against `ref/HEURISTICS.md`'s 48-item checklist, with specific fixes to reach 10.
2. A duplicate-component audit — checking suspected overlaps for real redundancy vs. legitimate
   distinction.
3. Two other queued bugs, found and fixed while compiling this: theme/dark/bionic preferences not
   surviving a page refresh, and the sidebar's Web/Mobile/Diagram category filter silently losing
   its Mobile/Diagram options.
4. A cross-reference against 14 of the user's own other GitHub repos, surveyed for real UI patterns
   worth adding ahead of eventually rebuilding those apps on rebar-ui.

Methodology for the heuristic review: 11 parallel review passes (~12 components each), each reading
the real component source, its CSS, and its test file against the full heuristics checklist —
not a skim. Scores are a real, critical assessment, not defaulted to 10. A component below 10 always
has at least one concrete, actionable fix listed (not vague advice).

## Already fixed this session

- **Theme/dark/bionic preferences didn't survive a page refresh** — `dark`/`bionic` were hardcoded
  to `false` on every mount with zero persistence; `theme`'s "read the current DOM attribute" trick
  only ever helped across a client-side navigation, never a real hard refresh (fresh HTML carries
  none of these attributes). Fixed in `packages/devtools/src/RebarDevTools.tsx` with real
  `localStorage` persistence for all three, wrapped in try/catch so private-browsing/disabled
  storage degrades to the pre-fix defaults rather than crashing. New regression test in
  `packages/devtools/src/test/RebarDevTools.test.tsx` (unmounts, clears the DOM attributes to
  simulate a real refresh, remounts, confirms all three restore from storage).
- **Sidebar's Web/Mobile/Diagram category filter silently lost Mobile and Diagram** —
  `apps/docs/src/app/components/layout.tsx` hardcoded every shipped component's category to
  `"web"`, a leftover from before real Mobile/Diagram components existed (when those really were
  catalogued-but-unbuilt gaps). Once they shipped, nothing was ever re-tagged, and the catalog
  files (the only other source of those two categories) emptied out too — so the filter still
  existed but had nothing to show for either category. Fixed with a real per-component category map
  (`apps/docs/src/data/shippedCategory.ts`, 6 Mobile + 27 Diagram + 97 Web, sourced from the
  original `componentCatalog.mobile.ts`/`.diagrams.ts` header comments' authoritative lists) fed
  into the sidebar instead of the hardcode. Verified live: the "All categories" filter now shows
  Web/Mobile/Diagram with real, non-empty options.

## Executive summary

- **130 components scored. Average: 7.4/10.**
- **7 components already at 10/10**: ButtonGroup, Collapsible, DiagramMinimap, Empty, Lightbox,
  TabPanel, Toggle.
- **Lowest scores (5/10)**: Badge, Pagination, Switch — each a single, unambiguous, high-confidence
  Framework Rule or touch-target violation (see entries below).
- Every other component clusters 6-9/10 — mostly small, mechanical, low-risk fixes, not deep
  redesigns.

### Cross-cutting patterns (fix once, benefits many components)

These aren't one-off findings — the same root cause repeats across dozens of components. Fixing
the pattern once (a shared CSS rule, a shared guard helper, a shared hook) is higher leverage than
fixing each component individually, and keeps the fix consistent everywhere at once.

1. **Touch targets below the real 44×44px minimum (heuristic #19).** By far the most common finding
   — recurs across at least: Breadcrumb links, Button (`sm` size, 32px), Card's action slot,
   Carousel's dots and `sm`-sized nav buttons, Cascader/Combobox/MultiSelect/Select's shared
   `.rebar-select-trigger` (40px), Checkbox's label, CodeBlock's copy button (`sm`), ColorPicker's
   trigger/swatch/native input, Dialog's close button, Dropdown/ContextMenu/Menubar items,
   Input (`md`/`sm`), Kanban's sort/add buttons, NavBar/NavIndex/SectionNav links, NumberInput's
   steppers, Pagination items, PinInput boxes, Radio's label, Rate's stars, SegmentedControl items,
   SplitButton's menu items, Switch's track, Tab/Tabs/TabList, Tag's close button, Toast's close
   button, Transfer's rows, TreeView/TreeSelect's items and expand toggle. Several of these share
   the exact same underlying CSS rule (`.rebar-select-trigger` alone covers Select, MultiSelect,
   Combobox, Cascader), so fixing shared rules first closes multiple findings at once — see the
   per-component list below for the exact class name in each case.
2. **Charts with no designed empty state.** An empty/all-zero dataset either renders a blank
   canvas with no message, or (worse, in several cases) feeds `Math.min(...[])`/`Math.max(...[])`
   — which evaluate to `Infinity`/`-Infinity` in JS — straight into scale math, producing broken
   `NaN`-based SVG coordinates instead of failing gracefully. Recurs across AreaChart, BarChart,
   BoxPlot, BubbleChart, CandlestickChart, FunnelChart, GanttChart, GeoChart, Heatmap, LineChart,
   PieChart, RadarChart, SankeyDiagram, ScatterChart, Sparkline, Timeline, Treemap, WaterfallChart,
   WordCloud, Flowchart. Worth a small shared guard/helper (`isEmptyChartData(...)` rendering the
   real `Empty` component) applied consistently rather than fixed ad hoc per chart.
3. **Caller-supplied text not wired through `useBionicChildren`.** The ambient bionic-reading
   toggle silently skips text in several components that render real prose: Divider's inline
   label, AccordionItem's trigger/children, ActionSheet's title/action labels/cancel label,
   GaugeChart's title, Image's fallback caption, LineChart/AreaChart/BarChart's chart titles,
   Wizard's `FieldLabel`, and — notably — ThemeToggle's own "Bionic reading" switch label, the one
   string in the entire codebase that's specifically about this feature and yet excluded from it.
4. **Missing `data-*`/`aria-*` rest-spread (a direct Framework Rule violation).** AccordionItem,
   Badge, Dialog, Drawer, Dropdown, PivotTable, Popover, Select, Skeleton, Slider, and
   ToastProvider all have closed prop interfaces or no `{...props}` spread onto their real DOM/Radix
   root, silently dropping any `data-testid`/custom `aria-*` a consumer tries to attach — breaks
   both the stated Framework Rule and Playwright test-ability.
5. **Missing test files.** `Heading.test.tsx`, `Box.test.tsx`, and `Stack.test.tsx` don't exist at
   all, despite every other component in the library having one.

## Duplicate-component audit

Checked every suspected overlap by reading actual source, not just names. Findings:

- **Tooltip vs. HoverCard** — clearly distinct (different delay timing, `role="tooltip"` vs.
  interactive rich content, controlled `open` on HoverCard only). No merge concern.
- **ActionSheet vs. BottomSheet vs. Drawer** — clearly distinct, and already the same kind of
  shared-primitive family as the NodeLinkGraph/diagram components: all three are thin wrappers over
  one internal `DrawerPanel`. Worth documenting explicitly alongside the other "family" components,
  since it wasn't previously called out that way.
- **Popover vs. Popconfirm vs. Dialog** — clearly distinct, three deliberately different weights
  (non-modal anchored panel / lightweight yes-no built on Popover+Button / true modal with focus
  trap). Well justified in code.
- **LineChart vs. AreaChart — real finding, but an implementation-level one, not an API-level
  duplicate.** Both should keep existing as separate, distinctly-purposed exports (filled area vs.
  pure trend line is a standard, legitimate dataviz distinction) — but their SVG rendering (margins,
  scale math, tick generation, default palette) is near-verbatim copy-pasted rather than sharing a
  primitive, and `AreaChart` is missing `LineChart`'s `crossoverIndex`/`dashed`/`yFormat` options
  for no stated reason. Worth extracting a shared internal helper so the two stop silently
  drifting as one gets fixes/features the other doesn't. Medium confidence, real but not urgent.
- **LineChart vs. Sparkline** — clearly distinct (chrome-less inline single-series trend line for a
  table cell/stat card vs. a full multi-series chart with axes/legend), though `Sparkline`
  independently reimplements the same scale-math formula rather than sharing it — same minor
  "duplicated implementation" note as above, not a duplication-of-purpose concern.
- **NavBar vs. NavIndex vs. SectionNav vs. Breadcrumb** — clearly distinct, four genuinely
  different navigation shapes (top-nav-with-overflow / cross-page index-with-filtering /
  in-page-scrollspy / static path trail). `SectionNav`'s own doc comment already calls itself
  "the right-hand counterpart to NavIndex" — intentionally paired, not duplicative.
- **Steps vs. Timeline vs. Wizard** — clearly distinct (stateless progress indicator / chronological
  event log with no progression semantics / a real stateful form controller that explicitly
  composes `Steps` for its own header). Wizard's composition of Steps is a disclosed, deliberate
  choice, not a reimplementation.
- **Card vs. Sticky** — clearly distinct. `Card`'s own doc comment explicitly rejects spinning off
  purpose-specific variants; `Sticky` was deliberately extracted from Kanban's postit rendering
  with a much narrower, different prop set (no header/avatar/cover/actions machinery at all).

**Net result: no genuine duplicate components exist in the library today.** The one actionable
item is the LineChart/AreaChart/Sparkline shared-implementation drift risk, which is a
maintainability note, not a redundancy to remove.

## Per-component heuristic scorecard

Full detail, alphabetical. Each entry is what would need to change to reach 10/10; a component
already at 10/10 says so explicitly rather than being omitted.

### Accordion — 8/10
- No open/close transition on `.rebar-accordion-content`: Radix exposes
  `--radix-accordion-content-height` specifically for animating this, but `style.css` never
  references it, so panels snap open/closed instantly instead of the 200-500ms purposeful
  transition heuristic #21 requires elsewhere (Dialog fades, Dropdown slides): add a `height`
  transition keyed off that custom property.
- `.rebar-accordion-icon { transition: transform 0.15s; }` animates the chevron in 150ms, below the
  200-500ms floor heuristic #21 sets: bump the duration to at least 200ms.

### AccordionItem — 6/10
- `AccordionItemProps` has no rest-spread onto `RadixAccordion.Item` (`{ value, trigger, children,
  disabled }` with no `...rest`), so any `data-*`/`aria-*`/`className` a consumer passes is
  silently dropped, a direct Framework Rule violation: extend
  `ComponentPropsWithoutRef<typeof RadixAccordion.Item>` and spread the remainder onto the root.
- A `disabled` item gets Radix's own `data-disabled` attribute but no matching CSS rule exists
  anywhere in `style.css`, so it renders visually identical to an enabled item, violating
  heuristic #20: add `.rebar-accordion-trigger[data-disabled] { opacity: 0.5; cursor: not-allowed; }`.
- No `bionic`/`bionicOptions` props on `trigger`/`children`, unlike its own documented sibling
  `Collapsible` (which explicitly mirrors `AccordionItem`'s visual language and does wire up
  `useBionicChildren`): add the same props and wrap `trigger`/`children` through `useBionicChildren`.

### ActionSheet — 8/10
- `title`, each `action.label`, and `cancelLabel` are rendered as raw strings, never passed through
  `useBionicChildren`, unlike most other text-bearing components in this library (Alert, Card,
  Tag): add `bionic`/`bionicOptions` props and wrap that text the same way.
- `ActionSheetAction` has no `disabled` field, so an unavailable action can only be omitted
  entirely rather than shown-but-disabled, missing the disabled-state coverage heuristic #20 calls
  for: add an optional `disabled` flag rendered with `aria-disabled` and a muted style.

### Affix — 8/10
- Only `window`'s `resize` event (not a `ResizeObserver` on the content itself) is watched, so if
  the affixed content's own height changes while pinned (an inner accordion expanding, async
  content loading in) without a window resize, the stored placeholder size goes stale and the page
  visibly jumps: attach a `ResizeObserver` to `contentRef`, matching the convention `NavBar`/
  `SectionNav` already use, and re-measure on content resize too.

### Alert — 8/10
- The four `type`s (info/success/warning/error) are distinguished only by background/border/text
  color, with no accompanying icon, so a color-blind user (or anyone scanning quickly) has no
  non-color cue to tell an error banner from a success one at a glance, per heuristic #6
  (recognition over recall): add a small status icon per `type`, paired with the existing text,
  not replacing it.

### AreaChart — 6/10
- `series: []` (or a single-length `xLabels`) produces `Math.min(...[])`/`Math.max(...[])` →
  `Infinity`/`-Infinity`, propagating into `NaN`/`Infinity` SVG coordinates instead of the visible
  placeholder heuristic #16 explicitly requires for absent data: guard `series.length === 0`/
  `xLabels.length < 2` and render the real `Empty` component instead.
- No axis-label/unit slot (only raw numeric y-axis ticks and category x-labels), so a viewer can't
  tell what unit the values are in, which #16 also calls for: add an optional `yAxisLabel`/`unit`
  prop rendered next to the y-axis.
- The `figcaption` title text isn't run through `useBionicChildren`, unlike other prose-rendering
  components (Alert, Card): wrap it the same way.

### AspectRatio — 8/10
- `alt` defaults to `""` whenever `src`/`placeholder` is set without an explicit `alt`, silently
  marking a real content image as decorative to screen readers — this project's own `Image.tsx`
  treats `alt` as required specifically to avoid this "silent accessibility gap": make `alt`
  required here too (or at minimum fire a dev-mode warning when `src` is set without one).

### Avatar — 8/10
- `alt` defaults to `""` (`alt={alt ?? ""}`) when omitted, even though a meaningful `fallback`
  string (initials/name) is always available to use instead, so a real photo gets announced as
  decorative: change the default to `alt ?? fallback`.

### AvatarGroup — 8/10
- The "+N" overflow avatar is static — there's no tooltip/popover exposing which avatars it's
  hiding, so the collapsed set's identity is silently unrecoverable, contrary to heuristic #34's
  "absent state marked explicitly, not omitted": wrap the overflow avatar in a `Tooltip`/`Popover`
  listing the hidden avatars' fallback/names.

### BackTop — 8/10
- The button pops in/out abruptly at the visibility threshold with no transition in
  `.rebar-back-top`, missing the purposeful 200-500ms appearance animation heuristic #21 calls for
  elsewhere (Dialog fades in, Toast slides in): add an opacity/transform transition in that range,
  disabled under `prefers-reduced-motion` like the rest of this component already is for its
  scroll behavior.

### Badge — 5/10
- `BadgeProps` is a closed interface with no `...rest` spread onto the root `<span>`, so a
  consumer can't attach `aria-label`/`data-*` at all — a direct Framework Rule violation, and the
  concrete accessibility consequence is that the `dot` variant (a colored dot with no visible
  text) has no way to get an accessible name: extend `ComponentPropsWithoutRef<"span">` and spread
  the remainder onto the root.
- `tone="default"` has no corresponding `[data-rebar-tone="default"]` CSS rule, so it silently
  renders identical to the red `error` tone (the base `.rebar-badge-indicator` background is
  `--rebar-color-danger`): add a distinct neutral rule, e.g.
  `background: var(--rebar-color-text-secondary)`.

### BarChart — 6/10
- `bars: []` makes `Math.max(...[])` return `-Infinity`, so `yMax`/`bandWidth`/every bar's
  geometry becomes `NaN`/`Infinity` instead of the visible placeholder heuristic #16 requires for
  absent data: guard `bars.length === 0` and render the real `Empty` component instead.
- No axis-label/unit slot on the y-axis despite showing raw numeric ticks, leaving the value's
  unit unstated, which #16 also calls for: add an optional `yAxisLabel`/`unit` prop.
- The `figcaption` title text isn't run through `useBionicChildren`, unlike other prose-rendering
  components (Alert, Card): wrap it the same way.

### Barcode — 9/10
- Empty `value` renders only a bare background rect with no visible placeholder or "no value
  encoded" messaging (heuristic #20/#16 — empty states must be designed, not blank): render a
  visible placeholder (e.g. dashed box + "No value to encode" text) when `value` is empty instead
  of a blank rect.

### BottomSheet — 9/10
- When `title` is omitted the heading falls back to a `rebar-visually-hidden` label, so sighted
  users get no visible title zone at all (heuristic #12 — every panel needs a differentiated
  title/content/actions structure): default to a visible generic heading (e.g. "Options") instead
  of a screen-reader-only one when `title` isn't supplied.

### Box — 8/10
- No `packages/core/src/test/Box.test.tsx` exists at all, so `as`-prop polymorphism, ref
  forwarding, `data-rebar-component` passthrough, and the `bionic`/`CODE_LIKE_TAGS` opt-out logic
  are all unverified: add a `Box.test.tsx` covering polymorphic `as`, ref forwarding, data/aria
  passthrough, and bionic on/off (including the `code`/`pre`/`kbd`/`samp` bionic-disable path).

### BoxPlot — 8/10
- An empty `groups` array drives `Math.min(...[])`/`Math.max(...[])` to `Infinity`/`-Infinity`,
  producing NaN-based SVG coordinates instead of a real empty state (heuristic #20 — empty must be
  designed, not broken/blank): early-return a visible `Empty` placeholder when `groups.length === 0`
  rather than letting the scale math run.

### Breadcrumb — 7/10
- `.rebar-breadcrumb-item a` has no padding or `min-height`, so its hit area is just the text
  glyph size, well under the 44×44 touch minimum (heuristic #19): add
  `min-height: 44px; display: inline-flex; align-items: center;` (or equivalent padding) to
  `.rebar-breadcrumb-item a`.
- No collapsing behavior for a long trail (no "…" truncation of middle items past a threshold),
  unlike the progressive-disclosure convention this library applies elsewhere (heuristic #17): add
  an item-count threshold past which middle items collapse into a single ellipsis/overflow trigger.

### BubbleChart — 9/10
- An empty `series` array renders a bare axis grid with no bubbles and no legend, with no explicit
  "no data" message (heuristic #16/#20 — a chart without data should show a visible placeholder,
  not a blank plot area): render a visible empty-state placeholder inside the `<figure>` when
  `series` (or all its `points`) is empty.

### Button — 8/10
- `.rebar-button[data-rebar-size="sm"]` sets `min-height: 32px`, below the 44×44 touch-target
  minimum this exact component is called out for in `ref/HEURISTICS.md`'s "Component-level
  defaults" (heuristic #19): raise `sm`'s `min-height` to 44px (keep the smaller font/padding,
  just enforce the hit area, the same fix already applied to `Editable`'s trigger).
- The `loading` state renders a static `⏳` emoji glyph instead of the library's own animated SVG
  spinner (`Spin`'s `VectorSpinner`), which is both a one-off visual (heuristic #4 — one consistent
  token/visual set) and a non-animated "loading" cue (heuristic #21 — feedback should be
  perceptible motion, not a static glyph): swap the emoji for `Spin`'s `VectorSpinner` (or an
  equivalent inline animated SVG) sized to the button.

### ButtonGroup — 10/10
- No gaps found against the current heuristics checklist.

### Calendar — 7/10
- `WEEKDAY_LABELS` and `monthLabel`'s `toLocaleDateString("en-US", ...)` are hardcoded to
  English/US formatting with no locale prop or `navigator.language` fallback (heuristic #40 —
  locale-aware formatting, explicitly named as a current, unaddressed gap in `ref/HEURISTICS.md`):
  accept an optional `locale` prop (defaulting to the runtime's own locale) and derive weekday
  labels via `Intl.DateTimeFormat` instead of a hardcoded English array.
- The 42-cell day grid has no arrow-key navigation between cells (only native Tab order through
  all 42 buttons), short of the full keyboard efficiency heuristic #7 calls for on a grid-shaped
  control: add a roving-tabindex day grid where ArrowLeft/Right/Up/Down move focus by 1/7 cells,
  Home/End jump to week start/end.

### CandlestickChart — 7/10
- Candles are colored by up/down with no legend or text anywhere explaining what
  `upColor`/`downColor` mean (heuristic #16 — a chart ships with a legend, not just axis labels):
  add a small legend row (matching `BubbleChart`'s own legend convention) with swatches labeled
  "Up"/"Down".
- An empty `data` array drives `Math.min(...[])`/`Math.max(...[])` to `Infinity`/`-Infinity`,
  producing broken NaN-based axis geometry instead of a designed empty state (heuristic #20):
  early-return a visible `Empty` placeholder when `data.length === 0`.

### Card — 9/10
- `.rebar-card-action` has no `min-height`/centering enforcement, so an `actions` entry that isn't
  a real `Button` (a bare link or icon) can render under the 44×44 touch minimum (heuristic #19):
  add `min-height: 44px; display: flex; align-items: center; justify-content: center;` to
  `.rebar-card-action`.

### Carousel — 6/10
- `.rebar-carousel-dot` is only 8×8px with `padding: 0`, far under the 44×44 touch-target minimum
  on a component whose whole purpose is touch-reachable slide browsing (heuristic #19): keep the
  visible 8px dot but wrap it in a `min-width: 44px; min-height: 44px` hit area (padding/negative-
  margin trick), the same touch-target-vs-visual-size split `Button`/`Calendar` already use.
- The prev/next controls render via `<Button size="sm">`, which is only 32px tall (see `Button`'s
  own gap above), so both carousel nav buttons also miss the touch minimum: use the default `md`
  `Button` size (or a dedicated carousel-control CSS override) for the prev/next controls instead
  of `size="sm"`.

### Cascader — 7/10
- Touch targets: every level renders a real `Select`, and `.rebar-select-trigger` is
  `min-height: 40px` (below the 44×44px minimum from ref/HEURISTICS.md #19) — bump it to 44px so
  Cascader's per-level dropdowns clear the touch-target bar on every level, not just some.
- Responsive layout: `.rebar-cascader` is `display: inline-flex` with no `flex-wrap`, so a
  multi-level path (province → city → district) can overflow horizontally on a narrow/touch
  viewport — add `flex-wrap: wrap` (with a matching row-gap) so deeper paths wrap instead of
  overflowing.

### Checkbox — 6/10
- Touch target: the visible checkbox box is a fixed 20×20px (`.rebar-checkbox`) with no padding,
  and `.rebar-checkbox-label` has no min-height, so a `Checkbox` rendered with no (or very short)
  text label has a real hit area well under the 44×44px minimum from #19 — add
  `min-height: 44px`/padding to `.rebar-checkbox-label` (or pad `.rebar-checkbox` itself), the same
  fix already applied to `Editable`/`DatePicker`/`TimePicker`'s triggers elsewhere in this codebase.

### CodeBlock — 8/10
- Touch target: the Copy button uses `size="sm"`, and `.rebar-button[data-rebar-size="sm"]` is
  `min-height: 32px` — below the 44px minimum from #19 for the one interactive control this
  component has — switch it to the default (44px) `Button` size or add explicit padding so it
  clears the touch-target bar.

### Collapsible — 10/10
- No gaps found against the current heuristics checklist.

### ColorPicker — 6/10
- Touch targets: `.rebar-color-picker-trigger` (32×32px), `.rebar-color-picker-swatch` (28×28px),
  and `.rebar-color-picker-native` (min-height 32px) are all below the 44×44px minimum from #19 —
  bump all three to at least 44px so the trigger, every preset swatch, and the native color input
  clear the touch-target bar.

### Combobox — 7/10
- Touch targets: the single-select input (`.rebar-input`, min-height 40px), the multi-select chip
  field (`.rebar-combobox-chips`, min-height 40px), and each dropdown row
  (`.rebar-combobox-option`, ~37px effective height) all fall short of the 44px minimum that
  `.rebar-command-palette-item` already applies to its own list rows — bump these three rules to
  `min-height: 44px` to match.
- Chip removal: multi-select chips use `Tag`'s `closable` "×", and `.rebar-tag-close` has no
  padding/min dimensions at all — the token-removal target (heuristic #37's own chip pattern) is
  effectively unreachable by touch; give `.rebar-tag-close` a real 44×44px hit area.

### CommandPalette — 8/10
- User control and freedom (#3): the palette has Esc and backdrop-click but no visible close
  button at all (deliberately, to avoid `Dialog`'s header chrome) — add a small, unobtrusive
  dismiss ("×") affordance in a corner so the close mechanism isn't entirely hidden from a user who
  doesn't know the Esc convention, without reintroducing the title/header bar.

### ContextMenu — 8/10
- Keyboard operability (#7): the menu opens only via `onContextMenu` (right-click) or long-press,
  and the wrapper `<div>` carries no default `tabIndex`, so if the wrapped surface isn't
  independently focusable, a keyboard-only user has no way to reach the standard Shift+F10/Menu-key
  context-menu trigger at all — default the wrapper to `tabIndex={0}` (or clearly document that the
  wrapped child must be focusable) so this path isn't silently mouse/touch-only.

### DataGrid — 8/10
- Accessible naming (#34/consistency): when `groupBy` is set, `caption` is rendered once as a
  plain div outside the `Accordion`, but is never forwarded into each nested `Table` via
  `nestedTableProps` — every per-group `<table>` ends up with no accessible name/caption
  association at all for screen-reader users — thread an `aria-label`/`aria-labelledby`
  (referencing each group's own header id) into each nested `Table` instead.

### DatePicker — 7/10
- Multiple input methods (#27): the trigger is a plain button, not an editable field, so there is
  no way to type a date directly — a keyboard/power user must browse the entire calendar grid
  day-by-day via the popover, exactly the "browsing-only, no typed alternative" gap this heuristic
  calls out for `Select` — add an optional editable-text entry mode (validated against
  `minDate`/`maxDate`) alongside the calendar popover.

### Descriptions — 8/10
- Whitespace/responsiveness (#24): `.rebar-descriptions-grid` sets a fixed
  `grid-template-columns: repeat(column, 1fr)` inline with no responsive breakpoint, so a 3+ column
  layout (the default) stays cramped and hard to scan on a narrow/mobile viewport — add a media
  query collapsing to a single column under `--rebar-breakpoint-sm`.

### DiagramMinimap — 10/10
- No gaps found against the current heuristics checklist.

### Dialog — 7/10
- Close button touch target: `.rebar-dialog-close` has no min-width/min-height, so the 20px icon
  plus 4px padding renders a ~28×28px hit area, well under heuristic #19's 44×44px minimum — copy
  the fix already applied to `.rebar-drawer-close` (`min-width: 44px; min-height: 44px;`) in
  `style.css`.
- No `data-*`/`aria-*` passthrough: `DialogProps` doesn't extend `ComponentPropsWithoutRef` and
  `RadixDialog.Content` has no `{...props}` rest-spread, so a consumer can't attach
  `data-testid`/custom `aria-*` to the dialog root, undermining the Playwright/screen-reader-
  navigable guarantee heuristic #7 depends on — add `extends ComponentPropsWithoutRef<"div">` and
  spread `...props` onto `RadixDialog.Content`.

### Divider — 9/10
- Missing bionic-reading support: every other text-bearing component in the catalog (`Tag`,
  `Statistic`, `Alert`, etc.) exposes `bionic`/`bionicOptions` for caller-supplied text, but
  `Divider`'s `children` (the inline label, e.g. "Or continue with email") has no such prop — add
  `bionic`/`bionicOptions` and route `children` through `useBionicChildren` in the
  `rebar-divider-with-text` branch, matching `Tag`'s pattern.

### Drawer — 8/10
- No bionic-reading support for `title`/`description`: unlike `Dialog` (its own sibling, built on
  the same Radix wiring), `DrawerProps` has no `bionic`/`bionicOptions` prop, so a drawer's
  title/description text can't opt into the ambient bionic-reading feature — add the same
  `bionic`/`bionicOptions` props and `useBionicChildren` calls Dialog.tsx already uses for its
  title/description.
- No `data-*`/`aria-*` passthrough: `DrawerProps` doesn't extend `ComponentPropsWithoutRef` and
  there's no rest-spread onto `RadixDialog.Content` in `DrawerPanel`, so custom
  `data-testid`/`aria-*` attributes are silently dropped — add `extends ComponentPropsWithoutRef
  <"div">` and spread `...props` onto the Content element.

### Dropdown — 6/10
- Menu item touch target: `.rebar-dropdown-item` (14px font + 8px/12px padding) renders roughly
  30-37px tall, below heuristic #19's 44×44px minimum for any interactive element reachable on
  touch — add `min-height: 44px` (with `display: flex; align-items: center`) to
  `.rebar-dropdown-item` in `style.css`.
- Closed prop interface: `DropdownProps` has only `trigger`/`items`, no `className` and no
  rest-spread of `data-*`/`aria-*` onto `RadixDropdownMenu.Content`, violating the Framework Rule
  that every component forwards arbitrary `data-*`/`aria-*` props and blocking test-id-based
  Playwright selectors — extend `ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>` and
  spread `...props`.

### Editable — 9/10
- Disabled state has no explanation: heuristic #20 requires a disabled state to be "visually
  distinct, with a tooltip explaining why," but `Editable`'s `<button disabled>` only gets
  `opacity: 0.6` with no `title`/tooltip — accept an optional `disabledReason` prop and render it
  as the button's `title` attribute when `disabled` is true.

### Empty — 10/10
- No gaps found against the current heuristics checklist.

### FileUpload — 8/10
- Constraints aren't shown upfront: heuristic #26 requires format/size requirements to be visible
  before input, not only after rejection, but `FileUpload` never renders the `accept` filter or
  `maxSizeBytes` limit anywhere in the dropzone — add a hint line (e.g. "Accepts {accept}, up to
  {formatBytes(maxSizeBytes)}") next to the existing `rebar-file-upload-hint` text, shown whenever
  those props are set.

### Flowchart — 8/10
- Blank canvas on empty data: heuristic #16 requires "a visible placeholder when data is absent,
  never a blank area," but an empty `steps` array renders `NodeLinkGraph` with zero nodes/edges —
  no `Empty` fallback anywhere — render the real `Empty` component in place of the chart when
  `steps.length === 0`.

### Form — 6/10
- Validation only fires on submit: heuristic #5/#26 require "inline validation on blur rather than
  every keystroke" / "not on submit," but `useForm<TFieldValues>({ defaultValues })` in `Form.tsx`
  passes no `mode`, so react-hook-form defaults to `onSubmit` — pass `mode: "onBlur"` (or
  `"onTouched"`) to `useForm`.
- No way to show constraints proactively: `FormItemProps` has no `description`/`helperText` slot,
  so a field's format/range rules (heuristic #26) can only ever appear as a post-failure error,
  never up front — add an optional `description?: ReactNode` prop rendered between the label and
  `children(field)`.

### FormItem — 7/10
- No helper-text slot: `FormItemProps` (`name`, `label`, `required`, `rules`, `children`) has no
  `description`/`helperText` field, so constraints like format or valid range can't be surfaced
  before the user ever focuses the input, per heuristic #26 — add an optional
  `description?: ReactNode` rendered under the label.
- Errors surface only on submit, not on blur: because `Form`'s `useForm` call has no `mode` set,
  `FormItem`'s `errors[name]` (and its `role="alert"` text) never appears until the whole form is
  submitted, contradicting heuristic #5's "inline validation on blur" — fix at the `Form` level by
  setting `mode: "onBlur"` in `useForm`.

### FunnelChart — 7/10
- Hardcoded raw pixel font sizes: the stage label/value `<text>` elements use `fontSize={12}`
  (lines 96 and 103 in `FunnelChart.tsx`) instead of a `--rebar-font-size-*` token, violating the
  "theming is CSS custom properties only" rule and heuristic #4's one-type-scale consistency
  (`Flowchart`'s own `renderNode` already does this correctly with
  `fontSize="var(--rebar-font-size-sm, 12px)"`) — replace both with
  `fontSize="var(--rebar-font-size-xs, 12px)"`.
- Blank chart on empty data: an empty `stages` array renders an SVG with no shapes and no message,
  contradicting heuristic #16's "never a blank area" — render the real `Empty` component when
  `stages.length === 0`.

### GanttChart — 7/10
- Hardcoded raw pixel font sizes: the axis tick label (`fontSize={11}`, line 118) and row label
  (`fontSize={12}`, line 144) in `GanttChart.tsx` use raw numbers instead of `--rebar-font-size-*`
  tokens, the same Framework Rule/consistency violation as `FunnelChart` — replace with
  `fontSize="var(--rebar-font-size-xs, 12px)"`.
- Blank chart on empty data: an empty `tasks` array renders only axis ticks with no bars and no
  message, contradicting heuristic #16's "never a blank area" requirement for charts — render the
  real `Empty` component when `tasks.length === 0`.

### GaugeChart — 8/10
- Accessible name gap: when `title`/`label` are both omitted, `aria-label` falls back to the
  generic string `"Gauge chart"` with no indication of the actual value — add the formatted value
  to the default fallback (e.g. `` `Gauge chart: ${valueFormat(value)}` ``) so a screen-reader user
  gets the same information a sighted user reads off the dial.
- Bionic-reading gap: the `<figcaption data-rebar-part="title">` renders caller-supplied `title`
  text directly, unlike `Statistic`'s analogous `title`, which runs through `useBionicChildren` —
  wrap `title` the same way for consistency with the rest of the library.

### GeoChart — 7/10
- No empty-state placeholder: with `regions={[]}` the component renders a near-blank tiny `<svg>`
  (padding + one empty cell) instead of a visible placeholder, violating HEURISTICS #16 ("render a
  visible placeholder when data is absent, never a blank area") — render the real `Empty`
  component when `regions.length === 0`.
- No color-scale legend, and per-cell numeric value is exposed only via a native SVG `<title>`
  tooltip (mouse-hover only, unreachable by touch or keyboard) — add a visible min/max legend
  swatch (as `GaugeChart` already does with its min/max labels) and print the value as visible
  text, not just tooltip-only.

### Heading — 7/10
- No test file exists at all (`packages/core/src/test/Heading.test.tsx` is missing), violating
  this project's own component checklist ("a matching test file in `packages/core/src/test/`") —
  add a test covering level rendering (`h1`/`h2`/`h3`), ref forwarding, the `bionic` override, and
  `data-*`/`aria-*` passthrough.

### Heatmap — 7/10
- No empty-state placeholder: `data={[]}` (with no explicit `rows`/`cols`) renders a nearly blank
  96×28 svg instead of a visible placeholder, violating HEURISTICS #16 — render `Empty` when
  `data.length === 0`.
- Per-cell value is exposed only via a native SVG `<title>` tooltip (mouse-hover only) and there's
  no visible color-scale legend explaining what light vs. dark represents — add a min→max legend
  swatch and consider printing the value as SVG text when `cellSize` is large enough.

### HoverCard — 7/10
- Hover-only trigger has no documented or tested touch equivalent — a tap on a touchscreen doesn't
  reliably produce Radix's hover state, so the "supplementary preview" content can become
  effectively unreachable on touch, and no test in `HoverCard.test.tsx` exercises touch/tap — add a
  touch-detected tap-to-toggle fallback (or document a required focusable-trigger pattern), per the
  touch-optimization gate in `robot.md` checklist item 5(b).
- `.rebar-hover-card-content` sets `max-width: 280px` but no `max-height`/`overflow` handling, so
  unusually long content can overflow uncontained rather than scrolling within the card — add
  `max-height` plus `overflow-y: auto` to the CSS rule.

### Iframe — 8/10
- No loading or error state is designed: the embed is a bare `<iframe>` with no default
  border/height and no visual feedback while loading or if the embed is blocked (e.g. by
  `X-Frame-Options`), leaving a blank box, which violates HEURISTICS #20 — wrap it in a `Skeleton`
  shown until the iframe's own `onLoad` fires, and surface a fallback message on a load timeout
  since iframes don't reliably emit an `error` event for blocked embeds.

### Image — 9/10
- The visible fallback caption (`.rebar-image-fallback-text`, which renders the caller-supplied
  `alt` text on error) is real caller-facing prose but bypasses bionic reading, unlike
  `Text`/`Card`/`Alert`/`Statistic` — route it through `useBionicChildren` for consistency with the
  rest of the library.

### Input — 6/10
- Default (`md`, 40px) and `sm` (32px) `.rebar-input` heights fall below the 44×44px touch-target
  minimum HEURISTICS #19 requires; only `lg` (48px) clears it — bump `.rebar-input`'s base
  `min-height` to 44px and raise `sm`'s to at least 44px, the same fix already applied to
  `Editable`'s trigger elsewhere in this library.
- HEURISTICS #26's own component rule ("`Input`'s native `maxLength`/`min`/`max`/`pattern`
  constraints display as helper text") isn't implemented in `Input.tsx` at all — there is no
  helper-text rendering for these constraints — add a `data-rebar-part="hint"` element under the
  input that summarizes any passed `maxLength`/`pattern`/`min`/`max` unless explicitly suppressed.

### Kanban — 6/10
- `.rebar-kanban-sort-button` and `.rebar-kanban-add-button` have no `min-height`/`min-width` and
  only a few px of padding around small text, leaving an effective hit area well under 44×44px —
  violates HEURISTICS #19 — add `min-height: 44px; min-width: 44px;` (or equivalent padding) to
  both rules.
- Drag-and-drop card/column reordering has no keyboard-operable equivalent at all (mouse/touch
  drag only), violating HEURISTICS #38's "never drag-only" rule and #7 (full keyboard operability)
  — add a per-card overflow action (or arrow-key handling while a card is focused) offering "Move
  to [column/section]" as the required non-drag fallback.

### Lightbox — 10/10
- No gaps found against the current heuristics checklist.

### LineChart — 7/10
- With `series={[]}` (or all-empty `values`), `Math.min(...[])`/`Math.max(...[])` evaluate to
  `Infinity`/`-Infinity`, producing broken/NaN SVG coordinates rather than a graceful empty state
  — worse than the blank-area failure HEURISTICS #16 already warns against — add an early
  `Empty`-component render when `series.length === 0` or every series' `values` is empty.
- The `<figcaption data-rebar-part="title">` renders caller-supplied `title` text without
  bionic-reading integration, unlike `Statistic`'s analogous `title` — route it through
  `useBionicChildren` for consistency.
- (See the Duplicate-component audit above: shares near-verbatim scale-math/margin/tick-generation
  implementation with `AreaChart` and `Sparkline` — worth extracting a shared internal helper.)

### Masonry — 8/10
- `columns` is a fixed number with no built-in responsive breakpoint behavior — on a
  narrow/mobile viewport the same column count persists (e.g. 3 cramped columns on a phone width),
  working against HEURISTICS #24 (whitespace as an active design element) — add a default CSS rule
  keyed to `--rebar-breakpoint-sm`/`-md` that reduces `column-count` on narrow viewports instead of
  requiring every caller to hand-roll a responsive `columns` value.

### Mentions — 8/10
- No collision-aware positioning: the suggestion `<ul>` is a plain absolutely-positioned element
  fixed below the textarea (not built on `Popover`/Radix), so unlike every other dropdown in the
  library it can render off-screen near a viewport edge — wire it through the real `Popover`
  primitive for heuristic #18 compliance.
- No empty/no-match state: `open` becomes `false` the instant `filtered.length === 0`, so the
  dropdown just silently vanishes with no "No matches" message — render a disabled placeholder
  `<li>` instead of hiding the list per heuristic #20.

### Menubar — 9/10
- Missing the "opens further input" convention: `MenubarItem` has a `danger` flag but no
  `opensDialog`/ellipsis marker, so an item that opens a secondary dialog (e.g. "Preferences…")
  looks identical to one that runs immediately — add an `opensDialog?: boolean` prop that appends
  "…" to the rendered label per heuristic #36.

### MindMap — 8/10
- Long labels overflow their node box: the inherited default `renderNode` draws `<text>` with no
  width constraint, so a topic/branch/child label longer than the fixed 120×44 node box will
  visually collide with neighboring nodes — truncate or wrap the label (e.g. `textLength`/tspans)
  in `NodeLinkGraph`'s default renderer.
- No keyboard way to pan the canvas: only pointer-drag repositions the viewport (zoom has a button
  fallback, pan does not), so a keyboard-only user can't reach nodes that fall outside the initial
  view on a wide branch layout — add arrow-key panning to the shared `NodeLinkGraph` canvas.

### MobileTabBar — 8/10
- No overflow safeguard: unlike `NavBar`'s measured "More" collapse, `MobileTabBar` has no cap or
  overflow mechanism, so enough items on a narrow phone screen let each `flex: 1` item's width
  shrink below the 44px minimum with no warning — add a measured overflow-to-"More" affordance or a
  dev-mode warning past ~5 items.
- No `disabled` state on an item: `MobileTabBarItem` has no `disabled` field, so an unavailable
  destination can't be shown visually distinct per heuristic #20 — add a `disabled?: boolean` field
  that renders a non-interactive, visually muted item.

### MultiSelect — 7/10
- Touch target too small: the trigger inherits `.rebar-select-trigger`'s `min-height: 40px`, short
  of the 44×44 CSS px minimum ref/HEURISTICS.md #19 requires — add `min-height: 44px` to
  `.rebar-multi-select-trigger` in `style.css`.
- No empty state: an empty `options` array renders a blank popover with nothing in it — add a "No
  options" placeholder item per heuristic #20.

### NavBar — 6/10
- No current-page indicator: `NavBarItem` has no `active`/`current` field and the rendered `<a>`
  never receives `aria-current="page"`, so a visitor on `/docs` sees `NavBar` treat every item
  identically — violates heuristic #1's "user never has to guess what's... current" — add an
  `activeHref` (or `isActive(item)`) prop and apply `aria-current="page"` plus a `-active` class to
  the matching link.
- Touch targets too small: `.rebar-navbar-link`, `.rebar-navbar-more`, and
  `.rebar-navbar-overflow-link` carry zero padding or `min-height` in `style.css`, so real nav links
  fall well short of the 44×44 CSS px minimum (#19) — add `padding`/`min-height: 44px` with
  vertical centering to all three classes.

### NavIndex — 7/10
- No current-page indicator: like `NavBar`, `NavIndexItem` has no `active`/`current` field, so a
  reader viewing `/components/avatar` gets no highlight in its own sidebar index — add an
  `activeHref` prop and render `aria-current="page"` plus a distinct class on the matching item.
- Touch target too small: `.rebar-nav-index-link` has no padding or `min-height` declared anywhere
  in `style.css`, falling short of the 44×44 CSS px minimum (#19) — add vertical padding or
  `min-height: 44px` to that class.

### NodeLinkGraph — 6/10
- No keyboard-operable panning: only pointer-drag moves the canvas — zoom has a real `+`/`-`
  button fallback per heuristic #38, but pan has no keyboard equivalent at all, so a keyboard-only
  user can't reach nodes outside the initial viewport — add arrow-key panning on the focused SVG.
- No textual/accessible alternative to the graph: the SVG is `role="img"` with one blanket
  `aria-label` for the whole diagram, so a screen-reader user gets zero information about
  individual nodes, edges, or structure — provide a visually-hidden textual summary (or accessible
  table) of nodes/edges alongside the SVG.
- Default node text has no overflow handling: `renderNode`'s fallback `<text>` isn't clipped or
  wrapped to `NODE_WIDTH` (120px), so any label longer than that visually collides with the node's
  own border and neighboring nodes — truncate/wrap the label to fit before rendering.

### NumberInput — 6/10
- Touch targets too small: `.rebar-number-input-step` is `min-width/min-height: 32px`, well under
  the 44×44 CSS px minimum ref/HEURISTICS.md #19 requires (already fixed correctly elsewhere, e.g.
  `PickerWheel`'s 44px rows) — bump both to 44px.
- Constraints aren't visible: `min`/`max` are enforced only by silent clamping and disabling the
  stepper at the boundary, with no helper text stating the valid range up front, which heuristic
  #26 explicitly requires — render a small "Between {min} and {max}" helper text under the field
  when either bound is set.

### OrgChart — 7/10
- Inherited keyboard-pan gap: same as `NodeLinkGraph`, a wide/deep org chart that exceeds the
  viewport can only be panned by mouse/touch drag, with no keyboard equivalent — add arrow-key
  panning to the shared `NodeLinkGraph` canvas this component composes.
- Long name/role text overflows its box: the custom `renderNode` draws two fixed-position `<text>`
  lines with no width constraint, so a long name or job title visually overflows the 120×44 node
  rect — truncate each line to fit `NODE_WIDTH` before rendering.

### Pagination — 5/10
- Breaks the controlled/uncontrolled Framework Rule: `current` is a required prop with no
  `defaultCurrent`/internal `useState` fallback, so `Pagination` only works fully controlled,
  unlike every other stateful component in this library (`NumberInput`, `MultiSelect`,
  `PickerWheel`, etc.) — add `defaultCurrent` plus the standard
  `isControlled = current !== undefined` internal-state pattern.
- Touch targets too small: `.rebar-pagination-item` is `min-width/min-height: 32px`, short of the
  44×44 CSS px minimum heuristic #19 requires — bump both to 44px.

### PickerWheel — 8/10
- Missing `aria-activedescendant`: the `role="listbox"` track has no `aria-activedescendant` and
  its options carry no `id`, so a screen-reader user pressing Arrow/Home/End gets no reliable
  announcement of the newly-selected option (unlike `Mentions`' own listbox, which wires this
  correctly) — give each option an `id` and set `aria-activedescendant` to the selected option's id.
- No empty state: an empty `options` array renders a blank wheel with no placeholder message —
  show a disabled placeholder row instead per heuristic #20.

### PieChart — 8/10
- Empty-data placeholder: when `slices` is empty (or all values are 0), no path or legend items
  render and no visible message appears, violating HEURISTICS.md #16/#20 ("render a visible
  placeholder when data is absent, never a blank area"); add a fallback `<Empty>`-style message
  inside the `<figure>` when `total === 0`.
- No dedicated `.rebar-pie-chart` CSS block in style.css (all styling is inline `style={}`), which
  makes it harder for a consumer to theme/override via the stated CSS-custom-properties-only
  mechanism the way other components' dedicated classes allow; move the inline styles into
  `.rebar-pie-chart`/`.rebar-pie-chart-legend` rules in style.css.

### PinInput — 8/10
- Touch target: `.rebar-pin-input-box` is `width: 40px; min-height: 40px`, below the 44×44px
  minimum required by HEURISTICS.md #19 and robot.md's touch-optimization gate; bump to
  `min-width: 44px; min-height: 44px` (and adjust `gap` so the group doesn't get too wide).

### PivotTable — 7/10
- Empty-state: `tableData` always appends a synthesized `totalsRow` even when `data` is `[]`, so
  `Table`'s own empty/`Empty` state (triggered only at `data.length === 0`) can never fire — a
  caller sees a fabricated "Total | 0" row instead of an honest empty state; skip the totals row
  (or pass an explicit `emptyMessage`) when `data.length === 0`.
- Closed prop interface: `PivotTableProps` has no rest-spread, so arbitrary `data-*`/non-listed
  `aria-*` attributes are silently dropped on the root `div`, unlike sibling chart/table
  components; extend the props with `ComponentPropsWithoutRef<"div">` and spread the rest onto the
  wrapper.

### Popconfirm — 8/10
- Default `confirmLabel`/`cancelLabel` are the generic "Yes"/"No" rather than the specific action
  verb HEURISTICS.md #3 requires ("the confirming button names the action itself ('Delete,' not
  'OK')"); since callers can easily leave these at their defaults, add a dev-mode warning when
  `destructive` is true and `confirmLabel` is still "Yes", nudging the caller to pass the real
  verb.

### Popover — 7/10
- `PopoverProps` has no rest-spread onto `RadixPopover.Content` (no `className`, no `data-*`/extra
  `aria-*`), breaking the Framework Rule that every component forwards arbitrary `data-*`/`aria-*`
  props and making it untestable/unthemeable the way other composed components are; add
  `...ComponentPropsWithoutRef<typeof RadixPopover.Content>` and spread `...props` onto `Content`.
- No enter/exit transition on `.rebar-popover-content` (instant show/hide, no fade or slide),
  unlike the "Dropdown slides down" default HEURISTICS.md #21 calls for; add a short (200-500ms)
  fade/slide keyframe keyed off Radix's `data-state`, gated by `prefers-reduced-motion`.

### Progress — 6/10
- The component renders only the bar — there is no visible percentage or fraction text anywhere in
  the DOM, directly contradicting HEURISTICS.md #1's own named component rule for this exact
  component ("`Progress` shows percentage or fraction"); add an optional `showValue`/`label` slot
  (default on) that renders the computed percent as real visible text, not just `aria-valuenow`.

### PullToRefresh — 9/10
- Gesture-triggered refreshing/completion is communicated only visually (spinner, arrow rotation)
  and via the button's `aria-label`, which a screen-reader user only hears if they happen to focus
  that button; add an `aria-live="polite"` status region announcing "Refreshing…"/"Refresh
  complete" so heuristic #1 (visibility of system status) holds for non-visual users triggering
  the gesture, not just the fallback button.

### QRCode — 8/10
- Unlike its sibling `Barcode` (which has `showText` to print the encoded value beneath the bars),
  `QRCode` has no visible caption of what it encodes — only an `aria-label` a sighted user never
  sees, leaving no visible context per heuristic #13 (icons/graphics need a visible label, not just
  an accessible name); add an optional `showText`/`caption` prop rendering the encoded `value` (or
  a custom label) beneath the code.

### RadarChart — 8/10
- Empty-data placeholder: when `series` is `[]` (or every value is 0), only empty grid rings/axis
  lines render with no legend and no message, violating HEURISTICS.md #16/#20's "never a blank
  area" rule; render a visible "No data" placeholder when `series.length === 0`.

### Radio — 7/10
- Touch target: `.rebar-radio` is 20×20px and `.rebar-radio-label` adds no `min-height`/padding, so
  the actual clickable region (dot plus label text) falls well short of the 44×44px minimum in
  HEURISTICS.md #19; give `.rebar-radio-label` `min-height: 44px` and vertical padding (matching
  the fix already applied to `Editable`'s trigger) while keeping the visible 20px dot centered
  inside it.

### RadioGroup — 8/10
- `.rebar-radio-group` hardcodes `flex-direction: column` with no `[data-orientation="horizontal"]`
  rule, so passing Radix's own `orientation="horizontal"` prop changes the left/right arrow-key
  model without changing the visual stacked layout, breaking the natural spatial mapping heuristic
  #22 calls for; add `.rebar-radio-group[data-orientation="horizontal"] { flex-direction: row; }`.

### Rate — 6/10
- Touch target: `.rebar-rate-star` has `padding: 0` and only `font-size: 24px` sizing it, giving
  roughly a 24×24px hit area, well under the 44×44px minimum (HEURISTICS.md #19); add
  `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center;
  justify-content: center;`.
- Disabled state is visually indistinguishable from enabled except for `cursor: not-allowed`
  (invisible on touch and easy to miss on mouse), failing heuristic #20's requirement that
  disabled states be "visually distinct, with a tooltip explaining why"; add reduced
  opacity/grayscale to `.rebar-rate-disabled .rebar-rate-star` and a `title` attribute explaining
  why it's disabled.

### ResizablePanels — 9/10
- The `role="separator"` divider has no `aria-label`/`aria-valuetext`, so screen-reader users hear
  "separator, 50%" with no indication of what it's resizing: add an `aria-label` prop (e.g.
  "Resize panels") threaded onto the divider.

### Result — 7/10
- `ResultProps` doesn't extend `ComponentPropsWithoutRef<"div">` and the root `<div>` has no
  `{...props}` rest-spread, so arbitrary `data-*`/`aria-*` (including `data-testid`) are silently
  dropped, violating the framework's passthrough contract: add
  `extends ComponentPropsWithoutRef<"div">` and spread `...props` onto the root.
- A `Result` shown after an async outcome (payment success/failure, etc.) has no
  `role="status"`/`aria-live` region, so screen-reader users aren't notified when it appears: add
  `role="status"` (or `role="alert"` for `status="error"`) to the root.

### RichTextEditor — 8/10
- The Bold/Italic/Underline toolbar buttons never reflect whether that formatting is actually
  active at the current selection (no `aria-pressed`/active visual state), violating heuristic
  #1's persistent-state requirement: call `document.queryCommandState(command)` on selection change
  and toggle `aria-pressed`/a `data-rebar-active` class on the matching button.

### SankeyDiagram — 7/10
- Node/link `value`s are only encoded as visual stroke width with no numeric label, tooltip, or
  legend anywhere (sighted or not), so nobody can read the actual flow amounts: add a native SVG
  `<title>` per `<rect>`/`<path>` with the node/link's real value.
- An empty `nodes`/`links` array renders a blank `<svg>` instead of a designed empty state: render
  the shared `Empty` component when `nodes.length === 0`, per heuristic #16/#20.

### ScatterChart — 8/10
- An empty `series` array (or a series with an empty `values` array) drives `Math.min(...[])`/
  `Math.max(...[])` to `Infinity`/`-Infinity`, producing `NaN`/broken SVG coordinates instead of a
  designed empty state: guard for `series.length === 0` and render the shared `Empty` component
  per heuristic #20.
- The dashed line's meaning (series mean) is never explained in any visible legend or accessible
  text, only implied by convention: add a one-line legend/caption clarifying "dashed line = mean"
  per heuristic #16.

### ScrollArea — 8/10
- This is exactly the "fixed-height scrollable region" HEURISTICS.md #43 calls out as still
  missing the mist treatment: add a top/bottom fade-to-transparent mist toggled from real scroll
  position, matching `SectionNav`'s existing implementation.

### SectionNav — 7/10
- `.rebar-section-nav-link` has no `min-height`/padding, so each nav link's touch target is only
  its text line height, far under the 44×44px minimum from heuristic #19: give
  `.rebar-section-nav-link` a `min-height: 44px` with `display: flex; align-items: center`.
- The active link is marked only via a CSS class and a `data-rebar-active` attribute, neither of
  which assistive tech announces: add `aria-current="location"` to the active `<a>`.

### SegmentedControl — 6/10
- `.rebar-segmented-control-item` has `min-height: 32px`, well under the 44×44px touch-target
  minimum heuristic #19 (and robot.md's touch-optimization gate) require: bump it to
  `min-height: 44px` and adjust internal padding to keep the visual pill height unchanged.

### Select — 6/10
- `.rebar-select-trigger` has `min-height: 40px`, under the 44px touch-target minimum: raise it to
  `min-height: 44px`.
- `SelectProps` is a closed interface (no `extends ComponentPropsWithoutRef<"button">`), so only
  the explicitly-listed `aria-label` passes through and every other `data-*`/`aria-*` prop is
  silently dropped: widen the prop type and spread `...props` onto `RadixSelect.Trigger`.

### Skeleton — 6/10
- The entire loading indicator is `aria-hidden="true"` with no text alternative, so screen-reader
  users get total silence during a load instead of an equivalent "Loading" announcement: wrap it
  in (or accept) a visually-hidden `role="status"` text node alongside the hidden shapes.
- `SkeletonProps` is a closed interface with no `ComponentPropsWithoutRef` extension or
  rest-spread, blocking `data-*`/`aria-*` passthrough (e.g. `data-testid`): widen the type and
  spread `...props` onto the root.

### Slider — 6/10
- The thumb's real hit area is only 16×16px (`.rebar-slider-thumb`) with no invisible padding to
  reach 44×44px, far under heuristic #19's minimum: add a transparent, padded hit-area (e.g. a
  `::before` sized 44×44px centered on the thumb) without growing the visible 16px dot.
- `SliderProps` is a closed interface with no `ComponentPropsWithoutRef` extension, so arbitrary
  `data-*`/`aria-*` props can't be forwarded to `RadixSlider.Root`: widen the type and spread
  `...props` onto the root.

### Sparkline — 8/10
- An empty `values` array drives `Math.min(...[])`/`Math.max(...[])` to `Infinity`/`-Infinity`,
  producing `NaN` polyline points instead of a designed empty/flat state: guard for
  `values.length === 0` and render nothing (or a flat baseline) rather than letting the math run
  unguarded.
- (See the Duplicate-component audit above: independently reimplements the same scale-math
  formula as `LineChart` — worth extracting a shared internal helper.)

### SpeedDial — 7/10
- No Escape-to-close or click-outside-to-close: the open/close state is hand-rolled with plain
  `useState` instead of a Radix popover/dismissable-layer primitive, so pressing Esc or clicking
  elsewhere leaves the fanned-out actions open, violating heuristic #7's explicit
  Tab/Enter/Space/Esc/arrow-key keyboard contract.
- No arrow-key navigation between the revealed action buttons (only Tab order); add roving-focus
  arrow-key support to match the pattern other menu-like components get from Radix.

### Spin — 9/10
- The three illustrated variants (`drums`/`hourglass`/`papers`) are animated GIFs, so
  `prefers-reduced-motion` (which only stops the CSS-driven `classic` variant's rotation) cannot
  pause them — ship a static poster-frame swap under that media query for the raster variants, as
  the component's own CSS comment already flags but hasn't fixed.

### SplitButton — 6/10
- The popover's `open` state is local-only (`useState`, no `open`/`onOpenChange` props exposed),
  breaking the Framework Rule that every stateful component supports controlled and uncontrolled
  use — add `open`/`defaultOpen`/`onOpenChange` following the same `isControlled` pattern
  `SpeedDial` already uses.
- Menu items render via `Button` with `size="sm"`, which is only `min-height: 32px` per
  `.rebar-button[data-rebar-size="sm"]` in `style.css`, under the 44×44 touch-target minimum
  (heuristic #19) — switch menu items to the default `md` size or add explicit
  `min-height: 44px` to `.rebar-split-button-item`.

### Stack — 7/10
- No test file exists at all (`packages/core/src/test/Stack.test.tsx` is missing) — every other
  reviewed component has one; add a test covering `direction`/`gap`/`align`/`justify` style output
  and `data-*`/`aria-*` passthrough per the checklist in `robot.md`.

### StackedBarChart — 6/10
- `readableLabelColor()` only parses hex strings and falls back to dark text (`#212121`) for
  anything else, but the component's own `DEFAULT_PALETTE` is all `var(--rebar-color-*)` strings —
  so every default-palette segment (including `--rebar-color-danger`, a dark red) always gets dark
  label text with no real luminance check, a genuine, untested contrast risk; resolve the CSS
  variable to its computed color (or ship literal hex defaults) before computing readability.
- Segments shorter than 22px render no label at all and rects carry no `<title>`/`aria-label`, so
  those values are invisible both visually and to screen readers — add a `<title>{segment.label}:
  {yFormat(segment.value)}</title>` inside every `<rect>` regardless of the visual-label height
  cutoff.

### Statistic — 8/10
- No `locale` prop — `toLocaleString()`/`toFixed()` always use the runtime default locale, exactly
  the gap `ref/HEURISTICS.md` #40 names `Statistic` for directly; add a `locale` prop threaded into
  `Intl.NumberFormat`.
- `formatValue` uses `toFixed(precision)` when precision is set, which drops thousands-separator
  grouping that `toLocaleString()` gives without precision — use `Intl.NumberFormat` with
  `minimumFractionDigits`/`maximumFractionDigits` instead so grouping and precision aren't
  mutually exclusive.

### Steps — 6/10
- Renders no "step X of Y" text and no cancel/skip action, directly contradicting
  `ref/HEURISTICS.md` #17's explicit component rule ("`Steps` shows current step / total steps with
  a visible cancel/skip action") — add a `current + 1`/`items.length` label and an optional
  `onCancel`/`onSkip` slot.
- Finish/error status is conveyed only through an `aria-hidden` icon and CSS color, with no
  textual equivalent — add a visually-hidden status string (e.g. "Completed"/"Error") per item so
  screen-reader users get the same status information sighted users do.

### Sticky — 8/10
- When a caller wires `onClick` (as `Kanban`'s sticky-card variant already does), the root `div`
  gets no `role="button"`, `tabIndex`, or `onKeyDown`, so the click-to-edit interaction is
  completely unreachable by keyboard — add these attributes conditionally whenever `onClick` is
  passed, mirroring a real button's Enter/Space activation.

### SwipeActions — 8/10
- No outside-click/blur handling closes an opened row, so multiple rows can be swiped open
  simultaneously and stay open indefinitely until manually toggled shut — add a document-level
  pointerdown listener (or a Radix dismissable-layer) that closes the row when a click lands
  outside it.

### Switch — 5/10
- `.rebar-switch` is a fixed `width: 40px; height: 22px` with no compensating padding, a direct,
  unambiguous violation of heuristic #19's 44×44 touch-target minimum: add invisible padding (or a
  `min-height`/`min-width: 44px` wrapper) around the visual track, the same "grow the hit area, not
  the visual" fix already applied to `Editable`'s and `TimePicker`'s trigger buttons.

### Tab — 7/10
- `.rebar-tab` sets no `min-height`; with its `--rebar-space-sm` (8px) padding and
  `--rebar-font-size-sm` (14px) text it resolves to roughly 37px tall, under the 44×44 touch-target
  minimum — add `min-height: 44px` (and `display: inline-flex; align-items: center`) to
  `.rebar-tab`.

### TabList — 7/10
- `.rebar-tab-list` has no `overflow-x`/scroll handling, so once tabs exceed the container's width
  they become unreachable with no scrollbar or fade cue — add `overflow-x: auto` plus the edge-fade
  "mist" treatment heuristic #43 already calls for on other scrollable rails in this library.

### TabPanel — 10/10
- No gaps found against the current heuristics checklist.

### Table — 7/10
- No search/filter control: HEURISTICS.md #11 explicitly requires a standalone `Table` to provide
  search/filter before pagination, but `packages/core/src/components/Table.tsx` has no search
  input at all — add a built-in filter box that appears once row count crosses a threshold,
  matching the `table` placement block's own documented convention.
- Sort-button touch target: `.rebar-table-sort-button` in `style.css` has `padding: 0; margin: 0;`
  with no `min-height`/`min-width`, so the clickable header control falls well under the 44×44px
  minimum (#19) — add `min-height: 44px` (or wrap the button so the full `th` cell is clickable).
- No `error` state: `TableProps` documents/handles `loading` and empty (`emptyMessage`) but has no
  `error` prop or rendering path, leaving #20's required error state entirely undesigned — add an
  `error` prop that renders a specific message plus a recovery action in place of the body.

### Tabs — 8/10
- `.rebar-tab` touch target: the trigger has `padding: var(--rebar-space-sm) var(--rebar-space-xs)`
  (8px/4px) with no `min-height`/`min-width`, landing well under 44×44px (#19) — add
  `min-height: 44px` to `.rebar-tab`, the same fix already applied to `TimePicker`'s and `Toggle`'s
  own triggers.
- `.rebar-tab-list` has no `overflow-x`/wrap handling, so a tab set that grows past the container
  width has no bounded, scrollable footprint (#45) — add horizontal scroll (with the mist
  treatment #43 already applies elsewhere) rather than letting it silently overflow.

### Tag — 7/10
- `.rebar-tag-close` touch target: `padding: 0` with no `min-width`/`min-height` on a real
  `<button>`, falling far short of the 44×44px minimum (#19) — give it
  `min-height: 44px; min-width: 44px` the same way `Editable`'s trigger was fixed per `robot.md`.
- Inconsistent tone styling: `success`/`warning`/`error` tones each get a dedicated `-bg`
  background token, but the `info` tone rule only sets `border-color`/`color` with no
  `--rebar-color-info-bg` (which doesn't exist anywhere in `style.css`) — add that token and apply
  it to `.rebar-tag[data-rebar-tone="info"]` for consistency (#4).

### Text — 8/10
- The polymorphic `as` prop doesn't widen `TextProps` to the target element's own attributes —
  confirmed directly by `ThemeToggle.tsx`'s own comment ("Text's polymorphic `as` prop doesn't
  widen its prop types to the target element, so it can't accept `htmlFor` when rendered
  `as="label"`"), which forced that component to hand-roll a raw `<label>` instead of reusing
  `Text`, undermining #4 (one component, not per-caller one-offs) — fix by making `TextProps`
  generic over `E extends ElementType` so element-specific props like `htmlFor` type-check.

### ThemeToggle — 8/10
- Trigger touch target: the popover trigger explicitly uses `<Button variant="secondary"
  size="sm">`, and `.rebar-button[data-rebar-size="sm"]` is only `min-height: 32px` — under the
  44×44px minimum (#19) for a component meant to be visitor-facing on any device — switch the
  trigger to the default/`md` size.
- The "Bionic reading" switch label is a raw `<label>` (worked around `Text`'s `as="label"` typing
  gap) that never passes through `useBionicChildren`/`renderBionicChildren`, so it's the one
  string in this component that's excluded from the bionic-reading feature it's toggling — wrap
  that string through `renderBionicChildren` with the same ambient state the rest of the component
  reads.

### TimePicker — 8/10
- Hour/minute columns use `role="listbox"`/`role="option"` on plain `<button>`s with no arrow-key
  roving-tabindex handling, so a real ARIA listbox is declared but only Tab-through-each-button
  keyboard support exists (violates #7's full keyboard operability for the pattern implied by the
  roles) — either add real arrow-key navigation between options or drop the listbox/option roles
  in favor of a plain button group.

### Timeline — 8/10
- No empty state: an `items={[]}` array silently renders an empty `<ol>` with no message, unlike
  `Table`'s `Empty` handling for the same case — violates #20 (empty states must be designed, not
  left blank) — render the real `Empty` component when `items.length === 0`.

### Toast — 6/10
- No animation at all: HEURISTICS.md #21 states outright "Toast (real, shipped, via
  ToastProvider) slides in from the edge," but no `@keyframes`/transition targeting `.rebar-toast`
  exists anywhere in `style.css` — add a 200-500ms slide-in/out animation keyed off Radix's own
  `data-state`/`data-swipe` attributes.
- `warning` and `info` toast types have no dedicated CSS rule (only `error` and `success` get a
  border-color override), so those two types are visually indistinguishable from the default,
  undermining #1's persistent-status-cue requirement — add
  `.rebar-toast[data-rebar-type="warning"]`/`"info"` border-color rules.
- `.rebar-toast-close` has no `min-width`/`min-height` (just an 18×18px SVG with zero padding),
  well under the 44×44px minimum (#19) — add real padding or
  `min-height: 44px; min-width: 44px`.

### ToastProvider — 9/10
- `ToastProvider`'s signature is just `{ children }` with no rest-spread of `data-*`/`aria-*` (or
  a `className`) onto the real `RadixToast.Viewport` DOM node, breaking the Framework Rule that
  every component forwards those props and blocking a consumer from targeting/testing the viewport
  directly — add `...props: ComponentPropsWithoutRef<typeof RadixToast.Viewport>` and spread it
  onto `Viewport`.

### Toggle — 10/10
- No gaps found against the current heuristics checklist.

### ToggleGroup — 8/10
- No roving-tabindex/arrow-key navigation between items (confirmed by its own code comment: "no
  keyboard roving-tabindex model... Tab visits every item"), even though
  `@radix-ui/react-toggle-group` implements exactly this `type="single"|"multiple"` pattern with
  real arrow-key nav out of the box — swap the hand-rolled `Toggle`-per-item composition for that
  Radix primitive to close the #7 keyboard-efficiency gap without changing the existing
  single/multiple API.

### Tooltip — 8/10
- No `data-*`/`aria-*` passthrough: `TooltipProps` is a closed interface with no rest-spread onto
  `RadixTooltip.Content`, so a caller can't attach `className`, `data-testid`, or any
  `data-*`/`aria-*` prop to the tooltip content; extend
  `ComponentPropsWithoutRef<typeof RadixTooltip.Content>` and spread `...rest` onto it.
- Tooltip only opens on hover/keyboard focus with no verified tap-to-show path for touch devices;
  add an explicit tap-triggered open (e.g. toggle on `onClick` when the pointer type is touch) per
  heuristic #48.

### Tour — 6/10
- The overlay has no Esc-to-close or backdrop-click-to-close handler (only the "Skip" button
  dismisses it), violating heuristic #3's every-modal-needs-Esc-and-backdrop-dismiss rule; add a
  `keydown` listener for `Escape` calling `setOpen(false)` and an `onClick` on the
  `.rebar-tour-mask` divs.
- The `role="dialog"` callout gets no focus trap or initial focus placement on open, so
  keyboard/screen-reader users can tab into the dimmed page behind it; move focus to the callout's
  heading or first button in a `useEffect` when `currentOpen` becomes true, matching `Dialog`'s own
  focus-trap convention.

### Transfer — 7/10
- Each `.rebar-transfer-panel-row` only has `padding: var(--rebar-space-xs) var(--rebar-space-sm)`
  around a 20px `Checkbox`, leaving each row well under the 44×44px touch-target minimum
  (heuristic #19); increase the row's vertical padding so the full clickable row reaches 44px tall.
- Neither panel has a search/filter input, so Transfer degrades to an unscannable flat list once
  `items` grows past a couple dozen entries (heuristics #11/#17); add a per-panel search box
  filtering the visible rows.

### TreeSelect — 7/10
- It composes `TreeView` inside its popover, inheriting `TreeView`'s undersized item rows and 16px
  expand/collapse toggle, both well under the 44×44px touch minimum; fix at the shared
  `.rebar-tree-view-item`/`.rebar-tree-view-toggle` CSS rules so both components benefit.
- On reopening the popover, keyboard focus always starts at `TreeView`'s first visible node
  (`focusIndex` defaults to `0`) instead of the already-selected node, forcing a keyboard user to
  re-navigate from the top every time; initialize `focusIndex` to the currently `selected` node's
  index when one exists.

### TreeView — 6/10
- `.rebar-tree-view-item` (padding `4px 8px` around 14px text) and `.rebar-tree-view-toggle`
  (`width: 16px`, no min-height) both fall well short of the 44×44px touch-target minimum
  (heuristic #19); add `min-height: 44px` (and matching padding) to both rules.
- `.rebar-tree-view-item` defines `:hover` and `[data-rebar-active]` styles but no `:focus-visible`
  rule, so keyboard focus falls back to the browser default outline instead of the library's own
  `outline: 2px solid var(--rebar-color-border-focus)` convention used everywhere else; add that
  rule for consistency (heuristic #4).

### Treemap — 7/10
- With an empty `data` array the component renders zero `<rect>`s and no placeholder (confirmed
  by its own test), leaving a blank canvas rather than the visible "no data" state heuristics
  #16/#20 require; render an `Empty`-style placeholder inside the `<figure>` when
  `data.length === 0`.
- A child cell's `fillOpacity` can ramp down to `0.4` while its label stays hardcoded
  `fill="#ffffff"`, so a desaturated color at low opacity can leave the white label text with poor
  contrast; derive the label color from the cell's actual opacity-blended luminance instead of
  hardcoding white.

### WaterfallChart — 7/10
- Bar color alone distinguishes total (blue) vs. increase (green) vs. decrease (red) bars with no
  legend anywhere on the chart, so a first-time viewer has no way to learn what the colors mean
  (heuristic #16); add a small legend row (colored swatch + "Total"/"Increase"/"Decrease" labels)
  below the chart.
- An empty `steps` array still renders gridlines and the zero line but zero bars and no "no data"
  message, reading as a broken chart rather than a designed empty state (heuristics #16/#20);
  render a visible empty-state placeholder when `steps.length === 0`.

### Watermark — 6/10
- The default `color = "rgba(0, 0, 0, 0.15)"` is a hardcoded raw color, not a `--rebar-color-*`
  token, so it fails to adapt in dark mode and can become nearly invisible against a dark
  background — the same class of bug robot.md's own dark-mode note already caught on `Switch`;
  default it to a theme-aware value such as
  `color-mix(in srgb, var(--rebar-color-text-primary) 15%, transparent)`.
- `imageSize` is documented as "required when image is set" but is typed optional and silently
  falls back to `100x100`, which can visibly distort a differently-proportioned logo with no
  warning; make `imageSize` genuinely required in the type when `image` is set.

### Wizard — 6/10
- The multi-step footer has no visible Cancel/Exit action (only Back/Next/Submit), directly
  missing heuristic #17's explicit requirement that multi-step processes "provide a visible exit";
  add an optional `onCancel`/`cancelLabel` prop rendering a tertiary Cancel button in
  `.rebar-wizard-footer`.
- `FieldLabel` renders a raw `<label className="rebar-text">` instead of the real `Text`
  component, so field labels never pick up the ambient bionic-reading toggle unlike every other
  text-bearing component in the library; swap it for `Text` (or wrap its children in
  `useBionicChildren`).

### WordCloud — 6/10
- The entire word list — the chart's whole informational content — collapses into one static
  `role="img"` accessible name (just `title`/"Word cloud"), so a screen-reader user gets zero
  information about which words are large/important, the one case among this library's charts
  where the rendered text *is* the data; add a visually-hidden list (e.g. a `<ul>` of word/weight
  pairs) alongside the SVG for assistive tech.
- With an empty `words` array the component renders a bare `<svg>` with no text and no placeholder,
  the same blank-canvas gap as `Treemap` (heuristics #16/#20); render a visible "no data"
  placeholder when `words.length === 0`.

## GitHub-repo gap survey (feeds the next round of new components, not fixes)

Separate from the heuristic review above — this is the outcome of surveying 14 of the user's own
other GitHub repos (a mix of web and mobile apps) for real UI patterns worth adding to rebar-ui's
component/block libraries ahead of eventually rebuilding those apps on rebar-ui. Full detail was
already delivered in chat; summarized here for one place to track it:

**Nothing new (3 of 14):** Oestler-Root, Faber (unbuilt stub only), TheDarkestPath (no code, pure
writing repo).

**Recurring across 2+ repos (highest signal) — status:**
- 3D BIM/IFC model viewer (Simple-Checklists, oestler) — complex. **Not yet built** (highest
  remaining complexity item from this survey).
- Freehand signature pad (Simple-Checklists, oestler) — simple-medium. **Not yet built.**
- Photo/camera-based barcode/QR scan-and-decode (Simple-Checklists, oestler) — simple-medium.
  **Not yet built.**
- Version history / restore drawer (Simple-Doc-Control, NovelaHaus, Simple-Presentation) — simple.
  **Shipped** as `VersionHistory` — see `/components/version-history`.
- Kanban extensions beyond the base component: threaded comments+attachments, activity/history
  log, card merge/split, staleness visual effects, custom assignment roles (Simple-Kanban), plus a
  day-of-week outfit-planner domain variant (LGD) — medium. **Not yet built** (these are extensions
  to the existing `Kanban` component itself, not new standalone components — scope them as a
  `Kanban` enhancement pass, not a fresh build).

**Standout single-repo finds — status:**
- Simple-Presentation is a full diagram/whiteboard editor (React Flow-based), not a slideshow tool
  — 17 distinct canvas-editor patterns (pen tool, smart connector routing, page-thumbnail rail,
  in-canvas comment pins, live multiplayer cursors, reveal-sequence builder, and more). **Partially
  shipped**: `LayersPanel` and `ShapeGallery` are built (`/components/layers-panel`,
  `/components/shape-gallery`). The canvas-engine-specific pieces (pen tool, brush tool, connector
  routing, page-thumbnail rail, presenter view, comment pins, live cursors, reveal-sequence
  builder) remain unbuilt — each needs a real canvas-editor foundation first, deliberately deferred
  rather than half-built against nothing.
- oestler additionally has 4D schedule playback (timeline-scrubbed 3D model), 360° panorama
  walkthroughs with hotspots — **not yet built** (both depend on the still-unbuilt 3D/BIM
  foundation above) — and an inline "/" slash-command menu inside its rich-text editor —
  **shipped** as `SlashCommandMenu` (`/components/slash-command-menu`).
- Athic-Web-Chat: streaming AI chat bubbles with typing indicator — **shipped** as `ChatThread`
  (`/components/chat-thread`); a voice-recording composer with live transcription — **shipped** as
  `VoiceComposer` (`/components/voice-composer`); a waveform audio player — **shipped** as
  `WaveformAudioPlayer` (`/components/waveform-audio-player`).
- Spring-Street-Archive: a real file/media manager (folder tree, drag-drop) — **shipped** as
  `FileManager` (`/components/file-manager`); its dedup upload queue — **shipped** as
  `UploadQueue` (`/components/upload-queue`); hover/tap-to-play video product tiles with
  countdown-gated content blur — **not yet built**.
- Simple-Checklists also has a drag-and-drop form/template designer (palette → canvas) and a
  conditional field-dependency rule builder — **not yet built**.
- Curia: infinite-scroll card directory with skeleton loading — **shipped** as
  `InfiniteScrollGrid` (`/components/infinite-scroll-grid`); a hierarchical goal/OKR tracker with a
  confetti completion effect — **shipped** as the `goal-tracker` block (`/blocks#goal-tracker`),
  built on the new `TodoItem` component (`/components/todo-item`) for its checkable rows —
  reclassified from a standalone `GoalTracker` component per `robot.md`'s component-vs-block test.
- AscendantSpace: a real desktop app (Tauri) — a raster brush-paint canvas editor and multi-layer
  image compositor — **not yet built** (same canvas-foundation dependency as the
  Simple-Presentation items above).
- NovelaHaus: text-to-speech control bar — **shipped** as `TextToSpeechBar`
  (`/components/text-to-speech-bar`); selection-triggered floating toolbar in the editor —
  **shipped** as `FloatingSelectionToolbar` (`/components/floating-selection-toolbar`); a compound
  "AI editorial score" bar widget — **not yet built**.

Also shipped, not from this survey: **`GitGraph`** (`/components/git-graph`), a static git commit
history visualization, built on direct request rather than surfaced by a repo survey.

**What's left, roughly in order of value:** the 3D BIM/IFC model viewer (recurring across two real
repos — highest-signal remaining gap), the signature pad and photo-barcode-scan pair (both simple,
both recurring), then the canvas-editor foundation the several deferred Simple-Presentation/
AscendantSpace items depend on, then the smaller one-off remaining items (video product tiles,
form/template designer, conditional rule builder, AI editorial score widget), then the `Kanban`
enhancement pass.

## Suggested sequencing

1. **Cross-cutting patterns first** (touch targets, chart empty-states, bionic passthrough,
   `data-*`/`aria-*` passthrough, missing tests) — highest leverage, mostly mechanical, raises many
   scores at once with low risk of regression.
2. **The three 5-6/10 outliers** (Badge, Pagination, Switch) — each a single, clear, high-confidence
   fix.
3. **Everything else in the per-component list**, in whatever order is convenient — none of it is
   deep surgery.
4. **LineChart/AreaChart/Sparkline shared-implementation extraction** — a maintainability
   investment, not urgent, best done once the empty-state fix touches all three anyway.
5. **New components from the GitHub survey** — genuinely separate work from fixing what's shipped;
   sequence whenever the user is ready to prioritize specific repos for porting.
