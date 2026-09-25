# IndexBar cookbook

Read this before `IndexBar.tsx`'s implementation. Covers the two `render*` props and the parts of
the drag-scrub gesture that matter when you customize around it. If your need isn't below, read
the source — it's short.

## The customization surface is just two render props

`renderItem={(item, groupKey, index) => ReactNode}` (required) and
`renderGroupHeader={(groupKey) => ReactNode}` (optional, defaults to the bare `group.key` text).
Neither hands you a context object of handlers to spread — unlike `Kanban`'s `renderCard`, there's
nothing you can accidentally break by not spreading something. `renderItem`/`renderGroupHeader` are
pure content slots; the drag-scrub gesture, active-letter tracking, and scroll-to-group are all
wired on the rail/list DOM itself and have no dependency on what you render inside a row.

## `renderItem` for a richer row than a name

```tsx
<IndexBar
  groups={groups}
  renderItem={(contact, groupKey, i) => (
    <Stack direction="row" gap="sm" align="center">
      <Avatar fallback={contact.name} placeholder />
      <Stack gap="xs">
        <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{contact.name}</Text>
        <Text color="secondary" size="sm">{contact.role}</Text>
      </Stack>
    </Stack>
  )}
/>
```

`groupKey`/`index` are there for rows that need them (e.g. zebra striping within a group, or a
divider only on `index === 0`) — most rows ignore both and just render `item`.

## `renderGroupHeader` for a count or icon instead of a bare letter

```tsx
renderGroupHeader={(key) => (
  <>
    {key} <Text color="secondary" size="sm">({groups.find((g) => g.key === key)!.items.length})</Text>
  </>
)}
```

The rail letters themselves (the buttons in the drag rail) are **not** customizable — they always
render `group.key` as plain text. `renderGroupHeader` only changes the in-list section header, not
the rail.

## Grouping is entirely your responsibility, not IndexBar's

`IndexBar` doesn't group flat data by first letter itself — it only renders whatever
`IndexBarGroup<T>[]` you hand it, in the order given, and builds the rail from each group's `key`.
Do the bucketing yourself before render:

```tsx
const groups: IndexBarGroup<Contact>[] = Array.from(
  contacts.reduce((byLetter, c) => {
    const letter = c.name[0]!.toUpperCase();
    (byLetter.get(letter) ?? byLetter.set(letter, []).get(letter)!).push(c);
    return byLetter;
  }, new Map<string, Contact[]>()),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, items]) => ({ key, items }));
```

Sort the `Map` entries yourself too — `IndexBar` doesn't sort `groups`, it renders them in the
array order you pass.

## The drag-scrub gesture is the whole point — don't reimplement it

This is why `IndexBar` is Opinion tier, not Synthetic (`ref/TIERS.md:79`): pressing down anywhere on
the rail and dragging tracks the pointer's Y position via `document.elementFromPoint` against each
rail button's `data-index-key`, jumping the list live and showing the current letter in a floating
bubble (`data-rebar-part="bubble"`) — because with ~26 single-letter groups no individual rail
button can meet a real 44×44 touch target on its own (`ref/HEURISTICS.md` #19). A plain click on one
letter with no drag still works, and every letter stays keyboard-focusable. All of this is built in
and untouchable through props — there's no `onScrub`/`onDrag` escape hatch, and none is needed: you
can't disable or intercept the gesture, only style it, via `data-rebar-active` on the currently
touched rail letter and `data-rebar-part="bubble"` on the floating indicator.
