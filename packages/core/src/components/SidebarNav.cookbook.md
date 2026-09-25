# SidebarNav cookbook

Read this before `SidebarNav.tsx`'s implementation. Covers the customization patterns actually
demonstrated on `/orders/sidebar-nav` and in the test suite — if your need isn't below, read the
source.

## Client-side routing: `renderLink`

The only `render*` prop. Defaults to a plain `<a href>`; pass your framework's Link (Next.js,
React Router) instead — the same convention `NavBar`/`@rebar-ui/placement`'s own `renderLink` use.

```tsx
<SidebarNav
  items={items}
  renderLink={({ href, children, className }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  )}
/>
```

**Always forward `className` onto whatever element you render.** It carries both the base link
class and, on the active item, the `activeStyle`-specific active class
(`rebar-sidebar-nav-active-tint|bar|fill`) — drop it and the active item silently loses its
styling, not just your custom look. `children` already contains the resolved icon/label/badge
markup; don't reconstruct it yourself.

## Collapsed-aware slots: `header`, `panel`, `footer`

Each accepts a plain node or a `(ctx: { collapsed: boolean }) => ReactNode` function — the same
"resolve differently once collapsed" convention `logo` gets natively (see below), just without a
dedicated `full`/`compact` shape. Real, shipped uses from the docs page:

```tsx
panel={({ collapsed }) =>
  collapsed ? null : <QuotaWidget /> // no room for a quota widget in a ~64px rail
}
footer={({ collapsed }) => (collapsed ? "JW" : "Jerry Wilson")}
```

Don't hand-write a `collapsed ? compact : full` ternary for a brand mark inside `header` — that's
exactly what the dedicated `logo={{ full, compact }}` prop already does natively, rendered above
`header` in its own bordered row.

## Composing your own collapse toggle

`collapsed`/`onCollapsedChange` follow the standard controlled/uncontrolled split: omit
`onCollapsedChange` and the component manages its own state via the built-in toggle button; pass
both to drive it from elsewhere (the built-in button still calls `onCollapsedChange`, but only
applies the new value itself when uncontrolled — a controlled caller that ignores the callback
stays put, by design). To replace the built-in button entirely — e.g. embed it inside `header`
next to a title — pass `hideCollapseToggle` and control `collapsed` yourself:

```tsx
<SidebarNav
  items={items}
  collapsed={collapsed}
  hideCollapseToggle
  header={({ collapsed: c }) => (
    <Stack direction="row" justify={c ? "center" : "between"}>
      {!c && <Text>My App</Text>}
      <button aria-label={c ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}>
        {c ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
    </Stack>
  )}
/>
```

`collapseTogglePlacement` (`"inline"` / `"edge"` / `"edge-hover"`) only repositions the *built-in*
button — reach for it first. Only compose your own toggle when none of those placements fit (a
toggle embedded in another slot, or a native `resize: horizontal` wrapper instead of a binary
toggle at all).

## `search`'s `onSearch` observes, it doesn't replace the filter

Unlike `Kanban`'s `search`/`filterCard` pair, `SidebarNav` has no custom-predicate escape hatch.
`search={{ onSearch }}` still filters `items` by label — recursively into nested children,
auto-expanding a group that contains a match — `onSearch` only lets you *observe* the live query
(e.g. to sync it into the URL), not swap in different matching logic. If you need different
matching (fuzzy, by a field other than label), filter `items` yourself before it reaches
`SidebarNav`; don't expect `search` to take a predicate.
