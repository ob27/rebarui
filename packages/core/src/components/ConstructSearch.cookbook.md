# ConstructSearch cookbook

Read this before `ConstructSearch.tsx`'s implementation. The customization surface here is
small — one render prop plus a few plain props — but the render prop has two easy-to-miss
requirements baked into it. If your need isn't below, read the source.

## The only render prop: `renderLink`

`ConstructSearch` doesn't have an `onSelect` callback — picking a result always means navigating
to a real href (unlike `CommandPalette`, a forced-open modal driving callbacks). `renderLink` lets
you swap the default plain `<a href>` for your framework's Link, same convention as
`NavBar`/`@rebar-ui/placement`'s own `renderLink`:

```tsx
<ConstructSearch
  results={everyConstruct}
  renderLink={({ href, children, className, onClick }) => (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )}
/>
```

**Two things you must preserve, or built-in behavior silently breaks:**

- **Call `onClick`** (it's `handleSelect` internally) — it clears the query and closes the
  dropdown after a pick. Drop it and the dropdown stays open with stale results after navigating.
- **Render an actual `<a>` or `<button>` as the top element.** Keyboard selection (`ArrowDown` +
  `Enter`) works by finding `optionRefs.current[activeIndex]?.querySelector("a,button")` and
  calling `.click()` on it — wrap your Link in an extra `<div>` or `<span>` and Enter stops
  navigating even though mouse clicks still work. Next.js's `Link` renders as a real `<a>` under
  the hood, so this is normally a non-issue — just don't add a wrapper element around it.

`className` and `onClick` both come through the same object; pass both along even if you don't
otherwise style the link.

## Filtering is name-only, and pre-filter if you need more

Unlike `Kanban`'s `search` (which matches title/description/tags), `ConstructSearch` only matches
`result.name` — trimmed, lowercased, substring. There's no `filterCard`-equivalent prop. If you
need to search other fields (e.g. a construct's tags or tier), pre-filter/transform `results`
yourself before passing it in — don't expect a second matching prop to exist.

## Grouping and capping results

`group` (optional, per-result) buckets results under a heading, same shape as `CommandPalette`'s
grouping — first-appearance order is preserved, both across groups and within a group:

```tsx
const results: ConstructSearchResult[] = [
  { name: "Kanban", group: "Opinions", href: "/opinions/kanban" },
  { name: "Steps", group: "Synthetics", href: "/synthetics/steps" },
];
```

`maxResults` (default 8) caps the *filtered* set before grouping — it's a nav-bar dropdown, not a
full results page. Don't raise it to "show everything"; that's what each tier's own sidebar is
for, and the dropdown only opens once the query is non-empty in the first place (there's no
browsable, query-less state to design around).

## Styling/testing hooks

`data-rebar-component="construct-search"` on the root; `data-rebar-part` on `input`, `list`,
`option`, `group-label`, `empty`. Use these instead of relying on class names, which are a plain
`clsx` pass-through and not a stable contract.
