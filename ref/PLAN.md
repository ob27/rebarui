---
title: Rebar UI — Plan
status: living document
---

# Rebar UI — Plan

Rebar is a headless-first React component library that is intentionally low-fidelity
("Balsamiq-as-code") by default: fully functional, accessible, and Playwright-navigable, but
visually barebones so the developer's attention stays on logic and data flow, not pixels. Every
visual property is a CSS variable, so a later pass — by hand or by an LLM — can re-skin the whole
app into a real design system without touching component structure, props, or tests.

Read [ASSESSMENT.md](ASSESSMENT.md) first — it explains *why* this plan diverges from the original
brainstorm in a few places (mainly: no library-specific coupling in the core API, no fabricated
token/cost metrics, no silent runtime auto-correction).

## Vision, one paragraph

A developer scaffolds a new internal tool, writes `<RebarForm>`, `<RebarTable>`,
`<RebarModal>` against a sketchy, grayscale, hand-drawn-bordered UI, ships it fast because they
never made a single visual decision, and when the tool needs to look like production software,
they run a migration prompt (or an adapter codemod) that swaps the theme — and, if targeting a
specific library, the components — while every Playwright test written against
`data-rebar-*`/ARIA roles keeps passing untouched.

## The core thesis: cheaper in total, not just faster upfront

This holds even when the target design system is already known, and it's a claim about *total*
cost, not just initial velocity — especially with an AI agent doing the building. Building
directly against a real, opinionated design system from the start means every round of logic
iteration re-pays a styling/constraint tax: the agent has to reconcile each business-logic change
against that library's component shapes, prop conventions, and visual rules on every single pass.
Building headless and low-fidelity first lets logic settle fast and cheap — no visual decisions in
the loop at all — and the "make it pretty" pass happens exactly once, as a bounded reskin (a
codemod or the migration prompt), after the logic is done, rather than being re-paid on every
iteration along the way. "You already know your target, so just build against it directly" is
the wrong conclusion to draw from that fact — see `apps/docs`'s own Introduction page
(`/docs`) for the public-facing version of this argument.

## Scope for v0.1 (first npm publish)

Deliberately small. The goal of v0.1 is proving the sketch→clean re-skin story end-to-end on a
handful of components, not covering every widget a design system eventually needs.

**Components:** `Box`/`Stack` (layout primitives), `Text`/`Heading`, `Button`, `Input`,
`Card`, `Alert`, `Dialog` (modal), `Tabs`, `Form`/`FormItem` (thin wrapper over React Hook Form).

**Not in v0.1:** `Table`/`DataGrid`, `Dropdown`/`Menu`, `DatePicker`, `Select`, graph/node-editor
wrapper (React Flow), Vue/Svelte ports, the AntD adapter package. These are real and planned (see
Phase 5+) but come after the core loop is proven.

## Phases

