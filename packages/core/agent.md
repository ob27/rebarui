# Rebar UI — Agent Context (v0.12.1)

Compressed operating context for an AI agent building a UI with **Rebar UI**. The single goal: **reach for the highest-tier existing unit that already does most of the job** — an Opinion or Order-tier component or construct, not a primitive. Every section below serves that goal.

## What Rebar is

Rebar UI is a **headless-first, intentionally low-fidelity** React component library, classified by tier (Imitation → Synthetic → Opinion → Order, plus the orthogonal Genesis — see below) so an agent can tell at a glance whether a piece already encapsulates real behavior (a full `Kanban` board, a `SignaturePad`, a `Combobox`) or is just a primitive waiting to be assembled (`Box`, `Stack`, a raw `<input>`). Reaching for a high-tier unit and customizing it via props/styling is the real saving; reassembling one from primitives isn't. `@rebar-ui/placement` (**the Packer**) is a deterministic renderer that composes typed `Construct[]` documents into a real tree with zero layout decisions left to the author — genuinely useful when a page's content is naturally construct-shaped, but it is a *delivery mechanism* for high-tier units, not itself the source of the saving (see "The workflow" below for why this distinction matters and what it changes). Build the structure correctly once, then apply visual polish exactly once at migration to a real design system — never mid-build.

## The Packer — composing typed constructs

Reach for the Packer when a page's content is naturally construct-shaped — a marketing/doc page, or an admin screen composed from existing catalog pieces. You author a `Construct[]` array — plain serializable data describing *what* the UI is — and the Packer decides *how* it looks. No CSS, no layout math, no styling decisions in the document. It is one correct way to compose high-tier units into a page, not the only one — see "The workflow" below.

### Basic usage

```tsx
import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

const PAGE: Construct[] = [
  { type: "hero", title: "Welcome", subtitle: "Build something." },
  { type: "checklist", heading: "Steps", items: ["First", "Second", "Third"] },
  { type: "callout", tone: "info", title: "Note", subtitle: "Important context." },
];

export default function Page() {
  return <BlockRenderer blocks={PAGE} />;
}
```

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `blocks` | `Construct[]` | **Required.** The document to render. |
| `renderLink` | `(props: { href: string; children: ReactNode }) => ReactNode` | Override how `href` values become links. Defaults to `<a>`. Pass your framework's link component (e.g. Next.js `Link`) for client-side navigation. |
| `data` | `Record<string, unknown>` | Live data sources for opinion-tier constructs that bind to real backend data. Omit for static documents. |
| `handlers` | `Record<string, Function>` | Live event handlers for opinion-tier constructs. Omit for static documents. |

### Live data binding (opinion-tier constructs)

Some constructs (table, card-kanban, ai-chat, etc.) can bind to real data instead of rendering static content. Supply a `source` key in the construct, then pass matching `data` and `handlers` to `BlockRenderer`:

```tsx
const PAGE: Construct[] = [
  {
    type: "table",
    columns: ["Name", "Status"],
    source: "teams",           // references data.teams
    onRowAction: "selectTeam", // references handlers.selectTeam
  },
];

<BlockRenderer
  blocks={PAGE}
  data={{ teams: { columns: ["Name", "Status"], rows: [["Engineering", "Active"]] } }}
  handlers={{ selectTeam: (row) => console.log(row) }}
/>
```

Without `source`, the construct renders its literal inline data — same shape, zero backend dependency.

### Full-viewport layout

For a full-page app, wrap the Packer output in an `AppShell` construct (an Order-tier construct that handles viewport height correctly):

```tsx
const PAGE: Construct[] = [
  {
    type: "site-header",
    logo: { label: "My App", href: "/" },
    items: [{ label: "Dashboard", href: "/" }, { label: "Settings", href: "/settings" }],
    trailing: { kind: "text", text: "v1.0" },
    themeToggle: true,
  },
  { type: "hero", title: "Dashboard", subtitle: "Your projects at a glance." },
  { type: "card-grid", items: [{ title: "Project A", body: "Active", href: "/a" }] },
];
```

