# Footer cookbook

Read this before `Footer.tsx`'s implementation. Footer's customization surface is small — one
render prop (`renderLink`) plus two click callbacks — and it's already fully covered by the type
signatures in `dist/index.d.ts`. This is a short cookbook because there isn't much to say: don't
invent complexity that isn't there.

## `renderLink` — only for a routing swap-in

`renderLink` exists for exactly one reason: swap the default `<a href>` for your framework's Link
component so navigation is client-side. Same convention as `NavBar`/`SidebarNav`/`@rebar-ui/placement`'s
own `renderLink`.

```tsx
<Footer
  links={links}
  renderLink={({ href, children, className }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  )}
/>
```

**Pass `className` through.** The default `renderLink` applies `rebar-footer-link` via this prop —
drop it in a custom `renderLink` and links silently lose Footer's link styling while still working
functionally. This is the one easy way to make a custom `renderLink` look wrong without breaking.

## `onLinkClick` intercepts navigation — no wiring needed inside `renderLink`

Setting `onLinkClick` calls `event.preventDefault()` before your handler runs — the same
"intercept the jump" behavior antd-mobile's own `Footer` documents, so a caller can do its own
router push instead of a real page navigation firing. The interception happens in a wrapping
`<span onClick>` around whatever `renderLink` returns, not inside `renderLink` itself — it works
automatically even with a fully custom `renderLink`. You never need to call `preventDefault`
yourself, and a custom `renderLink` doesn't need an `onClick` of its own for this to work.

## Chips: `type: "link"` is what makes a chip clickable

A plain chip (`{ text }`, the default) renders as a non-interactive `Tag` — `onChipClick` never
fires for it, by design. Only `{ text, type: "link" }` renders as a real, focusable `<button>` that
calls `onChipClick`. If a chip needs to be clickable, set `type: "link"` on it; don't reach for your
own click handler wrapped around a plain chip.

```tsx
<Footer
  chips={[{ text: "New" }, { text: "Feedback", type: "link" }]}
  onChipClick={(item) => item.text === "Feedback" && openFeedback()}
/>
```

## Everything else is just optional sections

`label`, `content`, `links`, `chips` are all independently optional — Footer renders nothing but
the `<footer>` wrapper if none are set. There's no layout/ordering customization beyond that: the
section order is always label → content → links → chips. If a page needs a different arrangement,
this isn't the component to force it into.
