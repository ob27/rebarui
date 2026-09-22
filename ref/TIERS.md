---
title: Rebar UI — Tiers (Imitations / Synthetics / Opinions / Orders / Geneses)
status: living document
---

# Tiers: Imitations → Synthetics → Opinions → Orders, plus Geneses

The component/block split (`packages/core/agent.md`'s "Building blocks" section) answers "would a
consuming app import this directly as a feature, or is this a page-content shape the Packer
composes?" — a judgment call that mostly works, but isn't the only question worth asking. This
document answers a different, orthogonal one: **where does a thing sit in the lifecycle from a raw
static primitive to a piece of page-level structural law?** Like Web/Mobile/Diagram (components) and
Global/Web/Mobile (blocks, `ref/BLOCKS.md`), this axis cuts across the component/block split rather
than restating it — every combination of tier and either other axis is legal.

This classification exists because the two-bucket split isn't legible enough on its own for an LLM
building a complex, live view: `ref/PLACEMENT_LIVE_DATA.md` and `ref/TOM_v2.md` document that every
real attempt to build a live, backend-driven app with rebar-ui abandoned `@rebar-ui/placement`
entirely, because `Block[]` is plain static data with no way to express a live source or handler.
Naming "Opinion" as an explicit tier — and making it a mechanical, schema-level fact rather than a
vibe — gives that failure mode a real fix: the eleven blocks below that already secretly embedded
interactive state in `BlockRenderer.tsx` are exactly the ones that now support live-data binding.

## The four tiers

- **Imitations** — static, standalone primitives. No composition of other named components, no real
  state machine beyond mirroring one caller-controlled value for the controlled/uncontrolled
  convention (`packages/core/agent.md`'s "Building components" section).
- **Synthetics** — static compositions/groupings of primitives with a unified purpose, but still no
  real dynamism.
- **Opinions** — real internal state: validation, morphing, multi-step flow, drag/reorder,
  search-and-filter, open/closed with focus management.
- **Orders** — macro/page-level structural governance of other things: nav, sidebars, tab strips
  that swap whole panels, page-level overlay/panel systems, page indexes.

## Geneses are a different kind of thing, not a fifth rung

Imitation/Synthetic/Opinion/Order classify individual constructs — a component or a block. A
**Genesis** is a whole, complete, production-ready application built entirely out of those
constructs: not a piece you import, but a seed you clone. That's why `ConstructTier` (the type
governing what a block is allowed to be, `apps/docs/src/data/tier.types.ts`) explicitly excludes
Genesis, the same way it excludes Imitation — a block is always at least a fixed composition, and a
genesis is always more than one. See `/geneses` on the site for the full framing; this doc only
covers the four-tier ladder that individual constructs climb.

## The delegated-state exception (read this before classifying anything)

You cannot determine tier by grepping a component's own file for `useState`. Several Opinion-tier
components below show **zero** own state in their own source because they delegate their entire
state machine to something else:

- A wrapped Radix primitive — `Select`, `Accordion`, `Tabs`, `Dialog`, `Popover`, `Dropdown`,
  `Tooltip`, `HoverCard`, `ContextMenu`, `Collapsible`, `Menubar`, `Combobox`.
- A shared chart hook — every chart using `useChartMarkSelection` (hover/click/persistent-selection:
  `AreaChart`, `BoxPlot`, `BubbleChart`, `CalendarHeatmap`, `DistributionChart`, `Heatmap`,
  `LineChart`, `IndexChart`, `Histogram`, `PackedBubbleChart`, `RibbonChart`, `StackedAreaChart`,
  `StepChart`, `StackedLineChart`, `UMAPPlot`) or `useSeriesFilter` (hide/show a series:
  `RadarChart`, `ScatterChart`, `StackedBarChart`) — versus the charts with neither hook (`BarChart`,
  `PieChart`, `GaugeChart`, `FunnelChart`, `GanttChart`, `GeoChart`, `SankeyDiagram`,
  `WaterfallChart`, `WordCloud`, `Sparkline`, `BulletGraph`, `CandlestickChart`, `SteppedBarChart`,
  `Treemap`), which stay Synthetic.
- Another Opinion-tier component — `Flowchart`/`MindMap`/`OrgChart`/`PertChart` delegate to
  `NodeLinkGraph`'s own pan/zoom/drag state; `DataGrid` delegates to `Table`/`Editable`/`Accordion`;
  `BottomSheet`/`ActionSheet`/`Popconfirm`/`Lightbox`/`VersionHistory` delegate to
  `Drawer`/`Popover`/`Dialog`; `Form` delegates to react-hook-form.

**The real test is state-machine richness, not state presence.** Framework Rules require every
stateful component support controlled/uncontrolled use, so `Checkbox`/`Switch`/`Slider`/
`RadioGroup`/`Rate`/`Pagination`/`Carousel`/`Selector`/`ToggleGroup` all carry some internal state
for that convenience alone — that doesn't make them Opinions. The question is whether the state
causes the component to branch into meaningfully different rendered/behavioral *modes*, not whether
it mirrors one caller-owned value: a checkbox mirroring one boolean stays an Imitation; a component
with open/closed + filtered-list + highlighted-index + selection state (`Combobox`) is an Opinion.

Genuinely borderline calls, decided and stated rather than smoothed over: `Ellipsis` (a real
truncated↔expanded mode toggle, called Opinion); `VoiceComposer`/`TextToSpeechBar` (fully
controlled — the mode is a caller-owned prop, zero internal `useState` — but a 5-value mode enum
driving materially different UI per mode, called Opinion on behavior, not state ownership);
`IndexBar` (a genuine continuous-drag scrub gesture, called Opinion despite being page-index-shaped,
since the drag interaction is the defining trait); `Affix`/`BackTop`/`ScrollMask` (scroll-position-
driven visibility/position toggles, kept Synthetic — real but not a validation/morph/drag/filter
state machine); `Card`/`AspectRatio`/`Descriptions` (optionally compose an Opinion-grade component
as one non-core slot, kept Synthetic since that's not their defining purpose).

## Opinion is mechanical, for blocks

For a block, "Opinion" isn't a judgment call — it's a compiler-checked fact computed directly off
`Block`'s own shape (`packages/placement/src/opinions.ts`'s `OpinionBlockType`): a block *is* an
Opinion iff its schema type declares a `source` field or an `on<Verb>` handler. That's exactly the
set of blocks the live-data-binding mechanism (`source`/`onX`, resolved by `BlockRenderer`'s
`data`/`handlers` props — see `ref/PLACEMENT_LIVE_DATA.md`) applies to: `ai-chat`, `card-kanban`,
`float-assistant`, `form`, `goal-tracker`, `line-chart`, `scatter-chart`, `stacked-bar-chart`,
`sticky-kanban`, `table`, `wizard` — eleven blocks that already had real interactive state
hand-embedded in `BlockRenderer.tsx` despite looking like static schema data, before that mechanism
existed to make it explicit and checkable. (`filter-bar` *looks* interactive too — a real search box
and filter select — but its actual `BlockRenderer.tsx` case wires nothing downstream: no filter
effect, no handler. Check the rendering code, not the schema field names, before concluding either
way — that's what keeps this list mechanical rather than a vibe.)

## Order is really a different axis

Read literally, the four tiers look like one ascending complexity ladder. Tested against the real
42-block catalog, that doesn't hold: "Order" is a different axis (macro/page-level governance vs.
behavioral complexity) than the Imitation→Synthetic→Opinion ladder. Of the 42 blocks, 9 are genuine
Orders; the rest split across Synthetic (22, plain static content) and Opinion (11, above) — calling
every block in the placement package "Order" because of where its code lives conflates
*architectural layer* (why the block exists — an LLM-authorable content unit) with *behavioral
complexity* (the axis Imitation/Synthetic/Opinion is actually built on). Order is judged by
page-structural *role*, not by absence of a state machine: `SectionNav`/`NavIndex` have real
scroll-spy/search state and are still Orders.

This nuance is deliberately kept out of `agent.md`'s digest and the rest of this site's copy — the
clean four-step lifecycle is still a genuinely good mental model for composing new content, even
though Order is really the frame Imitations/Synthetics/Opinions render inside, not a fourth rung on
their own ladder. It's stated plainly here and once in `ref/ARCHITECTURE.md`, for whoever maintains
the schema.

## Components, by tier (192)

This list (and the block list below it) is generated straight from `apps/docs/src/data/
constructTier.ts` — that file is the mechanically-enforced source of truth (a compile-time
assertion checks every exported component/block has an entry), so treat any drift between it and
this list as this list being wrong, not the other way around.

- **Imitation** (33): `Avatar`, `Badge`, `Barcode`, `Box`, `Button`, `Checkbox`, `Divider`, `Heading`,
  `Iframe`, `Input`, `Kbd`, `NumberInput`, `Pagination`, `PinInput`, `Progress`, `ProgressCircle`,
  `QRCode`, `Radio`, `RadioGroup`, `Rate`, `ScrollArea`, `SegmentedControl`, `Selector`, `Skeleton`,
  `Slider`, `Spin`, `Stack`, `Statistic`, `Switch`, `Tag`, `Text`, `Toggle`, `Watermark`.
- **Synthetic** (49): `AccordionItem`, `Affix`, `AiChatInput`, `Alert`, `AspectRatio`, `AvatarGroup`,
  `BackTop`, `BarChart`, `BulletGraph`, `ButtonGroup`, `CandlestickChart`, `Card`, `Carousel`,
  `ChatThread`, `CodeBlock`, `Countdown`, `Descriptions`, `DiagramMinimap`, `DiffViewer`, `Empty`,
  `ErrorBlock`, `FormItem`, `FunnelChart`, `GanttChart`, `GaugeChart`, `GeoChart`, `GitGraph`,
  `InfiniteScrollGrid`, `Masonry`, `NoticeBar`, `PieChart`, `PivotTable`, `Result`, `SankeyDiagram`,
  `ScrollMask`, `Sparkline`, `SteppedBarChart`, `Steps`, `Sticky`, `Tab`, `TabList`, `TabPanel`,
  `Timeline`, `ToastProvider`, `ToggleGroup`, `Treemap`, `WaterfallChart`, `WaybackSlider`,
  `WordCloud`.
- **Opinion** (96): `Accordion`, `ActionSheet`, `AreaChart`, `BottomSheet`, `BoxPlot`, `BubbleChart`,
  `Calendar`, `CalendarHeatmap`, `Cascader`, `Collapsible`, `ColorPicker`, `Combobox`,
  `CommandPalette`, `CommentThread`, `ConstructSearch`, `ContextMenu`, `DataGrid`, `DatePicker`,
  `Dialog`, `DistributionChart`, `Drawer`, `Dropdown`, `Editable`, `Ellipsis`, `FileManager`,
  `FileUpload`, `FloatAssistant`, `FloatingBubble`, `FloatingPanel`, `FloatingSelectionToolbar`,
  `Flowchart`, `Form`, `GraphExplorer`, `Heatmap`, `Histogram`, `HoverCard`, `Image`, `ImageCropper`,
  `IndexBar`, `IndexChart`, `Kanban`, `LayersPanel`, `Lightbox`, `LineChart`, `Mentions`, `Menubar`,
  `MindMap`, `MultiSelect`, `NodeLinkGraph`, `NumberKeyboard`, `OrgChart`, `PackedBubbleChart`,
  `PertChart`, `PhoneInput`, `PickerWheel`, `Popconfirm`, `Popover`, `PullToRefresh`, `RadarChart`,
  `ResizablePanels`, `RibbonChart`, `RichTextEditor`, `ScatterChart`, `Select`, `ShapeGallery`,
  `SignaturePad`, `SlashCommandMenu`, `SpeedDial`, `SplitButton`, `StackedAreaChart`,
  `StackedBarChart`, `StackedLineChart`, `StepChart`, `SwipeActions`, `Table`, `Tabs`, `TagInput`,
  `TextToSpeechBar`, `ThemeToggle`, `TimePicker`, `Toast`, `TodoItem`, `Tooltip`, `Tour`, `Transfer`,
  `TreeSelect`, `TreeView`, `UMAPPlot`, `UploadQueue`, `VersionHistory`, `VideoPlayer`,
  `VoiceComposer`, `VoiceInputBar`, `WaveformAudioPlayer`, `Wizard`, `WorkspaceSwitcher`.
- **Order** (14): `AppShell`, `Breadcrumb`, `Col`, `Container`, `Footer`, `Grid`, `MobileTabBar`,
  `NavBar`, `NavIndex`, `Row`, `SectionNav`, `SidePanel`, `SidebarNav`, `SkipLink`.

## Blocks, by tier (42)

- **Order** (9): `comparison`, `mega-menu`, `modal`, `nav-bar`, `nav-index`, `page-index`,
  `side-panel`, `site-header`, `tabs`.
- **Synthetic** (22): `banner`, `callout`, `card-grid`, `checklist`, `construct-entry`, `data-list`,
  `doc-section`, `error-block`, `feature-grid`, `filter-bar`, `footer`, `gallery`, `header`, `hero`,
  `heuristic`, `iframe`, `persona-card`, `pillar-grid`, `props-table`, `section-header`,
  `spin-card`, `stats-table`.
- **Opinion** (11) — mechanically true, each declares a `source`/`onX` field: `ai-chat`,
  `card-kanban`, `float-assistant`, `form`, `goal-tracker`, `line-chart`, `scatter-chart`,
  `stacked-bar-chart`, `sticky-kanban`, `table`, `wizard`.

One call worth stating explicitly, since the schema field name alone would suggest otherwise:
`filter-bar` *looks* interactive (a real search box and filter select) but its actual
`BlockRenderer.tsx` case wires nothing downstream — no filter effect, no handler — so it's correctly
Synthetic, not Opinion. `form` used to be the same story, until the live-data mechanism gave it a
real `onSubmit` (see the 0.5.0/0.6.0 entries on `/about/version-log`) — it's genuinely Opinion now.
Check the actual rendering code, not the schema field names, before concluding either way.

## Sequencing: encouraged, not enforced

When building something new, ask, in order: **(1)** Is this a standalone primitive with no
awareness of siblings or its own state — could it be an Imitation? **(2)** If it needs to combine
with others, can it become a fixed composition that still requires no live state — a Synthetic?
**(3)** Does the real requirement force genuine internal state — validation, morphing, multi-step,
drag, search-and-filter — making it an Opinion? **(4)** Does it need to govern page- or app-level
structural arrangement of other things — an Order?

The four tiers are **not a build-order gate** — shipping an Opinion or an Order with nothing beneath
it in Imitation/Synthetic form is completely valid and common; most useful state machines were never
simpler static versions of themselves first. But asking the question in this order surfaces two
things a design pass that skips straight to "build the state machine" would miss: **(a)** a static
sub-piece worth extracting and reusing on its own — the `GoalTracker` → `TodoItem` precedent: the
checkable row turned out to be worth having independently of the hierarchy/editing logic wrapped
around it; and **(b)** whether something billed as "just data" (a block's fixed schema) is actually
smuggling in real interactive state that changes its tier and its guarantees — the eleven Opinion
blocks, above.

## Rolled-up cases

Of six originally-flagged ambiguous cases (one artifact spanning two tiers, or duplicated across the
component/block boundary), every one resolved to a single tier over one artifact rather than
needing a split catalog row — including `Card`, despite the temptation:

- **Card** — carries a real Opinion-grade interaction (`editable`, grafting real click-to-edit state
  via `Editable`) as one optional, non-core prop, but stays a single Synthetic catalog row rather
  than splitting into "default"/`editable` rows: `editable` is a prop-level variant
  (`packages/core/agent.md`'s own component checklist already warns against forking near-duplicates
  over a prop difference), not a different interaction pattern, and it isn't Card's defining
  purpose — same call as `AspectRatio`/`Descriptions` above.
- **NavBar** (component) / `nav-bar` / `site-header` (blocks) — three already-distinct, already-Order
  artifacts. The "three ways to get a nav bar" redundancy is a noted, out-of-scope future
  consolidation candidate, not something this pass fixes.
- **Kanban** (component) / `card-kanban` / `sticky-kanban` (blocks) — three already-distinct,
  already-Opinion artifacts. No placeholder for a hypothetical "static Kanban" — that shape already
  exists as `card-grid` (Synthetic).
- **Wizard** (component) / `wizard` (block) — both Opinion. A near-pure-passthrough block wrapping a
  real state machine is still an Opinion — thinness of the wrapper doesn't dilute what it renders.
  `wizard` additionally gained a live `onSubmit` binding (forwarding the real `Wizard` component's
  own `onSubmit`) specifically because this tier work found it — its steps are static content, but
  its *result* is real live output a backend-driven app needs.
- **Table/DataGrid** (components, Opinion) / `table` (block, Opinion) / `stats-table` (block,
  Synthetic) — four real artifacts split cleanly across two tiers. `table` and `stats-table` both
  render through the real `Table` component, but `stats-table` exposes none of its stateful props by
  design — the clearest proof tier tracks the exposed authoring surface, not the implementation
  underneath.
- **ChatThread/AiChatInput** (components) / `ai-chat` (block) — all three already correctly Opinion.

## How this relates to the component/block split and to Web/Mobile/Diagram

Three fully independent axes: component-vs-block (what you import directly vs. what the Packer
composes from content), Web/Mobile/Diagram + Global/Web/Mobile (which viewport/platform something
targets), and Imitation/Synthetic/Opinion/Order (where it sits in the build lifecycle). A single
artifact can be, e.g., a Web-category, Order-tier component (`NavBar`) or a Global-category,
Synthetic-tier block (`checklist`) — every combination is legal, and none of the three axes predicts
another.

## Where this categorization actually lives

This document is the prose reference. The real source of truth: `apps/docs/src/data/componentTier.ts`
and `apps/docs/src/data/blockTier.ts` (whose "opinion" entries are cross-checked at compile time
against `@rebar-ui/placement`'s own mechanical `OpinionBlockType`, from
`packages/placement/src/opinions.ts` — `tsc --noEmit` fails if the two ever disagree, not a
runtime check, since a real Turbopack interop bug misresolves that package's named *value* exports
inside this app's server build; the type-only import doesn't hit it), assembled into
`apps/docs/src/data/tierSections.ts`. Live, browsable catalogs: `/imitations`, `/synthetics`,
`/opinions`, `/orders`, `/geneses` — there's no separate page carrying this document's own
relational explanation; this file is that explanation. Compact digest for a consuming agent:
`packages/core/agent.md`'s "The four tiers" section.
