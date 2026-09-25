# The Kanban benchmark — target spec ("Sprint Board")

A new, standalone baseline (not a variant of Simple/Composite/Complex) — see
`ref/BENCHMARK_CONTRIBUTING.md` rule #8. Tests whether reaching for a complete, pre-built
Opinion-tier unit and customizing it beats hand-assembling the same behavior from primitives,
independent of whether a DSL wrapper is involved at all (no `@rebar-ui/placement` in any
condition's scaffold — this benchmark isolates tier, not delivery mechanism).

## The spec (identical across all 3 conditions)

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

Use `@rebar-ui/theme-clean` (already wired in `main.tsx` — don't change it). No backend, no
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

## Verification (done after each run, not by the building agent)

1. `npx tsc --noEmit` in the scaffold.
2. Playwright: page loads with no console errors, seed cards visible in the right columns, a drag
   between columns works, search hides a non-matching card, add-card works, the "In Progress" cap
   is enforced.
3. Record: total tokens (input+output), wall-clock duration, tool-call count, from the dispatching
   agent's own run.
