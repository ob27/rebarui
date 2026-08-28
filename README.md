# Rebar UI

Headless-first, intentionally low-fidelity ("Balsamiq-as-code") React components. Fully
functional and accessible by default, styled entirely through CSS variables, so a later pass —
by hand or by an LLM — can re-skin an app built with Rebar into a real design system without
touching component structure, props, or tests.

Planning lives in [`ref/`](ref) — start with [`ref/PLAN.md`](ref/PLAN.md).

## Packages

- [`packages/core`](packages/core) (`rebar-ui` on npm) — the components.
- [`packages/theme-sketch`](packages/theme-sketch) (`@rebar-ui/theme-sketch`) — the default
  hand-drawn, low-fidelity theme.
- [`packages/theme-clean`](packages/theme-clean) (`@rebar-ui/theme-clean`) — a plain,
  production-safe baseline theme.

## Dev

```
pnpm install
pnpm run build      # build all packages
pnpm run test       # run tests
pnpm run typecheck
pnpm run lint
```

## Status

Phase 1 in progress (see [`ref/PLAN.md`](ref/PLAN.md)): core primitives — `Box`, `Stack`, `Text`,
`Heading`, `Button`, `Input`, `Card`, `Alert` — are implemented, tested, and building. Composite
components (`Dialog`, `Tabs`, `Form`), the DevTools panel, migration adapters, and the docs site
come in later phases.
