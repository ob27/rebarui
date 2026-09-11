---
title: Rebar UI — Blocks (Global / Web / Mobile)
status: living document
---

# Blocks: Global / Web / Mobile

The placement-layer's block catalog (`packages/placement/src/schema.ts`) grew to 39 types with no
categorization beyond the topical groupings already on [`/blocks`](../apps/docs/src/app/blocks/page.tsx)
(Navigation, Feedback & content, Marketing, etc.) — useful for *browsing by content type*, but not
for the separate, real question this document answers: **which target(s) is a given block actually
built for?** A block reaching for a wide viewport and desktop interaction patterns isn't wrong to
use, but an agent building a mobile page needs to know that going in, the same way
`shippedCategory.ts` already tags individual `packages/core` components Web/Mobile/Diagram for
`/components`' own filter. This document is the block-level equivalent of that categorization,
plus (for **Global** blocks specifically) real reference values pulled from Ant Design's own
published spec pages — a starting point for color/spacing/font/shadow/dark-mode/data-format
decisions, not a set of rules this project is adopting wholesale (Rebar stays headless/low-fidelity
until migration; see `packages/core/README.md`'s "Don't fine-tune visual styling here").

Three categories:

- **Global** — makes no assumption about viewport width or platform-specific interaction; equally
  at home on a wide desktop page or a narrow mobile one.
- **Web** — assumes a wide viewport, a desktop interaction pattern (hover, a persistent side rail,
  a wide multi-column grid), or is inherently specific to this project's own docs/marketing site.
- **Mobile** — built specifically for a narrow, touch-first context (antd-mobile-derived patterns:
  bottom sheets, floating action bubbles, a numeric keypad, a failure/error state screen).

## Global blocks (18)

`header`, `banner`, `checklist`, `callout`, `form`, `data-list`, `filter-bar`, `tabs`, `modal`,
`wizard`, `doc-section`, `spin-card`, `scatter-chart`, `line-chart`, `stacked-bar-chart`, `gallery`,
`goal-tracker`, `ai-chat`.

Each of these renders correctly with no layout change needed between a wide and a narrow viewport
(a `tabs` strip wraps or scrolls either way, a `checklist` is a plain vertical stack regardless of
width, a `modal` is a centered overlay on any screen size). `data-list` is the deliberate Global
counterpart to `table` (Web, below) — a vertical list of rows is the natural dense-data shape on a
narrow screen, where a wide multi-column table isn't.

### Reference values for Global blocks (sourced from Ant Design's own spec pages)

Not adopted as this project's own defaults (Rebar's current tokens — `ref/HEURISTICS.md`'s
IBM-Carbon-derived spacing/type scale — already exist and aren't being replaced) — this is the
starting-point reference the next visual pass (migration, or a real Global-block redesign) should
check against, the same way earlier spec-token research checked `packages/core`'s existing
components against AntD's icon-sizing rules. Fetched directly from `ant.design/docs/spec/*`, not
recalled from memory.

**Colors** ([`ant.design/docs/spec/colors`](https://ant.design/docs/spec/colors)) — brand/primary
`#1677ff`; neutral/text tokens (light → dark theme):

| Token | Light | Dark |
|---|---|---|
| Heading text | `#000000E0` | `#FFFFFFD9` |
| Regular text | `#000000E0` | `#FFFFFFD9` |
| Secondary text | `#000000A6` | `#FFFFFFA6` |
| Disabled text | `#00000040` | `#FFFFFF40` |
| Default border | `#D9D9D9` | `#424242` |
| Separator | `#0505050F` | `#FDFDFD1F` |
| Layout background | `#F5F5F5` | `#000000` |

Twelve base color families exist (red, volcano, orange, lime, gold, yellow, green, cyan, blue,
geekblue, purple, magenta) at 10 steps each, rendered as swatches rather than printed hex values on
AntD's own spec page — not reproduced here since they weren't extractable as text.

**Layout/grid** ([`ant.design/docs/spec/layout`](https://ant.design/docs/spec/layout)) — base
spacing unit **8px**; a 24-column grid (worked example: 1168px content width); design canvas
standard **1440px** wide. AntD's spec page renders its actual spacing-scale array and breakpoint
table as images, not text — not reproduced here for that reason (see the honest gap note below).
Real breakpoints instead sourced from [`ant.design/components/grid`](https://ant.design/components/grid)
(Bootstrap-4-derived): `xs <576px, sm ≥576px, md ≥768px, lg ≥992px, xl ≥1200px, xxl ≥1600px,
xxxl ≥1920px` (added v5.1.0). Recommended grid gutter: `(16 + 8n)px`.

**Typography** ([`ant.design/docs/spec/font`](https://ant.design/docs/spec/font)) — font stack
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
sans-serif` (plus emoji fallbacks); base size **14px** / line-height **22px**. Ten font
sizes/line-heights exist ("inspired by the pentatonic scale") but are rendered as an image on
AntD's own page, not extractable as text. Weights: Regular 400 (primary), Medium 500 (emphasis),
Semibold 600 (English-word emphasis only). Contrast target: **WCAG AAA, 7:1 or greater**.

**Dark mode** ([`ant.design/docs/spec/dark`](https://ant.design/docs/spec/dark)) — two stated
principles, "comfort of content" (avoid harsh contrast) and "consistency of information" (dark
content must match light content, not merely invert it). No explicit opacity/elevation-adjustment
token table is published — principle-level guidance only.

**Shadow/elevation** ([`ant.design/docs/spec/shadow`](https://ant.design/docs/spec/shadow)) —
three elevation layers, each three stacked shadows (values below are each layer's `-down`
directional variant; `-up`/`-left`/`-right` variants exist with adjusted offsets, same
blur/spread/opacity):

- Layer 1: `rgba(0,0,0,.16) 0 1px 2px -2px`, `rgba(0,0,0,.12) 0 3px 6px 0`, `rgba(0,0,0,.09) 0 5px 12px 4px`
- Layer 2: `rgba(0,0,0,.12) 0 3px 6px -4px`, `rgba(0,0,0,.08) 0 6px 16px 0`, `rgba(0,0,0,.05) 0 9px 28px 8px`
- Layer 3: `rgba(0,0,0,.08) 0 6px 16px -8px`, `rgba(0,0,0,.05) 0 9px 28px 0`, `rgba(0,0,0,.03) 0 12px 48px 16px`

**Data format** ([`ant.design/docs/spec/data-format`](https://ant.design/docs/spec/data-format)) —
numbers: comma thousand-separators, unit suffix lowercase with no space (`123,220kg`); currency:
symbol-prefixed (`¥123.00`), `M`/`B` abbreviations at scale; dates: `YYYY-MM-DD` default; ranges:
`~` or `-` with a space on both sides; time: 24h `HH:MM:SS` or 12h `H:MM:SS AM/PM`; date+time:
space-separated.

**Honest gap, stated rather than papered over:** the layout spacing-scale array and the 10-step
font-size scale are both described in prose on AntD's own spec pages but rendered as images, not
text — not fabricated here. If a future pass needs those exact numbers, they'd need to come from
reading the rendered image directly, not this document.

## Web blocks (19)

`nav-bar`, `site-header`, `nav-index`, `page-index`, `side-panel`, `hero`, `section-header`,
`feature-grid`, `pillar-grid`, `card-grid`, `persona-card`, `card-kanban`, `sticky-kanban`, `table`,
`comparison`, `iframe`, `props-table`, `stats-table`, `heuristic`.

Each either assumes real horizontal room (`nav-bar`'s overflow-collapse only matters past a wide
header's width; `comparison`'s two-panel layout, `card-kanban`/`sticky-kanban`'s multi-column
board, `side-panel`'s beside-the-main-content panel, `feature-grid`/`pillar-grid`/`card-grid`'s
multi-column card grids), a desktop-shaped nav pattern (`nav-index`/`page-index`'s persistent side
rail), or is inherently specific to *this project's own* docs/marketing site rather than a general
mobile-portable shape (`props-table`, `stats-table`, `heuristic`, `iframe`, `hero`,
`section-header`). `table` is the Web counterpart to `data-list` (Global, above) — a genuinely
dense multi-column table doesn't have a good narrow-viewport equivalent; a mobile page needing the
same data reaches for `data-list` instead.

## Mobile blocks (2 — `error-block`, `footer`; was 0)

**`error-block` (wraps `ErrorBlock`) shipped** — this project's first genuinely Mobile-only block,
and the same thing the separately-tracked "dedicated failure-state blocks" backlog item was asking
for (that item and the "Mobile-block gap" named here converged on one real piece of work, not two).
`status` (`"default"|"disconnected"|"empty"|"busy"`) picks a sensible default icon/title/description,
all overridable; `action` renders a real retry button the same small-secondary way
`banner`/`header`/`callout` already render theirs; `fullPage` defaults to `true` here (the block's
whole reason to exist is the whole-page case — an inline, one-card failure state is small enough to
just use the real `ErrorBlock` component directly, no block needed). No `icon` override field in the
schema, unlike the real component's own `icon` prop: an arbitrary icon isn't serializable `Block[]`
data, and the per-`status` default already covers the archetype's real use.

**`footer` (wraps `Footer`) shipped** — mirrors how `site-header` already wraps `NavBar` for the top
of a page, now the same exists for the bottom. `label` (a "no more results"-style divider line),
`content` (e.g. copyright), `links`, and `chips` all map straight through to the real component; no
`onLinkClick`/`onChipClick` in the schema (not serializable `Block[]` data) — `links` render as real
`<a href>`s via `renderLink`, same as every other link-bearing block.

Every *other* antd-mobile-derived pattern shipped so far (`NoticeBar`, `Selector`, `NumberKeyboard`,
`ProgressCircle`, `IndexBar`, `ScrollMask`, `Ellipsis`, `FloatingBubble`, `FloatingPanel`) still
landed as a `packages/core` **component** only, not yet promoted into a block — this is still the
actual, honest state of "Mobile Blocks": two, not a rounding error either way, matching this
project's own component/block distinction (`robot.md`'s own worked `GoalTracker` → `TodoItem` +
`goal-tracker` example: a component becomes a block once there's a real, repeatable page-content
shape to compose it into).

**Concrete candidate for the next pass** (named, not designed — no schema/renderer work done here):
- A **numeric-entry/checkout-flow block** composing `Selector`/`NumberKeyboard`/`PinInput` — named
  as a plausible shape, not scoped further.

## The still-separately-tracked items this document doesn't resolve

Two items from the original blocks-documentation-restructuring backlog entry are explicitly **not**
covered here — they were named alongside the Global/Web/Mobile split but are their own separate,
unscoped pieces of work:

- **The "research exception" page pattern** — noted as a Global-block candidate in the original
  backlog entry, not designed here.
- **Dedicated failure-state blocks** (see the Mobile-blocks gap above) — distinct from the
  `ErrorBlock` component already shipped.

## Where this categorization actually lives (not just this document)

A categorization that only exists in a `ref/` planning doc doesn't help a consuming agent picking a
block for a mobile vs. a web page — see `packages/core/robot.md`'s "Building blocks" section, whose
block catalog now names each block's category inline, and `/blocks`' own page, which still groups by
content topic (Navigation, Feedback & content, ...) since that's a different, complementary axis to
browse by.
