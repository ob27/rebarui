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
  theme-sketch/    # default sketch theme: fonts, sketchy borders, grayscale tokens
  theme-clean/     # plain production-safe baseline theme
  devtools/        # dev-only floating panel — kept out of prod via a consumer-side dynamic import, see below
  adapters/
    antd/          # @rebar-ui/migrate-antd — prop-map + codemod, first adapter template
apps/
  docs/            # marketing + component reference + migration guide (Next.js + MDX — see MARKETING_SITE.md)
  playground/      # deeper, multi-component live sketch <-> clean toggle demo
```

`core` depends on Radix primitives + React Hook Form (for `Form`). `theme-*` packages are pure CSS
(custom properties + a stylesheet), no JS. `devtools` depends on `core`'s internal usage registry
but is an entirely separate import — an app that never imports `@rebar-ui/devtools` pays zero cost
for it.

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

No component ever silently rewrites a developer-authored value (e.g. "rounds" a stray `margin:
13px` to `16px`). Deviations from the token scale are surfaced as **dev-mode console warnings**
(or an optional ESLint rule scanning for raw pixel values in Rebar component usage) — visible,
not corrected out from under the developer. This matches Rebar's own heuristic of "visibility of
system status" instead of contradicting it.

## Migration adapters

Pattern, not a one-off: an adapter package exports (a) a prop-mapping table from Rebar's generic
prop names to the target library's names, and (b) a jscodeshift codemod that rewrites imports,
flattens compositions (Radix-style nested composition → target's monolithic props), and
preserves every `data-*`/`aria-*` attribute verbatim on the migrated node.

`@rebar-ui/migrate-antd` is the first instance, built to prove the pattern:
- `RebarModal` → `Modal` (`open`/`onOpenChange` unchanged — no mapping needed).
- `RebarButton variant="destructive"` → `Button danger`.
- `RebarForm`/`RebarFormItem` → `Form`/`Form.Item`, React Hook Form state bridged to AntD's form
  store or dropped in favor of AntD's own `Form` instance, decided per-project.

A second adapter (`migrate-mui` or `migrate-shadcn`) is deferred, but the pattern above should
make it a template exercise, not a redesign — that's the test of whether this architecture holds
up.

`MIGRATION_PROMPT.md` (repo root) is the human/agent-facing version of the same idea for cases
where a full codemod doesn't exist yet for the target: a prompt instructing an LLM coding agent to
perform the same rename-and-flatten transform, with explicit instructions to preserve
`data-rebar-*` and ARIA output.

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
