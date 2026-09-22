---
title: Packer coverage — an inventory of the marketing site
status: living document, regenerate the numbers with `pnpm --filter docs run audit:packer`
---

# Packer coverage

The marketing site (`apps/docs`) is this project's own workbench for the placement layer
(`@rebar-ui/placement`) — the aim is for it to be printed by the Packer end to end, not
hand-authored `rebar-ui` component JSX, so that adding a component or construct to the framework
dogfoods itself immediately on the site that documents it. This doc is a measured inventory of how
close each page actually is, not an assertion — same discipline as `/about/benchmarks`.

## The maker's mark

Every construct `BlockRenderer` renders already carries `data-rebar-placement-block="<type>"` on its
root (checked directly against `packages/placement/src/BlockRenderer.tsx` — present on all 42
current construct cases, not assumed). That attribute *is* this project's maker's mark: any
`[data-rebar-component]` element (a real, rendered `rebar-ui` component) sitting inside a
`[data-rebar-placement-block]` subtree was printed by the Packer; one that isn't was hand-authored
JSX. No new attribute was needed — this one already existed for a different reason (giving
`ComponentInspector` a DSL address to show on hover) and turns out to be exactly the audit signal
needed here too.

## The audit

`apps/docs/scripts/audit-packer-coverage.mjs` crawls every real route against a live dev server,
and for each one counts real `rebar-ui` components (`[data-rebar-component]`) split into
Packer-printed (inside a `[data-rebar-placement-block]` subtree) versus hand-authored. Run it with
`pnpm --filter docs run audit:packer` — the table below is its output as of this write-up, not
hand-maintained. Its own `ROUTES` list had drifted stale (dead `/docs/*`/`/benchmarks` paths from a
routing scheme this site no longer uses) before this write-up refreshed it — if a future pass finds
it stale again, fix the script's route list before trusting its numbers.

**A shrinking, no-longer-unconditional floor on every page**: the site header used to be hand-authored
`NavBar`/`Box`/`Stack` on literally every route — now it's a real `site-header` construct, so it
counts as printed everywhere instead. The `DevTools` panel is the one piece of chrome that stays a
genuine, permanent exception (a live dev tool, not static content) — it alone remains part of the
unavoidable floor on every route. Read every percentage below as "of this page's own content, plus
whatever DevTools costs it."

| Route | Total | Printed | Hand-drawn | % | Notes |
|---|---:|---:|---:|---:|---|
| `/` | 136 | 95 | 41 | 70% | Homepage. |
| `/about` | 64 | 45 | 19 | 70% | |
| `/about/benchmarks` | 41 | 25 | 16 | 61% | Overview page for the 8-route benchmark suite. |
| `/about/benchmarks/scenarios` | 92 | 73 | 19 | 79% | |
| `/about/benchmarks/receipts` | 38 | 22 | 16 | 58% | |
| `/about/benchmarks/claude` | 130 | 109 | 21 | 84% | Two bespoke hand-drawn SVG scatter plots with hardcoded historical pixel coordinates stay hand-authored on purpose — not the shared chart components. |
| `/about/benchmarks/qwen` | 134 | 114 | 20 | 85% | |
| `/about/benchmarks/kimi` | 79 | 61 | 18 | 77% | |
| `/about/benchmarks/tiers` | 79 | 30 | 49 | 38% | Lowest of the eight — its gallery uses distinctly-named images, not the `gallery` construct's numbered-sequence shape, so it stays a plain `Carousel`. |
| `/about/benchmarks/iteration` | 83 | 45 | 38 | 54% | Same non-numbered-gallery situation as `tiers`. |
| `/imitations`, `/synthetics`, `/opinions`, `/orders` | 293 | 217 | 76 | 74% | The four tier-catalog index pages (combined row). |
| `/about/agent` | 25 | 10 | 15 | 40% | Live-narrated heuristics/agent-context viewer page. |
| `/archetypes` | 38 | 19 | 19 | 50% | |
| `/geneses` | 55 | 35 | 20 | 64% | |
| `/heuristics` | 335 | 320 | 15 | 96% | All 47 entries print via the `heuristic` construct. |
| `/roadmap` | 30 | 14 | 16 | 47% | |
| `/status` | 58 | 10 | 48 | 17% | Legitimate exception — internal dev smoke-test page, not public marketing content; its non-zero % is purely the printed site header. |
| `/imitations/*`, `/synthetics/*`, `/opinions/*`, `/orders/*` (116 reference pages) | 6,944 | 3,839 | 3,105 | 55% avg (11–71% range) | **Not a gap** — see below. One reference page per shipped component/construct. |

**Site-wide roll-up (136 routes):** 8,654 components total, 5,083 printed — **58.7% printed** as a
flat average. That number is diluted by the 116 per-component/per-construct reference pages
(11–71% each, by design: only each one's own demo, code, props-table, and accessibility/migration
sections print, not the page chrome around them) plus `/status` (non-zero only for the site-header
reason above, despite its own content staying fully hand-authored by design). Excluding those, the
remaining 19 core marketing/philosophy pages this inventory is meant to move toward 100% come to
**1,710 components, 1,244 printed — 72.7% printed**. That's the number to watch trend upward; the
flat 58.7% isn't a useful target since a large share of its shortfall is by design, not backlog.

## Legitimate exceptions (not counted as gaps)

- **A component's own `LivePreview` demo**, on every reference page — *possible* to print (there's
  no real dependency cycle: `@rebar-ui/placement` already depends on `packages/core` for every
  construct, the same way a hypothetical one-component demo construct would), just not worth it. A
  construct's value is deciding *layout across components* (`banner` is icon, then text, then
  action, in a fixed order); a construct that's one component with its own props forwarded straight
  through decides nothing, and multiplied across 190+ shipped components would mean 190+
  near-duplicate `BlockRenderer` cases each needing updated in lockstep with the real component's
  own prop interface — a second schema to keep in sync, for no layout-decision benefit. This is why
  every reference page's real percentage sits well under 100%; a cost/benefit call, not an
  architectural wall. The Code/Props-table/Accessibility/Migration sections around that demo already
  print.
- **`/status`** — an internal dev tool for a quick visual smoke-test, not a page a real visitor
  reaches. Explicitly out of scope for "the marketing site."
- **The `DevTools` panel** — a live dev tool, not static content, present (and hand-drawn) on every
  route regardless of how printed the rest of the page is.
- **Genuinely interactive widgets** — a live estimator, a live panel demo, anything whose whole
  point is client-side interactivity driven by more than static content. A construct can't sensibly
  wrap something like that.

## Real gaps, prioritized

The reference-page average (55%) has real headroom versus the best-converted examples in that same
bucket (several sit above 70%) — the gap is mostly each page's own `LivePreview`/demo wrapper markup
around the component itself, not anything architectural. No single page stands out as an urgent
outlier beyond the legitimate exceptions listed above; re-run the audit
(`pnpm --filter docs run audit:packer`) after any batch of new components/pages to see whether that
changes.

## Working rule this inventory feeds

See `agent.md`'s "Working on the marketing site" section: touching `apps/docs` to add new content
is itself a signal to check this inventory and the construct catalog first — if the needed shape
doesn't exist as a construct yet, the correct order is component (if needed) → construct → printed
page, never a hand-authored shortcut that quietly adds to the hand-drawn count above.
