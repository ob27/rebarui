---
title: Rebar UI — Architecture
status: living document
---

# Rebar UI — Architecture

Technical decisions supporting [PLAN.md](PLAN.md). See [ASSESSMENT.md](ASSESSMENT.md) for the
reasoning behind the departures from the original brainstorm.

## Package layout

Monorepo (pnpm workspaces + Turborepo, pending confirmation):

```
packages/
  core/            # components + primitives, wraps Radix, ships CSS-var-only styles
  placement/       # @rebar-ui/placement — the placement layer: block schema + BlockRenderer, see below
  theme-sketch/    # default sketch theme: fonts, sketchy borders, grayscale tokens
  theme-clean/     # plain production-safe baseline theme
  devtools/        # dev-only floating panel — kept out of prod via a consumer-side dynamic import, see below
  adapters/
    antd/          # @rebar-ui/migrate-antd — prop-map + codemod, first adapter template
apps/
  docs/            # marketing + component reference + migration guide (Next.js + MDX — see MARKETING_SITE.md)
  playground/      # deeper, multi-component live sketch <-> clean toggle demo
```

`core` depends on Radix primitives + React Hook Form (for `Form`). `placement` depends only on
`core` (it renders blocks using `core`'s own components) — it's a separate package specifically so
a consumer who never wants the placement layer (just the atomic components) doesn't pay for it.
`theme-*` packages are pure CSS (custom properties + a stylesheet), no JS. `devtools` depends on
`core`'s internal usage registry but is an entirely separate import — an app that never imports
`@rebar-ui/devtools` pays zero cost
for it.

## The placement layer — `@rebar-ui/placement`

Rebar UI is meant to be built with by an LLM through a small procedural placement layer, not by
hand-authoring `Stack`/`Box` JSX directly: the model writes a compact typed document naming a
handful of pre-built composite archetypes — called **blocks** — and a deterministic renderer
(`BlockRenderer`, built from `core`'s own components) turns that document into the actual tree. The
model never decides layout — direction, gap, nesting — only which block and what content.

Two heuristics do the actual layout work, so the model never has to:

- **Anatomical order** — within any one block, its internal parts always render in the same fixed,
  predetermined sequence, head to toe. A `callout` is always icon → title → subtitle, top to
  bottom, every time; a `banner` is always icon → text → trailing action, left to right. The model
  fills in the slots' content; it never decides which slot comes first.
- **The magnetic heuristic** — at the document level, blocks are simply listed in the order the
  model wants them to appear, and the renderer "snaps" each one into the stack in that sequence —
  like magnets pulling into a line, not a grid the model has to compute coordinates for. Supplying
  order is the only placement decision the model makes; no `x`/`y`, no `flex`/`grid` value, ever.

**Status: shipped as `@rebar-ui/placement`, dogfooded on this project's own marketing site
(`apps/docs`)** — not just a benchmark prototype anymore. `BlockRenderer` and its six current block
types (`header`, `banner`, `checklist`, `callout`, `feature-grid`, `pillar-grid`) live in
`packages/placement/src`; the homepage's feature-card row and three-pillars grid
(`apps/docs/src/app/page.tsx`) are real `BlockRenderer` output, not hand-authored `Stack`/`Card`
JSX — proof-by-existence that the mechanism holds up outside the one benchmark component it was
validated on, per the dogfooding principle already stated in
[MARKETING_SITE.md](MARKETING_SITE.md#what-to-change-and-why).

The evidence for the underlying mechanism lives in
[`/benchmarks`](../apps/docs/src/app/benchmarks/page.tsx): a hand-authored-JSX version of Rebar
lost to AntD by ~54% in token cost; the placement-layer version not only closed that gap but beat
AntD outright — cheaper, faster wall-clock, and with visual output that is (with a properly scoped
prompt) pixel-identical run to run, versus AntD's real run-to-run drift. That result held up again
on an image-driven build (read a screenshot, produce the same document), once the prompt spelled
out the document schema instead of making the agent discover it by reading source files.

What's still open: the three archetypes measured in that benchmark (`banner`/`checklist`/`callout`)
were chosen to fit one benchmark component; `feature-grid`/`pillar-grid` were added to cover this
project's own marketing copy and haven't been measured in isolation the same way. Whether the block
vocabulary keeps paying off as it grows to cover arbitrary UI, and whether DOM order (and therefore
accessibility — WCAG 2.1 SC 1.3.2) stays correct as more blocks are added, are the honest open
questions, not yet answered by more than "it worked for these six."

**Why this is the intended default rather than an optional mode:** most of the token cost of an
LLM building UI is paid up front, during the early, high-volatility phase of a project — flows,
layouts, and information architecture are still being figured out, and every design decision made
against a fully-styled, opinionated target library has to be re-justified on every iteration. That
is exactly the phase where a low-fidelity, placement-driven build is cheapest and most consistent:
there is nothing visual to re-litigate, so iteration is fast and (per the benchmark above) far more
predictable in cost. Once a project's UI has actually stabilized — the flows are settled, it is
heading to production — the adapter/codemod migration path (see "Migration adapters" below) is the
bounded, one-time cost of moving to a real, brand-customized design system for long-term use. Rebar
is not meant to compete with a production design system on visual fidelity; it is meant to be the
cheapest way to iterate before you need one.

## Component API conventions

Core API uses its own consistent conventions rather than mimicking one specific target library
(see [ASSESSMENT.md](ASSESSMENT.md#keep-but-change) for why):

- Controlled visibility: `open` / `onOpenChange` (converged convention across Radix, MUI, AntD —
  safe to use natively, not a library-specific borrowing).
- Emphasis: `variant="primary" | "secondary" | "tertiary" | "destructive"` (not AntD's `danger`
  boolean — `variant` is the more universal term across Radix-based and Chakra-style libraries).
- Sizing: `size="sm" | "md" | "lg"`.
- Loading: `loading={boolean}` on interactive components.
- Every component accepts and forwards arbitrary `data-*` and `aria-*` props to its root DOM node
  — required so `data-rebar-*` and any project-specific test IDs survive both styling changes and
  future adapter codemods.

### The `data-rebar-*` namespace

```tsx
<button
  data-rebar-component="button"
  data-rebar-variant="primary"
  data-rebar-state={loading ? "loading" : "idle"}
>
```

- `data-rebar-component`: stable identity of which Rebar component rendered this node. Never
  changes across theme or variant.
- `data-rebar-part`: for compound components, which internal part this node is (e.g. `dialog`'s
  `title`, `trigger`, `content`).
- `data-rebar-state`: current interaction state (`open`/`closed`, `checked`/`unchecked`,
  `loading`/`idle`), mirroring Radix's own `data-state` where Radix already provides one (don't
  duplicate — read Radix's `data-state` directly when it exists).

Playwright guidance shipped in docs: prefer `getByRole` first (works identically pre- and
post-migration because Radix/AntD are both fully ARIA-compliant); fall back to
`[data-rebar-component="..."]` only when a role-based query is ambiguous or the target library's
role output can't be trusted yet.

## Theming mechanism

All visual values are CSS custom properties, scoped under a `--rebar-` prefix, defined once in
`theme-sketch`/`theme-clean` and consumed by `core`'s stylesheets — never written as literal
values inside a component's CSS. Theme switching is:

```html
<html data-rebar-theme="sketch" data-theme="dark">
```

A single attribute toggle on the root element; no per-component JS re-render needed for a theme
change, no runtime style mutation. Dark mode is an orthogonal attribute so it composes with either
theme.

**Theme rules must scope to their own attribute selector only — never also to bare `:root`.**
An earlier version of `theme-sketch` matched `:root, [data-rebar-theme="sketch"]` in one rule, to
make sketch "the default" even with no attribute set. That meant sketch's tokens always applied
at the root regardless of which theme was actually active, and switching to
`data-rebar-theme="clean"` on the same element came down to an equal-specificity, source-order
tiebreak between `theme-sketch`'s and `theme-clean`'s CSS — which broke in practice (clicking
"Clean" didn't change the font; Turbopack's CSS bundling doesn't guarantee the import-order
assumption that tiebreak depended on). Fixed by scoping every theme rule to only its own explicit
`[data-rebar-theme="..."]` (and `[data-theme="dark"]`) selector, never `:root` — an app with no
theme attribute set at all now falls back to `core`'s own inline `var(--x, fallback)` values
rather than silently becoming "sketch." Getting-started docs already instruct setting the
attribute explicitly, so this doesn't change the documented setup path, only removes an
undocumented, fragile implicit default.

No component ever silently rewrites a developer-authored value (e.g. "rounds" a stray `margin:
13px` to `16px`). Deviations from the token scale are surfaced as **dev-mode console warnings**
(or an optional ESLint rule scanning for raw pixel values in Rebar component usage) — visible,
not corrected out from under the developer. This matches Rebar's own heuristic of "visibility of
system status" instead of contradicting it.

## Migration adapters

Pattern, not a one-off: an adapter package (`packages/adapters/<name>`, published as
`@rebar-ui/migrate-<name>`) ships a jscodeshift codemod that partitions a file's `rebar-ui`
imports into "has a target equivalent" (moved to the target library's import, renamed/flattened
as needed) and "doesn't" (left importing from `rebar-ui`, for `MIGRATION_PROMPT.md` or a manual
pass to handle) — never a blind whole-file import-source swap, since not every Rebar component
has a target equivalent.

`@rebar-ui/migrate-antd` is the first instance, built and actually verified, not just sketched:
- `Dialog` → `Modal`: `open`/`title`/`footer` unchanged; `onOpenChange` → `onCancel`, flagged
  with an inline review comment (`AntD's onCancel takes no argument, unlike onOpenChange(open:
  boolean)`) rather than silently assumed compatible — the original plan here was wrong until
  actually built. `description` (a prop `Modal` doesn't have) is promoted into a child instead of
  silently dropped.
- `Button`: `variant="destructive"` → `danger`; `variant="primary"|"secondary"|"tertiary"` →
  `type="primary"|"default"|"text"`; `size="sm"|"md"|"lg"` → `"small"|"middle"|"large"`.
  **A native `type` (e.g. `type="submit"`) is moved to AntD's `htmlType` prop first** — AntD's
  own `type` means visual variant, colliding with Rebar's native pass-through meaning. This was
  found by dogfooding the codemod against `apps/docs/src/app/page.tsx`, not by reasoning about it
  in advance; the synthetic test fixtures alone didn't catch it. Take this as the standing bar:
  run a new adapter against real code before considering it done, not just its own unit tests.
- `FormItem` → `Form.Item`: `required` kept, plus a generated `rules={[{ required: true, message:
  ... }]}` alongside it (AntD's actual validation lives in `rules`). The render-prop children
  pattern (`{(field) => <Input {...field} />}`) is unwrapped to a plain child when it's a single
  arrow function returning one JSX element, since `Form.Item` clones a direct child rather than
  calling a render function.
- Deliberately **not** migrated: `Box`/`Stack`/`Text`/`Heading` (no direct AntD equivalent) and
  `Tabs`/`Tab`/`TabList`/`TabPanel` (AntD's items-array shape isn't a safe syntax-level flatten —
  needs semantic understanding of which panel pairs with which tab). These stay importing from
  `rebar-ui` and get a note pointing at `MIGRATION_PROMPT.md`.

Tested via jscodeshift's own `applyTransform` test helper against inline fixtures (7 tests,
`packages/adapters/antd/src/test/transform.test.ts`), covering every case above including the
`htmlType` regression.

A second adapter (`migrate-mui` or `migrate-shadcn`) is deferred, but the pattern above should
make it a template exercise, not a redesign — that's the test of whether this architecture holds
up.

`MIGRATION_PROMPT.md` (repo root) is the human/agent-facing complement, for components no
codemod exists for yet (or ever will, if the shape is too different to automate safely) and for
resolving the `rebar-migrate:` review comments a codemod like this one leaves behind.

## DevTools panel

Shipped as its own package, `@rebar-ui/devtools` (`<RebarDevTools />`), so an app that never
imports it pays nothing.

**The `NODE_ENV==='development'` check inside the component is not sufficient on its own to keep
it out of production bundles** — verified empirically, not assumed: a production build of
`apps/docs` with a plain `import { RebarDevTools } from "@rebar-ui/devtools"` still shipped the
panel's markup strings and its `MutationObserver`-based counting logic in the client chunks.
Turbopack (and bundlers generally) will fold a literal `process.env.NODE_ENV` comparison in
first-party app code, but does not reliably extend that constant-folding into bundled
`node_modules` code — so the internal early-return never becomes bundler-visible dead code from
the consuming app's side.

The reliable pattern, and the one `apps/docs` actually uses (see
`apps/docs/src/components/DevToolsMount.tsx`): the environment check happens **in the consuming
app's own code**, gating a dynamic `import()` of the package (and its stylesheet) rather than a
static top-level import:

```tsx
"use client";
import dynamic from "next/dynamic";

const RebarDevTools =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@rebar-ui/devtools").then((m) => m.RebarDevTools), { ssr: false })
    : () => null;
```

Because the check is evaluated in code the app's own bundler treats as first-party, the dead
branch (and therefore the `import()` call inside it) is actually eliminated in production —
confirmed by re-grepping the production build afterward and finding nothing. This is the
documented, recommended way to mount `RebarDevTools`; the internal `NODE_ENV` check stays as
defense-in-depth (so `forceEnabled` tests and non-bundled usage still behave correctly), not as
the primary guarantee.

Internally, component counts are **not** tracked via app-level instrumentation (no context
provider every `core` component has to call into) — the panel queries the live DOM for
`[data-rebar-component]` elements via a `MutationObserver`-backed hook
(`useComponentCounts`), scanning only while the panel is open. This is simpler than threading a
usage-registry context through every component and requires zero changes to `packages/core`. The
panel shows:

- Live component-instance counts by type, current page (real, queried — not estimated).
- Sketch/clean theme radio + dark-mode toggle (writes the `data-rebar-theme`/`data-theme`
  attributes described above).
- 8pt-grid overlay (a fixed, pointer-events-none absolutely positioned grid).
- Component inspector (hover any node with `data-rebar-component` to see its metadata in a
  floating tooltip).
- A **bucketed migration-effort estimate** — Low/Medium/High from a weighted score over
  simple/medium/complex component counts (`estimateMigrationEffort`). Explicitly not a token or
  dollar figure (see [ASSESSMENT.md](ASSESSMENT.md#keep-but-change)) — the exported JSON report
  labels it explicitly as "not a measured cost."
- Export report (JSON) — downloads the real counts + effort estimate. No separate "overview page"
  route: a full-page view would require assuming the host app has a route to dedicate to it,
  which doesn't hold across arbitrary consuming apps, so the popover itself is the whole surface
  for v0.1.

## Testing strategy

- Unit tests (`vitest`) for token/theme logic, prop-mapping tables, codemods.
- Component tests (`@playwright/test` component testing or Testing Library) for every component:
  render, keyboard operability, ARIA role/name assertions.
- A dedicated "survives re-skin" test: render a component tree under `theme-sketch`, snapshot its
  `data-rebar-*`/ARIA output, re-render under `theme-clean`, assert the same output — this is the
  automated proof of the core value proposition and should exist before v0.1 ships.
