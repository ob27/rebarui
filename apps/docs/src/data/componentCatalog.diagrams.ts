import type { CatalogComponent } from "./componentCatalog.types";

// See componentCatalog.web.ts for sourcing methodology. Every entry originally catalogued here
// has shipped as a real `packages/core` component: Pie/Donut, Radar/Polar, Gauge/Meter, Funnel,
// Waterfall, Box Plot, Sparkline, Bubble, Heatmap, Treemap, Candlestick, Geo/Choropleth, Gantt,
// Sankey, Word Cloud, Node-Link Graph, Advanced Data Grid, Pivot Table, Flowchart, Org Chart,
// Mind Map, and Diagram Minimap — see /components/pie-chart, /components/radar-chart,
// /components/gauge-chart, /components/funnel-chart, /components/waterfall-chart,
// /components/box-plot, /components/sparkline, /components/bubble-chart, /components/heatmap,
// /components/treemap, /components/candlestick-chart, /components/geo-chart,
// /components/gantt-chart, /components/sankey-diagram, /components/word-cloud,
// /components/node-link-graph, /components/data-grid, /components/pivot-table,
// /components/flowchart, /components/org-chart, /components/mind-map, and
// /components/diagram-minimap. The original "cartesian charts" bundle entry
// (Line/Bar/Area/Scatter/Bubble) is fully closed too. `GeoChart` is a deliberate abstraction (an
// abstract regional grid choropleth, not real geographic border rendering) — see its own doc
// comment for why. `OrgChart`/`MindMap`/`Flowchart`/`DiagramMinimap` are thin compositions over
// the foundational `NodeLinkGraph` component rather than four separate reimplementations.
export const DIAGRAM_CATALOG: CatalogComponent[] = [];
