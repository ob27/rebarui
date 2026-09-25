# NavIndex cookbook

Read this before `NavIndex.tsx`'s implementation. `NavIndex` has one real customization hook
(`renderLink`) plus a metadata mechanism (`status`/`statusTone`) that gets reused for things that
aren't literally "status." If your need isn't below, read the source.

## Router integration — `renderLink`

`NavIndex` defaults to a plain `<a href>`. Every real caller in this repo (`DocsShell`,
`BenchmarksShell`) overrides it with Next.js's `Link` so index navigation is client-side:

```tsx
<NavIndex
  items={items}
  renderLink={({ href, children, className }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  )}
/>
```

`renderLink` is called for *both* lists it renders — the always-visible "overview" (un-categorized)
items and the filtered/categorized list — so don't assume it only needs to handle one shape of
item. It always receives `href`/`children`/`className`; pass `className` through unchanged or the
link loses its base styling (`rebar-nav-index-link` / `rebar-nav-index-link-overview`).

## Repurposing `status`/`statusTone` for non-lifecycle metadata

`status`/`statusTone` render as a real `Tag` pill next to the label (heuristic #41 — metadata is
never concatenated into the label string). It reads as "lifecycle status" by default (`"Planned"`,
`"Deprecated"`), but nothing about the mechanism is lifecycle-specific — `BenchmarksShell` reuses it
to show which rebar-ui version each benchmark entry measured against:

```tsx
const BENCHMARK_SECTIONS: NavIndexItem[] = [
  { href: "/about/benchmarks/kanban", label: "Kanban: tier without the wrapper", status: "v0.12.1", statusTone: "info" },
  { href: "/about/benchmarks/coherence", label: "Field evidence: Coherence", status: "v0.4.0+", statusTone: "info" },
];
```

Any short, scannable per-item fact works this way — don't invent a separate pill mechanism when
this one already exists.

## Un-categorized items are not the "All" chip

Omitting `category` on an item doesn't hide it from search/status filtering — it exempts it
entirely, rendering it bold, above the filterable list, unaffected by query or filter state. This
is deliberate and distinct from the "All" chip a `MultiSelect` clears to: the chip only resets a
filter *in place*, it never navigates, while an un-categorized item is a real link (e.g. a
section's own index page, like `LONG_ITEMS`'s `"All components"` in
`packages/core/src/test/NavIndex.test.tsx`). Don't style them identically — that reads as duplicate
UI doing the same job.

## `category` vs. `status` — two independent filter dimensions

Both are separate `MultiSelect` checklists (not a single-select toggle — heuristic #42), each
composed with the others and with the search query: an item must pass all three to show. Neither
filter UI renders unless there are 12+ total items *and* at least one item has a `category`
(`showFilterUI`) — a fully un-categorized long list (e.g. a plain doc-page sidebar) gets no
search/filter chrome at all rather than a search box that can never match anything, and no status
filter shows unless items collectively use 2+ distinct status values (items with no `status` count
as one shared value, labeled via `unstatusedLabel`). Don't add your own item-count check before
wrapping content in `NavIndex` — this is already the built-in threshold.