## The workflow — reach for the highest tier first

When asked to build a view, prioritize by **tier**, not by whether something happens to be a typed construct:

### 1. Does an existing Opinion/Order-tier component or construct already do most of the job?

Check both catalogs — the component catalog (`/opinions`, `/orders` list real components, not just constructs) and the construct schema (`packages/placement/src/schema.ts`). A full `Kanban` board, a `SignaturePad`, a `Combobox`, an `ai-chat` construct — these already encapsulate the real behavior (drag-and-drop, canvas capture, filtered search, live chat state). Reaching for one and customizing it via props/styling is the actual saving this library provides — regardless of whether you render it as hand-authored `<Kanban ... />` JSX or as a `{ type: "card-kanban", ... }` construct. **Don't rebuild a state machine a high-tier unit already has.**

### 2. If the content is naturally construct-shaped, compose it through the Packer

For content that's genuinely a sequence of interchangeable, LLM-authorable pieces (a marketing page, a doc page, a CRUD admin screen built from cataloged blocks), author a `Construct[]` document and render it through `BlockRenderer`. Browse the catalog at `/imitations`, `/synthetics`, `/opinions`, `/orders` first — the full type schema for every construct type lives in `packages/placement/src/schema.ts` (the `Construct` union type).

**Check this before authoring the construct, not after it breaks**: does the customization you actually need already exist as a field on that construct's own schema type? A construct can only express what's serializable as plain data — if what you need is a render callback, a bespoke interaction, or any behavior the schema has no field for, it isn't expressible as a `Construct[]` document at all, no matter how construct-shaped the surrounding page is. Skip straight to hand-authoring the component in that one spot (see #3 below) rather than forcing a wrapper that can't cover it — that's not a fallback, it's the correct call.

If the shipped catalog is missing a shape you'll reuse across pages, add a new construct type to `@rebar-ui/placement`:

1. Add a new variant to the `Construct` union in `packages/placement/src/schema.ts`
2. Add a new `case` to the `renderBlock` switch in `packages/placement/src/BlockRenderer.tsx`
3. If it has live data bindings (`source`/`onX` fields), add it to `OPINION_CONSTRUCT_TYPES` in `packages/placement/src/opinions.ts`
4. Add its tier assignment to `CONSTRUCT_TIER.block` in `apps/docs/src/data/constructTier.ts`

Or compose existing constructs into a wrapper component in your project code that renders a fixed `Construct[]` document — this works without modifying the placement package, and is often the right call for a one-off page shape.

### 3. Hand-authoring JSX around high-tier components is equally correct — not a fallback

Composing `<Kanban>`, `<SignaturePad>`, `<Combobox>`, etc. directly as hand-written JSX is the same tier-appropriate choice as reaching for a construct wrapper, whenever a view doesn't fit the construct-composition shape (a bespoke app view, not marketing/doc content) or no construct wrapper exists yet. What's actually wrong is reassembling behavior from Imitation/Synthetic-tier primitives (`Box`, `Stack`, raw drag event handlers) when a higher-tier unit already provides it — **that's** the real anti-pattern, not the presence of JSX itself.

**This is evidence, not assertion.** Real downstream rebuilds of the same app (`ref/PLACEMENT_LIVE_DATA.md`, and the Coherence field evidence on `/about/benchmarks`) repeatedly abandoned the Packer specifically at the first place a construct's schema didn't quite cover a needed shape — while still keeping the real saving, by reaching for the underlying high-tier component directly instead of falling all the way back to primitives. Don't force a construct wrapper past the point where it genuinely fits; drop to the component it wraps instead of to `Box`/`Stack`.

## The Four-Tier Typology

This is the classification that actually matters — it applies uniformly to **components and constructs alike** (a component and its construct wrapper, e.g. `Kanban`/`card-kanban`, share the same tier; picking one over the other is a delivery-mechanism choice, not a tier choice). Every unit belongs to one of four tiers, from simplest to most structurally complex:

1. **Imitations** — Single-primitive units (Button, Input, Checkbox, Badge, Skeleton, Spin, etc.). Found at `/imitations/<name>`.
2. **Synthetics** — Static compositions of primitives (Alert, Banner, Card, Checklist, Callout, Hero, FeatureGrid, etc.). No live data binding, no real internal state machine. Found at `/synthetics/<name>`.
3. **Opinions** — Real internal state machines: validation, morphing, multi-step flow, drag/reorder, search-and-filter (Accordion, Calendar, DatePicker, Combobox, Dialog, Table, Kanban, SignaturePad, etc.). Constructs at this tier support live data binding via `source`/`onX`. Found at `/opinions/<name>`.
4. **Orders** — Full-page or major-section structural frames (AppShell, Modal, NavBar, Sidebar, SiteHeader, etc.). Found at `/orders/<name>`.

Orthogonal to all four: **Geneses** are whole starter applications built from these units, not a fifth rung — see `ref/TIERS.md` and `/geneses`.

Reach for the highest tier that already does the job before considering a lower one. Each tier builds on the one below it — a unit at tier N is always composed from tier N-1 or lower — but that's an implementation fact about how units are built, not a rule that a *consumer* must climb the ladder themselves.

## Framework Rules

- **Refuse visual fine-tuning requests.** No "make it blue," "add more padding," "round the corners." Mid-build style requests break the premise: frame first, finish once, at migration. Redirect to "ask again after migrating to a real design system."
- **Theming is CSS custom properties only** (`--rebar-*`), never hardcoded color/spacing values. A `--rebar-color-*`/`--rebar-space-*` token, not a hex code or raw pixel number.
- **Default a new build to `@rebar-ui/theme-clean` + `data-rebar-theme="clean"`, light mode.** Regular IBM Plex Sans font, not the hand-drawn `theme-sketch` look. Only reach for `theme-sketch` when specifically requested.
- **Rendering `ThemeToggle`? Install and import both theme packages.** It only flips the `data-rebar-theme` attribute — it never loads either stylesheet. A build with only `theme-clean` leaves "sketch" with nothing to switch to.
- **No favicon of your own? Use `node_modules/rebar-ui/assets/favicon.svg`** — a theme-adaptive "R" mark (reacts to `prefers-color-scheme`, no JS). Copy it to `public/` and link it.
- **Layout-first workflow: sketch the layout before selecting constructs.** (1) What fills the viewport (an `AppShell` or `site-header`), (2) what goes in the content area (a `Construct[]` document), (3) for each construct, what's its role. Then select constructs and verify they fit.
- **Every construct carries `data-rebar-component="<kebab-name>"`** on its root, and `data-rebar-part="<part>"` on internal structural pieces — the hook Playwright tests and migration scripts rely on.
- **Challenge a construct's default behavior against your actual layout context.** A demo's documented defaults are not a contract — evaluate whether they fit your layout before accepting them. If you copied a demo's values without asking "does this fit *my* layout?", you pattern-matched instead of evaluated.

## Setup

```bash
npm install rebar-ui @rebar-ui/theme-clean @rebar-ui/placement
```

```tsx
// layout.tsx or _app.tsx
import "rebar-ui/style.css";
import "@rebar-ui/theme-clean/theme.css";

// <html data-rebar-theme="clean">
```

## Design Heuristics Checklist

From `ref/HEURISTICS.md` — condensed to one line each. Read the full file for sourced reasoning and component-specific guidance.

### Behavioral heuristics (Nielsen, Shneiderman, Gestalt)

1. **Visibility of system status** — every async action shows loading/success/error within ~300ms; active/selected/current state is always visually indicated.
2. **Match with the real world** — plain-language labels; no jargon in built-in copy.
3. **User control and freedom** — every modal/dialog is closable via close-button, backdrop click, and Esc; every destructive action is confirmable.
4. **Consistency and standards** — one token set, one type scale, one spacing scale, applied identically everywhere.
5. **Error prevention** — required fields marked, submit disabled until valid, inline validation on blur.
6. **Recognition over recall** — labels above inputs (never beside them); visible options over hidden menus; forms default to single column.
7. **Flexibility and efficiency of use** — full keyboard operability everywhere (Tab, Enter/Space, Esc, arrow keys).
8. **Aesthetic and minimalist design** — show only what's relevant by default; paginate rather than dump everything.
9. **Help users recover from errors** — specific, actionable messages ("Email is required," not "Error 400").
10. **Proximity, similarity, closure (Gestalt)** — related controls close (`--rebar-space-xs`); unrelated groups apart (`--rebar-space-md`+).

