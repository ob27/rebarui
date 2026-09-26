# The Kanban benchmark — target spec ("Sprint Board")

A new, standalone baseline (not a variant of Simple/Composite/Complex) — see
`ref/BENCHMARK_CONTRIBUTING.md` rule #8. Tests whether reaching for a complete, pre-built
Opinion-tier unit and customizing it beats hand-assembling the same behavior from primitives,
independent of whether a DSL wrapper is involved at all (no `@rebar-ui/placement` in the first 4
conditions' scaffolds — those isolate tier, not delivery mechanism). A 4th condition,
`kanban-antd-*`, was added after the first 3 conditions (45 runs) completed, specifically to
answer the question those 3 alone can't: is rebar-ui actually cheaper/faster than hand-rolled antd
for this task, not just internally more efficient than hand-rolling its own primitives. `kanban-antd`
is the fairest one-to-one comparison against `kanban-primitives` (neither library has a pre-built
Kanban-shaped component; both are "hand-roll it from what the library gives you").

A 5th condition, `kanban-opinion-dsl-*`, was added after the first 4 (60 runs) completed, testing
whether a DSL strategy can still deliver the clean wins the original Claude/Qwen/Kimi benchmarks
found — now that `Kanban`'s own schema (`card-kanban`/`sticky-kanban` in
`packages/placement/src/schema.ts`) has been widened with `assignee`/`statusTag`/`addPosition`
fields specifically so the Sprint Board spec is expressible as pure data, no `renderCard` escape
hatch needed. This condition *does* use `@rebar-ui/placement` — that's the whole point of it.

## The spec (identical across all 4 conditions)

Build a "Sprint Board" — a project Kanban board — in `src/App.tsx` (splitting into additional
files under `src/` is fine):

- **Three fixed columns**: "To Do", "In Progress", "Done". Each column header shows its title and
  a card count.
- **Cards** show: a title, an optional one-line description, a lifecycle-status tag (values:
  "Blocked", "Review", or no tag at all), and a single-letter assignee initial in a small round
  avatar.
- **Drag-and-drop**: cards can be dragged between columns and reordered within a column.
- **Add a card**: each column has an "+ Add card" control that reveals an inline text input
  (title required, Enter to add, Escape to cancel) and adds the new card to the top of that
  column.
