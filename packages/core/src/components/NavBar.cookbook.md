# NavBar cookbook

Read this before `NavBar.tsx`'s implementation. `NavBar` has a small customization surface —
`renderLink`, `renderIcon`, and the data-only `megaMenu` shape on a `NavBarItem` — plus one layout
gotcha in how its container must be sized. If your need isn't below, then read the source.

## Client-side routing (Next.js `Link`, React Router, ...)

The default `renderLink` is a plain `<a href>`. Pass your framework's `Link` via `renderLink` —
same convention `@rebar-ui/placement`'s `BlockRenderer` uses for its own `renderLink`:

```tsx
<NavBar
  items={items}
  renderLink={({ href, children, className, onClick }) => (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )}
/>
```

**Always wire `onClick` through.** It isn't there for analytics — a mega-menu link calls it to
close the open `Popover` after navigation. Drop it and mega-menu links stop closing their panel
once clicked; plain top-level links have no visible symptom (there's no popover to close), which
is exactly why this is easy to miss in a quick manual test.

## Mega menus

Give a `NavBarItem` a `megaMenu` (columns of `{ label, description?, href, icon?, external? }`,
plus an optional `footer` link) instead of trying to build a dropdown out of `Popover` yourself —
`NavBar` already renders it as a grid inside a `Popover`, wires the trigger's open state, and
closes it on any item/footer click:

```tsx
{
  label: "Products",
  href: "#",
  megaMenu: {
    columns: [
      { heading: "Platform", items: [
        { label: "Orders", href: "/orders", icon: "orders" },
        { label: "Reporting", href: "/reporting", description: "Exports and dashboards" },
      ] },
    ],
    footer: { label: "View all products", href: "/products" },
  },
}
```

A plain item (no `megaMenu`) still just renders as a link — you don't opt into anything by adding
`megaMenu` to other items in the same `items` array.

## Icons inside a mega menu

`megaMenu` items carry `icon` as a plain string (e.g. `"orders"`), not an element — `NavBar` owns
no icon set. Resolve it with `renderIcon`, the same way `BlockRenderer` resolves it against its own
`ICONS` map:

```tsx
<NavBar items={items} renderIcon={(icon) => <Icon name={icon} size="sm" />} />
```

Omit `renderIcon` and an item's `icon` is simply skipped — it never throws for an unresolved icon,
so don't guard against a missing `renderIcon` yourself.

## Giving the collapse room to actually work

`NavBar` measures its own items and collapses whatever doesn't fit into a trailing "More" popover —
it has no opinion on how wide it's allowed to get. The heuristic ("nav shouldn't eat more than half
the header") is the placing container's job, and it must set a real `flex-basis`, not just a
`max-width`:

```tsx
<header style={{ display: "flex" }}>
  <Logo />
  <div style={{ flex: "0 1 50%" }}>
    <NavBar items={items} />
  </div>
</header>
```

A bare `max-width: 50%` with no explicit basis doesn't work: once `NavBar` has collapsed down to
its narrowest state, a flex item's default sizing ("shrink to fit content") never hands width back
on its own, so it stays collapsed even after the header regains room. `flexShrink: 1` on that same
container still lets it yield space to sibling header content (a logo, a version string) that
doesn't fit alongside a full 50%.
