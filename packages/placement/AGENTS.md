# Agent guidance for `@rebar-ui/placement`

**Read `rebar-ui`'s `robot.md` first** (ships in that package, `node_modules/rebar-ui/robot.md`) —
a single compressed context covering Framework Rules vs. Heuristics, the full block catalog, and
component-authoring conventions, alongside everything below. This file is a narrower excerpt
scoped to this package alone.

**This is the recommended way to build with rebar-ui — compose a `Block[]` document and render it
through `BlockRenderer`, don't hand-author `Stack`/`Box`/`Card` JSX against `rebar-ui` directly.**
See `README.md` in this package for why (measured, not asserted), the full archetype list, and
per-harness prompt guidance (agentic vs. single-completion-call, and a specific note for
image-driven tasks). For exact current TypeScript shapes, read `dist/index.d.ts`, not `src/`.

**Do not fine-tune visual styling** here either — same policy as `rebar-ui` itself. No archetype
takes a color/spacing override; that's deferred to migration.
