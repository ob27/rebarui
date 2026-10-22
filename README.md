# Rebar UI

Headless-first React components with one canonical theme, basilika, in light and dark. Fully
functional and accessible by default, styled entirely through CSS variables, so a later pass — by hand
or by an LLM — can re-skin an app built with Rebar into a real design system without touching component structure,
props, or tests.

Planning lives in [`ref/`](ref) — start with [`ref/ARCHITECTURE.md`](ref/ARCHITECTURE.md) for the
technical decisions and [`ref/TIERS.md`](ref/TIERS.md) for the component/block classification.

## Packages

- [`packages/core`](packages/core) (`rebar-ui`) — the component library, across five tiers
  (Imitation/Synthetic/Opinion/Order/Genesis, see [`ref/TIERS.md`](ref/TIERS.md)): everything from
  `Box`/`Stack`/`Text` up through charts, data grids, diagramming, and a floating AI assistant.
  Browse the live catalog at `/imitations`, `/synthetics`, `/opinions`, `/orders` on the docs site,
  or `packages/core/agent.md` for the compressed agent-facing digest.
- [`packages/theme-basilika`](packages/theme-basilika) (`@rebar-ui/theme-basilika`) — the canonical
  theme: cream and navy with deep coral, Fraunces over Inter, light and dark. Import
  `@rebar-ui/theme-basilika/theme.css` after `rebar-ui/style.css`; no attribute needed.
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

Currently `1.1.0`. Core primitives, composite components (`Dialog`/`Tabs`/`Form`), theming, the
DevTools panel, the AntD migration adapter, the `@rebar-ui/placement` Packer, and the real
docs/marketing site are all built and tested (the core package alone passes 2,475 tests across 260
files at 1.1.0). See [`PACKER_COVERAGE.md`](PACKER_COVERAGE.md) for how much of the docs site itself
is printed by the Packer versus hand-authored, and `/roadmap` on the site for what's next.
