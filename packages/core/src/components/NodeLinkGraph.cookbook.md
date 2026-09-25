# NodeLinkGraph cookbook

Read this before `NodeLinkGraph.tsx`'s implementation. This is the shared pan/zoom/drag base
`OrgChart`, `MindMap`, `Flowchart`, `PertChart`, and `DiagramMinimap` all build on — the patterns
below are lifted from how those derived components actually customize it, not hypothetical needs.

## Custom node shapes (box/diamond/pill instead of the default circle)

`renderNode` receives the node with its computed `x`/`y` filled in, but you draw centered on
`(0, 0)` — it's called inside a `<g transform="translate(node.x, node.y)">` that's already
positioned for you. This is how `OrgChart` draws its name/role box instead of the default circle:

```tsx
renderNode={(node) => {
  const [name, role] = node.label.split(LABEL_SEPARATOR);
  return (
    <>
      <rect x={-60} y={-32} width={120} height={64} rx={6} fill={node.color ?? "#fff"} stroke="#333" />
      <text textAnchor="middle" y={-6} fontWeight="bold">{name}</text>
      <text textAnchor="middle" y={10} fontSize={10}>{role}</text>
    </>
  );
}}
```

**Gotcha**: a custom `renderNode` completely replaces the default rendering, including its bionic
wiring. The default node label goes through `renderBionicSvgText` automatically; a `renderNode`
draws its own `<text>` and gets no bionic support for free. `MindMap` has no custom `renderNode` and
relies on the default; `OrgChart`/`Flowchart`/`PertChart` all wire `renderBionicSvgText` themselves
inside their own `renderNode` — copy that pattern rather than plain `{node.label}` if bionic reading
should still work.

## Highlighting one edge without redrawing all of them

`renderEdgeStyle` is deliberately narrower than `renderNode` — it only overrides an already-drawn
edge's `stroke`/`strokeWidth`, not the line/label/arrow structure itself. Return `undefined` for
every edge you don't want to change. This is how `PertChart` highlights its critical path:

```tsx
renderEdgeStyle={(edge) => {
  const from = computedById.get(edge.source);
  const to = computedById.get(edge.target);
  return from?.critical && to?.critical
    ? { stroke: "var(--rebar-color-danger, #d32f2f)", strokeWidth: 3 }
    : undefined; // leave this edge at its default look
}}
```

## Letting nodes be dragged into place

Node-drag repositioning (`onNodePositionChange`) only fires when `layout="manual"` — in
`"hierarchical"`/`"circular"` layout, positions are recomputed from the input data every render, so
a drag would just snap back. If you want a graph that starts auto-laid-out but becomes
user-rearrangeable, seed `manual` layout's `x`/`y` from this same component's own computed output
once (e.g. capture it via `onViewportChange`, see below), then persist further drags from
`onNodePositionChange(id, x, y)` into whatever state supplies `nodes[].x`/`y`. Don't try to make
`hierarchical`/`circular` draggable — that's an intentionally disabled combination, not a gap.

## Keeping a `DiagramMinimap` in sync

`onViewportChange` fires on every layout/pan/zoom change with `nodes` (every node's resolved
`id`/`x`/`y`) and `viewportBounds` (the currently-visible region, in this component's own layout
coordinate space — already inverted through the current pan/zoom transform for you). This is the
one supported way to connect a `NodeLinkGraph` to a paired `DiagramMinimap`; don't compute
viewport bounds yourself from raw pan/zoom state.

## `search`/filter-style hiding

There isn't one — `NodeLinkGraph` has no `search`/`filterCard`-equivalent prop. Filter `nodes`/
`edges` yourself before passing them in if you need that; the component has no opinion on it.
