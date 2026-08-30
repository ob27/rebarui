# Contributing to Rebar UI

Rebar UI is a small, actively-building (v0.1) project — one person plus AI-assisted development so
far. Contributions are genuinely welcome, but the project is young enough that "meaningful
contribution" mostly means small, well-scoped changes right now, not large architectural ones.
This doc exists so you don't have to guess how to get from "I want to help" to an opened PR.

## Before you start

- **Check existing issues first** — someone (including the maintainer, mid-refactor) may already
  be on it.
- **For anything bigger than a small fix** (a new component, a new archetype, a behavior change),
  open an issue first and describe what you're planning. This project's whole architecture (the
  placement layer, the token-only theming discipline, the "don't fine-tune styling, defer to
  migration" rule) is deliberate, not incidental — a quick check before you write code avoids
  building something that doesn't fit the design, or that's already been tried and rejected (see
  `ref/PLAN.md` and `ref/ASSESSMENT.md` for a lot of "we tried X, here's why not").

## Setup

```
git clone https://github.com/ob27/rebarui.git
cd rebarui
pnpm install
```

Requires Node >=22.13 and pnpm (the exact version is pinned in `package.json`'s `packageManager`
field — `pnpm/action-setup` in CI reads it directly, so there's one place it can't drift).

```
pnpm dev          # apps/docs dev server at localhost:3000, dogfoods every component live
pnpm run lint
pnpm run test
pnpm run build    # run before typecheck if starting from a clean checkout — see note below
pnpm run typecheck
```

All four are what CI (`.github/workflows/ci.yml`) runs, in that order, on every PR. **Run `build`
before `typecheck` locally too** if you've just cleaned `apps/docs/.next` — its typecheck needs
Next's generated route types, which only exist after a build has run once.

## Where things live

- `packages/core` (published as `rebar-ui`) — the component library itself.
- `packages/placement` (published as `@rebar-ui/placement`) — the placement layer/DSL Packer.
  **This is the recommended way to consume the library**, not hand-authored JSX against
  `packages/core` — see that package's own README for why.
- `packages/theme-sketch`, `packages/theme-clean` — the two shipped themes.
- `packages/devtools` — the dev-only `RebarDevTools` panel.
- `packages/adapters/antd` (published as `@rebar-ui/migrate-antd`) — the migration codemod.
- `apps/docs` — the marketing/docs site, and the demo app `pnpm dev` launches at
  `localhost:3000` after you clone the repo. Also the live dogfooding ground — every component is
  demoed here, and the homepage itself renders through `@rebar-ui/placement`.
- `bench/` — disposable benchmark scaffolds from measuring rebar-ui against Ant Design across
  models (see `/benchmarks` on the site, and `ref/PLAN.md` for the full methodology history).
  **Not part of the library — don't send changes here** unless you're specifically extending the
  benchmark methodology itself; some of these directories contain intentionally-broken code
  (real captured model failures), and that's correct, not a bug to fix.
- `ref/` — planning/architecture docs (`PLAN.md`, `ARCHITECTURE.md`, `ASSESSMENT.md`,
  `HEURISTICS.md`, `MARKETING_SITE.md`). Living documents, updated in place as decisions change —
  read them before proposing a structural change, so you're not re-litigating a settled decision.

## Conventions

### Adding a component to `packages/core`

Every component: wraps a real semantic HTML element or a Radix primitive, carries
`data-rebar-component` (and `data-rebar-part`/`data-rebar-state` where it has internal structure or
state), forwards arbitrary `data-*`/`aria-*` props to its root DOM node, and is styled only through
`--rebar-*` custom properties with sensible fallback values — never a hardcoded pixel or color
value. Add tests covering role/name, keyboard operability, and the attributes above. Export it from
`src/index.ts`, and regenerate `apps/docs`'s prop tables (`pnpm run generate:props` inside
`apps/docs`, or it happens automatically via that app's own `predev`/`prebuild` hooks).

### Adding an archetype to `packages/placement`

Add the shape to the `Block` union in `src/schema.ts` (with a doc comment noting it's
**unmeasured** until it's been through real repeated benchmarking — see the existing archetypes'
comments for the convention), a render case in `BlockRenderer.tsx`, and tests covering its DOM
output and (if it has one) DOM order matching visual order. Update the archetype table in that
package's `README.md`.

### Adding a migration adapter

`@rebar-ui/migrate-antd` (`packages/adapters/antd`) is the template. A new adapter partitions a
file's `rebar-ui` imports into "has a target equivalent" (renamed/flattened, moved to the target
library's import) and "doesn't" (left importing from `rebar-ui`) — never a blind whole-file
import-source swap. Test with jscodeshift's own `applyTransform` helper against inline fixtures,
then dry-run it against real code before calling it done.

### Design heuristics

Component defaults (spacing, sizing, when to show an icon, etc.) follow the rules in
`ref/HEURISTICS.md` — also viewable live with real examples at `/docs/heuristics` on the site. If
a change would contradict one of them, that's worth flagging in your issue/PR, not silently
deviating.

## Opening a PR

- Keep it scoped — one component, one fix, one archetype. Large multi-part changes are harder to
  review and more likely to conflict with parallel work on a fast-moving v0.1 project.
- Make sure `pnpm run lint`, `test`, `build`, and `typecheck` all pass locally before pushing —
  CI runs the same four checks and will block merge if any fail.
- Describe *what* changed and *why* in the PR description; if it's a behavior change, say what you
  tested it against (a specific component page, a Playwright check, etc.) — this project's own
  practice throughout `ref/PLAN.md` is verifying claims empirically rather than asserting them, and
  PRs are held to the same bar.
- If it touches visual output, a before/after screenshot (or a link to the relevant `/components/*`
  reference page after your change) makes review much faster.

## Good first contributions

- A missing or incorrect dark-mode color pairing (check via the DevTools panel's dark-mode toggle
  on any `/components/*` page).
- A new small component filling a gap `dist/index.d.ts` doesn't cover yet.
- Improving a `/components/*` or `/docs/*` reference page — more examples, clearer prop
  descriptions, a missed accessibility note.
- A `chart` archetype for `@rebar-ui/placement` (scatter/line/bar) — `/benchmarks`' three
  hand-authored SVG chart helpers are the reference implementation to generalize from; see that
  page's `page.tsx` for the existing, already-correct rendering logic.

## License

MIT — see `LICENSE`. By contributing, you agree your contribution is licensed under the same
terms.
