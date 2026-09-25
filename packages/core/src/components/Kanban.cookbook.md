# Kanban cookbook

Read this before `Kanban.tsx`'s implementation. This covers the customization patterns that
actually come up — the ones a real, repeated n=15 benchmark (`/about/benchmarks/kanban`) found
every independent build reaching for. If your need isn't below, then read the source.

## Adding fields a card doesn't have (assignee, status, priority, ...)

`KanbanCard` only has `id`/`title`/`description`/`tags`. To add a real field (a single-letter
assignee avatar, a colored status tag), extend it locally and use `renderCard`:

```tsx
interface SprintCard extends KanbanCard {
  assignee?: string;
  status?: "Blocked" | "Review";
}

<Kanban
  columns={columns}
  cards={cards as Record<string, SprintCard>}
  renderCard={(card, ctx) => {
    const c = card as SprintCard;
    return (
      <Card
        title={c.title}
        labels={c.status ? [{ text: c.status, tone: c.status === "Blocked" ? "error" : "warning" }] : []}
        footer={c.assignee ? <Avatar size="sm" fallback={c.assignee} /> : undefined}
        {...ctx.dragHandlers}
        {...ctx.touchHandlers}
      />
    );
  }}
/>
```

**Always spread `ctx.dragHandlers` and `ctx.touchHandlers` onto whatever you return.** Skipping
this is the single most common way a custom `renderCard` silently breaks drag-and-drop — the card
looks right but can no longer be dragged, or loses touch/long-press parity.

Cards added later via the built-in "+ Add card" control only ever get `id`/`title` — your added
fields are always optional for exactly this reason. Don't assume every card has one.

## Where a new card lands

The built-in "+ Add card" control has always appended to the *end* of a section. Don't reimplement
this — pass `addPosition="start"` if you want new cards at the top instead (default is `"end"`,
unchanged, so existing callers aren't affected). This is a real prop as of the version you're
reading this in; if it's somehow missing, that's the actual gap to fix, not something to work
around with an `onChange` post-processor.

## A count next to an uncapped column's title

`Kanban` only auto-renders a count/cap badge (e.g. "3/4") when a column has a `limit` set.
Columns with no `limit` get no badge at all. To show a plain count anyway, use
`renderColumnTitle`:

```tsx
renderColumnTitle={(column) => (
  <>
    {column.title}
    {column.limit === undefined && ` (${column.sections.reduce((n, s) => n + s.cardIds.length, 0)})`}
  </>
)}
```

Don't add a count for a column that already has a `limit` — you'd be duplicating the built-in
badge, not adding to it.

## `search` vs. `filterCard` — which one

- `search` (a plain string) matches title, description, *and* tags — use it for a general search
  box.
- `filterCard` is a separate predicate, composed with `search` (a card must pass both) — use it
  for a caller-defined filter that isn't a substring match (e.g. "only cards assigned to me"), or
  when you specifically want title-only matching (`filterCard={(c) => c.title.toLowerCase().includes(q)}`)
  because `search`'s built-in tag/description matching is broader than you want.

Both are visibility-only: a filtered-out card is hidden, never removed from `cardIds` — a
drag/reorder's own `onChange` still sees the true, unfiltered state. Don't build your own hiding
logic that touches `cardIds` directly; that's the actual `search`/`filterCard` contract already
being tested against.

## Column/section caps

Set `limit` on a `KanbanColumn` or `KanbanSection` — `Kanban` already rejects both an over-cap
drag-drop (silently, no state change) and an over-cap add (the "+ Add card" control disables
itself). Don't reimplement cap-checking; it's already the built-in behavior for both paths.