- **Search**: a search box above the board filters visible cards by title substring, across all
  three columns simultaneously (a card that doesn't match is hidden, not removed).
- **Column cap**: "In Progress" has a soft cap of 4 cards — show "3/4" style count-vs-cap next to
  its title. Reject (don't just discourage) both a drag-drop and an "+ Add card" submission that
  would exceed it (disable/no-op the add control once at cap, same as a rejected drop). The
  count/cap badge always reflects the column's true state, not what's currently visible during an
  active search filter.
- **Seed data**: start with at least 2 cards in "To Do", 2 in "In Progress" (including at least one
  with a status tag), and 1 in "Done".

Use `@rebar-ui/theme-clean` (already wired in `main.tsx` — don't change it). This line doesn't
apply to `kanban-antd-*`: that scaffold has no rebar-ui dependency at all by design (its
`main.tsx` has nothing to leave alone) — style the board with antd's own defaults/CSS-in-JS.
No backend, no
persistence required — in-memory React state is sufficient.

## Your condition's constraint (read the one that applies to your scaffold)

- **`kanban-primitives-*`**: Build this using only Imitation/Synthetic-tier primitives —
  `Box`, `Stack`, `Card`, `Tag`, `Input`, `Button`, `Avatar` (or plain HTML where none of these
  fit). **Do not import `Kanban` from `rebar-ui`.** Write the drag-and-drop, search-filter, and
  add-card state yourself, from scratch.
- **`kanban-synthetic-*`**: You may use any Synthetic-tier composition components for the visual
  shell (`Card`, `Tag`, `Avatar`, `Stack`, etc.), but **do not import `Kanban` from `rebar-ui`.**
  Write the drag-and-drop, search-filter, and add-card *behavior* yourself — only the static shell
  may be pre-built.
- **`kanban-opinion-*`**: Use the real `Kanban` component from `rebar-ui` directly
  (`columns`/`cards`/`onChange`/`search`/`filterCard`/`renderCard`/etc. — see its own prop types).
  Customize via props and styling to hit every requirement above; do not reimplement anything
  `Kanban` already provides.
- **`kanban-antd-*`**: Build this using Ant Design (`antd`, already a dependency) components —
  `Card`, `Tag`, `Avatar`, `Input`, `Button`, or whatever else fits — no `rebar-ui` at all. antd has
  no pre-built Kanban/board component, so drag-and-drop, search-filter, and add-card behavior must
  all be written, same as `kanban-primitives`. You may add one real drag-and-drop dependency of your
  own choosing if you want one (e.g. `@dnd-kit/core`, `react-beautiful-dnd`, or plain native HTML5
  DnD) — pick whatever a real antd developer would naturally reach for; this isn't constrained the
  way the rebar-ui conditions are, since antd itself doesn't ship a headless DnD primitive.
- **`kanban-opinion-dsl-*`**: Author a `Construct[]` array with one `card-kanban` block (from
  `@rebar-ui/placement`) and render it through `BlockRenderer` — do not import `Kanban` directly,
  do not write any drag-and-drop/search/add-card/cap logic yourself, and do not pass a custom
  `renderCard`/`renderColumnTitle` (that would defeat the point of this condition — everything the
  spec asks for should already be expressible as the block's own literal `columns`/`cards` data,
  using its `assignee`/`statusTag`/`addPosition` fields directly). See
  `packages/placement/src/schema.ts`'s `card-kanban` case for the exact field shapes. Search,
  drag-and-drop, and cap enforcement are already built into the block itself — there should be
  close to zero behavior code in this condition's `App.tsx`, just the block definition and
  rendering it. If you find yourself needing a `renderCard` to hit a spec requirement, that's a
  real, reportable finding (the schema still doesn't cover something) — say so explicitly rather
  than silently reaching for it.

  **Known, accepted gap — don't work around it**: `Kanban`'s built-in column header only shows a
  count/cap badge when that column has a `limit` set; there's no way to show a plain count on an
  *uncapped* column through pure block data. Leave "To Do" and "Done" with no `limit` (they
  shouldn't be capped) and no visible count — this is a real, honest limit of what the schema
  currently expresses, not something to route around with a fake high `limit` as a stand-in for
  "just show a count." Report it as a finding if you hit it; do not invent a workaround.

## Known gotcha — read this before writing the search filter

Across the first 60 runs, a Playwright-verified sample found 4 of 12 sampled runs (across 3 of
the 4 conditions — primitives, synthetic, and antd, not any one library specifically) implemented
"hidden, not removed" incorrectly: they wrote `cards.filter(matchesSearch).map(...)` (or the
equivalent), which never mounts a non-matching card to the page at all. That is removal, not
hiding, even though no data was lost — the spec's own verification step checks the actual DOM
element count before and after a search, not just what's visually shown, specifically because this
mistake is easy to make and easy to miss in a quick manual check.

**Render every card unconditionally, every time** (`cards.map(...)`, no `.filter()` in the render
path), and toggle only its visibility — `display: none` (or an equivalent hidden style/attribute)
on the ones that don't match. The card must still be a real, present DOM element while hidden; a
card that was never rendered in the first place is not "hidden."

## Verification (done after each run, not by the building agent)

1. `npx tsc --noEmit` in the scaffold.
2. Playwright: page loads with no console errors, seed cards visible in the right columns, a drag
   between columns works, search hides a non-matching card, add-card works, the "In Progress" cap
   is enforced.
3. Record: total tokens (input+output), wall-clock duration, tool-call count, from the dispatching
   agent's own run.