### Phase 0 — Foundations
- Monorepo scaffolding (pnpm workspaces + Turborepo, pending confirmation — see
  [ASSESSMENT.md open questions](ASSESSMENT.md#open-questions-for-the-user)).
- Package layout per [ARCHITECTURE.md](ARCHITECTURE.md#package-layout).
- Build tooling: `tsup` per package, `vitest` for unit tests, `@playwright/test` for
  component/E2E, `changesets` for versioning and npm publish.
- Lint/format baseline (ESLint + Prettier), CI on GitHub Actions (typecheck, test, build on every
  PR).

### Phase 1 — Core primitives
- `Box`, `Stack`, `Text`, `Heading`, `Button`, `Input`, `Card`, `Alert`.
- Every component: wraps a real semantic HTML element or Radix primitive, carries
  `data-rebar-component`/`data-rebar-part`/`data-rebar-state` attributes, styled purely via
  `--rebar-*` custom properties, zero hardcoded pixel/color values in component source.
- Token set defined per [HEURISTICS.md](HEURISTICS.md) (spacing, type scale, color, radius).

### Phase 2 — Composite components
- `Dialog` (Radix Dialog under the hood), `Tabs` (Radix Tabs), `Form`/`FormItem` (React Hook Form
  under the hood, AntD-*shaped* controlled API but with Rebar's own generic prop names — see
  [ARCHITECTURE.md](ARCHITECTURE.md#component-api-conventions)).
- Accessibility acceptance bar for every composite component: full keyboard operability (Tab,
  Enter/Space, Esc, arrow keys where applicable), verified by a Playwright keyboard-only test
  before merge.

### Phase 3 — Theming: sketch, clean, dark
- Two shipped themes: `sketch` (default — hand-drawn borders via CSS border-radius trick,
  Kalam/Balsamiq Sans font, grayscale) and `clean` (a plain, low-decoration production-safe
  baseline — not a specific brand, just "not sketchy," useful as the immediate next step before a
  full custom re-skin).
- Dark mode as an orthogonal `data-theme` attribute, not a third theme — works with both
  `sketch` and `clean`.
- Theme switching is a single `data-rebar-theme`/`data-theme` attribute swap at the root; no
  JS-driven per-component restyling at runtime.

### Phase 4 — DevTools panel — done
- Shipped as `@rebar-ui/devtools`, bottom-corner floating toggle per the original brainstorm.
  Keeping it out of production requires the **consumer** to gate the import with a dynamic
  `import()`, not just the internal `NODE_ENV` check — verified by grepping a real production
  build; see [ARCHITECTURE.md](ARCHITECTURE.md#devtools-panel) for the confirmed mechanism and
  why the naive approach doesn't work with Turbopack.
- Shows **real, computed** data only: component-instance counts by type on the current page
  (via a `MutationObserver` over `data-rebar-component`, not app-level instrumentation),
  sketch/clean/dark-mode toggles, an 8pt-grid overlay, a component inspector (hover to see
  `data-rebar-*` metadata), and a bucketed migration-effort estimate (Low/Medium/High — see
  [ASSESSMENT.md](ASSESSMENT.md#keep-but-change) for why this replaces the original fabricated
  token/dollar counter) plus a JSON export of the same.
- No separate "overview page" — a route would have to assume the host app dedicates one to it,
  which doesn't hold generally; the popover is the whole surface for v0.1.

### Phase 5 — Migration tooling — done (AntD adapter + prompt; playground still open)
- `MIGRATION_PROMPT.md` shipped at the repo root: the literal prompt text a developer pastes into
  their coding agent, covering both "no adapter exists yet for your target" and "finish what the
  codemod below deliberately left alone."
- `@rebar-ui/migrate-antd` — first concrete adapter, a real jscodeshift codemod (not just a
  prop-mapping table on paper): Button/Input size+variant remapping, Alert's `title`→`message`,
  `Dialog`→`Modal` with `onOpenChange`→`onCancel` flagged for review and `description` promoted
  into a child, `FormItem`→`Form.Item` with `required`→`rules` and render-prop unwrapping.
  `Box`/`Stack`/`Text`/`Heading`/`Tabs` deliberately left unmigrated (no direct AntD equivalent,
  or a composition shape too different to flatten safely at the syntax level — see the package
  README) and handed off to `MIGRATION_PROMPT.md` instead. 7 tests, all passing.
  **Dogfooded against real code** (`apps/docs/src/app/page.tsx`, dry-run), which caught a real
  bug the synthetic test fixtures missed: naively renaming `variant`→`type` collided with a
  Button's own native `type="submit"`, since AntD's `type` prop means visual variant, not HTML
  button type — fixed by moving the native value to AntD's `htmlType` prop first. Worth
  remembering when adding the next adapter: run it against real code, not just fixtures, before
  calling it done.
- Playground app (a deeper, multi-component "build a whole mock screen and toggle it" demo, per
  [MARKETING_SITE.md](MARKETING_SITE.md)) — still open, folded into Phase 6 since it's really
  part of the docs/marketing site's scope.

### Phase 6 — Docs site + launch
- Docs site per [MARKETING_SITE.md](MARKETING_SITE.md) (Next.js + MDX, not the earlier
  Vite+MDX guess — see that doc for why), deployed to Vercel: getting started, per-component
  reference pages with live previews, heuristics/defaults explained, migration guide. The site
  itself is built with real Rebar components, shipped in production/clean mode with the dev layer
  off like any consuming app — dogfooding is the marketing claim ("this site is Rebar, dev layer
  off"), not a bespoke visitor-facing global toggle. Small scoped demo panels on the homepage
  illustrate the sketch⇄clean mechanism locally (see MARKETING_SITE.md).
- npm publish of `rebar-ui` (or scoped `@rebar-ui/core` — naming TBD alongside package layout).
- README with elevator pitch, install command, link to docs.
- Launch checklist (Reddit r/reactjs & r/webdev, Show HN, Twitter/X, Dev.to) — low priority, do
  once the library itself is solid.

### Phase 7 — AntD v5 component parity (new scope, added post-v0.1)

Superseded the original "not chasing feature parity with AntD" non-goal below — the user
explicitly asked for Rebar equivalents of AntD v5's full component catalog, for two reasons: (1)
completing the migration pathway, since `@rebar-ui/migrate-antd` currently only handles the ~8
components Rebar has (everything else falls to `MIGRATION_PROMPT.md`'s manual/LLM path); (2) the
expanded library becomes marketing content in its own right — a showcase on the docs site of
"every AntD component, sketched." This is a genuinely large undertaking (40+ components) — not
attempted in one sitting. Sequenced by how commonly each is used and how directly Radix already
covers it:

**Tier 1 — common, Radix has a direct primitive:** `Checkbox`, `Radio`/`RadioGroup`, `Switch`,
`Select` (Radix Select), `Tooltip` (Radix Tooltip), `Popover` (Radix Popover), `Dropdown`/`Menu`
(Radix DropdownMenu), `Slider` (Radix Slider), `Progress` (Radix Progress), `Avatar` (Radix
Avatar), `Accordion`/`Collapse` (Radix Accordion), `Toast`/AntD's `Message`/`Notification` (Radix
Toast).

**Tier 2 — common, no direct Radix primitive but moderate to build:** `Tag`, `Badge`, `Divider`,
`Skeleton`, `Breadcrumb`, `Empty`, `Spin`, `Pagination`, `Steps`, `Drawer` (a Dialog variant —
slides from an edge instead of centering), `DatePicker` (genuinely fiddly — calendar logic,
locale, range mode).

**Tier 3 — complex or specialized, lowest priority:** `Table` (the biggest single undertaking —
sorting, filtering, virtualization expectations), `Tree`, `TreeSelect`, `Cascader`, `Transfer`,
`Upload`, `AutoComplete`, `Mentions`, `InputNumber`, `Rate`, `ColorPicker`, `Carousel`, `Calendar`,
`Timeline`, `Descriptions`, `Statistic`, `Result`, `Image`, `QRCode`, `Watermark`, `Anchor`,
`Affix`, `FloatButton`, `Segmented`, `Tour`, `Splitter`.

Already covered (Rebar's own naming, not AntD's): `Button`, `Card`, `Alert`, `Dialog`↔`Modal`,
`Tabs`, `Form`/`FormItem`, `Input`, `Box`/`Stack` (≈ AntD `Layout`/`Space`/`Flex`),
`Text`/`Heading` (≈ AntD `Typography`).

Each new component follows the same bar as everything built so far: real tests (role, keyboard
operability, `data-rebar-*` attributes), a props table entry (automatic, via
`apps/docs/scripts/generate-props.mjs` — no hand-maintained table to keep in sync), a component
reference page, and — once it has a plausible AntD mapping — an entry in
`@rebar-ui/migrate-antd`'s transform, verified by dogfooding against real usage, not just its own
fixtures (per the `htmlType` lesson from Phase 5).

## Non-goals

- Not building a Vue/Svelte port in v0.1 — noted in docs as a community-contribution
  opportunity if it ever comes up, per the brainstorm's own distribution philosophy.
- Not shipping fabricated cost/token metrics as if they were measured (see ASSESSMENT.md).

## How this project's planning works

All planning documents for Rebar live in `ref/` (this file, `ASSESSMENT.md`,
`ARCHITECTURE.md`, `HEURISTICS.md`). Update them in place as decisions change rather than leaving
stale plans behind — this is a living plan, not a changelog.