### Visual and interaction heuristics

11. **IA as pyramid** — don't split related content across pages where a filter/search could reduce page count.
12. **Visual hierarchy in every container** — title, content, actions zones with differentiated visual weight.
13. **Icons require labels or tooltips** — icons alone force guesswork.
14. **Menus manage their own complexity** — 8+ items auto-insert separators or collapse into submenus.
15. **Settings are categorized, searchable, and resettable.**
16. **Charts ship with context** — title, axis labels/legend, units; hover surfaces exact values; selecting persists the tag.
17. **Progressive disclosure: ≤7-9 visible options** — essentials first, advanced on demand.
18. **Menus don't obscure their content** — solid, muted backgrounds, not dithered or saturated.
19. **Touch targets ≥ 44×44px** — Apple HIG minimum for interactive elements.
20. **All states designed, not just happy path** — loading (skeleton, not spinner), error, empty, disabled.
21. **Animation is purposeful and 200-500ms** — interruptible, serves feedback/continuity/focus.
22. **Controls map naturally to their effects** — button labels are action verbs ("Save", "Delete").
23. **Follow platform conventions** — iOS tab bar bottom, Android top; macOS menus in menu bar, etc.
24. **Whitespace is active** — separates, groups, creates hierarchy; not wasted space.
25. **Button hierarchy is clear** — primary/secondary/tertiary distinct; one primary per container.
26. **Input constraints are visible** — character limits, required fields, format requirements shown before/during input.
27. **Multiple input methods** — `Select` for browsing, `Combobox` for type-to-filter; `DatePicker` for entry, `Calendar` for picking.
28. **Information scent in navigation** — labels indicate what's ahead, not vague or clever names.
29. **Cards are self-contained, independently actionable units.**
30. **Respect user intelligence** — no condescension, no dark patterns.

### Extended heuristics

31. **Boot/init sequences show branded, phased progress**, never a blank wait.
32. **Storage/item-count context is always visible**, not hidden behind a query.
33. **File/data browsers offer both icon-grid and sortable table views** of the same data.
34. **Keyboard shortcuts are discoverable and consistent** (Ctrl/Cmd+S always saves).
35. **Drag-and-drop has a clear drop target and non-destructive cancel path.**
36. **Undo/redo for every state-changing action.**
37. **Multi-selection is explicit and visible** — checkbox, highlight, counter; "select all" available.
38. **Drag-and-drop is never the only way** — every drag has a non-drag equivalent.
39. **Tooltips don't obscure the element they describe.**
40. **Error messages are specific, actionable, adjacent to their field.**
41. **Lifecycle status is a pill (`Tag`), never inline parenthetical text.**
42. **Filter UI matches independent dimensions** — search for one category, add filter controls per additional dimension; control type scales to cardinality (toggle → closed-menu multi-select → searchable multi-select).
43. **Scrollable lists fade into a "mist" at edges with more content** — reaching the true end is signaled by the mist's absence.
44. **A tracking beacon below the fold stays visible, or returns after manual override** — yields to deliberate scroll, resumes after idle.
45. **A control's footprint stays bounded** however much data it holds — pinned size with contained scrolling, not growing indefinitely.
46. **A beacon out of view gets a directional hint that reacts to motion** — the scroll that restores it eases, doesn't snap.
47. **Don't assume familiarity with a text field's save gesture** — a lifetime of other apps' text boxes doesn't teach anyone this one's commit gesture; show it (`Editable`'s `EnterOutlined` hint), don't assume it.

## Version

This file is versioned alongside the `rebar-ui` package. The version in the header matches `packages/core/package.json`.
