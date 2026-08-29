# Rebar UI

Headless-first, intentionally low-fidelity React components. Fully functional and accessible by
default, styled entirely through CSS variables, so a later pass — by hand or by an LLM — can
re-skin an app built with Rebar into a real design system without touching component structure,
props, or tests.

Planning lives in [`ref/`](ref) — start with [`ref/PLAN.md`](ref/PLAN.md).

## Packages

- [`packages/core`](packages/core) (`rebar-ui` on npm) — the components: `Box`, `Stack`, `Text`,
  `Heading`, `Button`, `Input`, `Card`, `Alert`, `Dialog`, `Tabs`, `Form`/`FormItem`.
- [`packages/theme-sketch`](packages/theme-sketch) (`@rebar-ui/theme-sketch`) — the default
  hand-drawn, low-fidelity theme.
- [`packages/theme-clean`](packages/theme-clean) (`@rebar-ui/theme-clean`) — a plain,
  production-safe baseline theme.
- [`packages/devtools`](packages/devtools) (`@rebar-ui/devtools`) — a dev-only floating panel:
  real component counts, theme/grid toggles, a migration-effort estimate.
- [`packages/adapters/antd`](packages/adapters/antd) (`@rebar-ui/migrate-antd`) — a jscodeshift
  codemod migrating Rebar usage to Ant Design v6.
- [`apps/docs`](apps/docs) — the docs/marketing site, built with Rebar itself.

## Other root files

- [`MIGRATION_PROMPT.md`](MIGRATION_PROMPT.md) — paste into a coding agent to migrate off Rebar
  onto any target design system.
- [`HEURISTICS.md`](HEURISTICS.md) — the UI design heuristics Rebar bakes in, published standalone
  so any project (using Rebar or not) can adopt them as a design-defaults reference.

## Dev

```
pnpm install
pnpm run build      # build all packages
pnpm run test       # run tests
pnpm run typecheck
pnpm run lint
```

To run the docs site locally: `pnpm --filter docs dev`, then open http://localhost:3000.

## Status

Phases 1–5 done (see [`ref/PLAN.md`](ref/PLAN.md)): core primitives, composite components
(`Dialog`/`Tabs`/`Form`), theming, the DevTools panel, and the AntD migration adapter are built
and tested (41+ tests). Phase 6 (the real docs/marketing site) is in progress.
