# MobileTabBar cookbook

Read this before `MobileTabBar.tsx`'s implementation. There's exactly one customization prop
(`renderLink`) plus the controlled/uncontrolled active-index pair — this is a small surface, so
this cookbook is short on purpose. If your need isn't below, the source is only ~150 lines.

## `renderLink` — only fires for items that have an `href`

An item with no `href` always renders as a real `<button type="button">`; `renderLink` is never
consulted for it. It only exists to swap the plain `<a href>` used for `href` items for a
framework router's link component (same convention as `NavBar`'s `renderLink` and
`@rebar-ui/placement`'s `renderLink`):

```tsx
import Link from "next/link";

<MobileTabBar
  items={items}
  renderLink={({ href, children, className, onClick, "aria-current": ariaCurrent }) => (
    <Link href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>
      {children}
    </Link>
  )}
/>
```

**Always pass through `className`, `onClick`, and `aria-current`.** `className` carries the
active-item styling (`rebar-mobile-tab-bar-item-active`); `onClick` is what advances
`activeIndex`/fires `onActiveChange` and the item's own `onSelect` — drop it and clicking the
item stops updating active state; `aria-current="page"` is the only accessible signal for which
tab is selected. There's no drag/touch-handler equivalent to spread here (unlike `Kanban`'s
`renderCard`) — those three props are the entire contract.

## Keeping the active tab in sync with real navigation

If `href` items are driving actual route changes, don't rely on the built-in uncontrolled index —
control it from the route instead, same pattern as any other controlled/uncontrolled Rebar
component:

```tsx
<MobileTabBar
  items={items}
  activeIndex={items.findIndex((i) => i.href === pathname)}
  onActiveChange={(i) => router.push(items[i].href!)}
/>
```

Once `activeIndex` is passed, clicking an item no longer updates the bar itself — only
`onActiveChange` fires. The caller owns feeding the new value back in (exactly like `Kanban`'s
`cards`/`onChange`); forgetting the feedback loop is why a controlled bar can look "stuck" on
click.

## `onSelect` vs. `onActiveChange`

Both fire on click, in that order (`onActiveChange` first is not guaranteed — treat them as
independent, not sequenced). `onActiveChange(index)` is the general "active tab changed" signal;
an item's own `onSelect` is for per-item side effects (e.g. an analytics event or a non-navigation
action) that shouldn't have to switch on the index. Use one or both — they aren't mutually
exclusive.

## `bionic`/`bionicOptions` override the ambient setting

Item labels respect the nearest `data-rebar-bionic` ancestor by default. Pass `bionic={false}`
(or `true`) on the `MobileTabBar` itself only when this one instance needs to disagree with the
ambient setting — not as the default way to control bionic reading page-wide.
