"use client";

import { useMemo, useState } from "react";
import { Heading, HeatmapPainter, HeatmapViewer, Stack, Text, createStubHeatmapSource } from "rebar-ui";
import type { HeatmapLayout, HeatmapViewerNarrativeContext, HeatmapViewerSource } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// A tiny stand-in for the "narrative" slot: it only reads what the viewer hands it. A real host would send
// the same context to its own summariser.
function Narrative({ ctx }: { ctx: HeatmapViewerNarrativeContext }) {
  const ranked = ctx.regions.filter((r) => r.share !== null).sort((a, b) => (a.share ?? 0) - (b.share ?? 0));
  const subject = ctx.selected.length > 0 ? ctx.selected.map((r) => r.label).join(" + ") : `all ${ctx.regions.length} zones in view`;
  return (
    <Text size="sm" color="secondary">
      {ctx.metric.label} for {subject} on {ctx.date ?? "the latest snapshot"}.{" "}
      {ranked.length > 0 ? `Furthest behind: ${ranked[0]!.label} (${ranked[0]!.text}).` : "Nothing has figures yet."}
    </Text>
  );
}

// The painter's starting layout: three painted regions and one frame, so the preview below has something to show.
const PAINTER_SAMPLE: HeatmapLayout = {
  cellSize: 20,
  brushes: [
    { id: "room", label: "Room", color: "#0066cc" },
    { id: "corridor", label: "Corridor", color: "#2e7d32", showLabel: false },
  ],
  frames: [{ id: "frame-1", title: "Frame 1", crop: [-20, -20, 360, 260] }],
  regions: [
    { id: "room-a", kind: "room", label: "Room A", rects: [[0, 0, 120, 100]] },
    { id: "room-b", kind: "room", label: "Room B", rects: [[160, 0, 340, 100], [240, 100, 340, 180]] },
    { id: "hall", kind: "corridor", label: "Hall", rects: [[0, 120, 220, 160]] },
  ],
};

// A stable pseudo-figure per region id so a freshly painted region has something to shade; the hall has none,
// to show "no data" hatching.
function demoCell(id: string): { done: number; expected: number } | undefined {
  if (id.includes("hall")) return undefined;
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return { done: Math.abs(h) % 11, expected: 10 };
}

// The smallest possible HeatmapViewerSource over a painted layout: one drawing, one progress metric, made-up
// figures. A real host would replace the figures with its own data and keep the layout from the painter as is.
function sourceFromLayout(layout: HeatmapLayout): HeatmapViewerSource {
  const id = "painted";
  const cells: Record<string, Record<string, { done: number; expected: number }>> = {};
  for (const r of layout.regions) {
    const cell = demoCell(r.id);
    if (cell) cells[r.id] = { progress: cell };
  }
  return {
    listHeatmaps: async () => [{ id, title: "Painted layout", regionCount: layout.regions.length }],
    getHeatmap: async () => ({ ...layout, id, title: "Painted layout", metrics: [{ id: "progress", label: "Progress", kind: "progress" }] }),
    getSnapshot: async () => ({ date: null, dates: [], computedAt: null, cells }),
  };
}

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '// Standalone, on the built-in made-up source:\n<HeatmapViewer title="Collection heatmap" />\n\n// Over your own data — implement HeatmapViewerSource:\nconst source: HeatmapViewerSource = {\n  listHeatmaps: () => api.get("/heatmaps"),\n  getHeatmap: (id) => api.get(`/heatmaps/${id}`),            // a HeatmapViewerDef\n  getSnapshot: ({ heatmapId, date, filters }) => api.post(`/heatmaps/${heatmapId}/snapshot`, { date, filters }),\n  refresh: (query) => api.post("/heatmaps/recompute", query),  // optional\n};\n<HeatmapViewer source={source} renderNarrative={(ctx) => <Summary {...ctx} />} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["HeatmapViewer"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "`SchematicHeatmap` draws one shaded plot and `HeatmapPainter` authors the layout under it. A dashboard needs the rest: pick a drawing, pick a frame, choose what to shade by, show or hide kinds of region, slice by a field, scrub back through dated snapshots, read the key numbers for what you pinned, and see it as a table. `HeatmapViewer` is that whole module, as one construct, with the interaction built in and the data left to you.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The data source",
    body: [
      {
        kind: "text",
        text: "The viewer fetches nothing itself. It talks to a `HeatmapViewerSource` with three methods (a fourth, `refresh`, is optional): `listHeatmaps()` for the picker, `getHeatmap(id)` for one drawing, and `getSnapshot({ heatmapId, date, filters })` for the figures. With no `source` it runs on `createStubHeatmapSource()` — two made-up drawings and deterministic snapshots — which is what this page uses, and what to copy when writing your own.",
      },
      {
        kind: "text",
        text: "A drawing (`HeatmapViewerDef`) is the painter's `HeatmapLayout` plus how to read it: `metrics` (each a `progress` done/expected pair or a plain `count`), an optional `metricsPanel` (placement, rows, headings, which rows can shade the drawing), `filters`, an optional banded `scale`, and `wayback`. A snapshot holds `cells[regionId][metricId]`, the available dates, optional milestones, and each filter's values. A region built from others lists them in `memberIds` and its figures are summed — exactly for counts and done/expected pairs.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Reading the drawing",
    body: [
      {
        kind: "text",
        text: "Press a region to pin it; Shift/Ctrl/Cmd-press adds or removes one; pressing empty space or Escape clears. The metrics panel then speaks only to the pinned regions (or the whole view when none is pinned), and `renderNarrative` receives the same subject. A region with no figure is hatched — \"no data\" is never drawn as 0%. A count metric has no natural 0..1 scale, so each region is placed against the biggest count in view and the legend says so.",
      },
      {
        kind: "text",
        text: "The panel can dock on any side (`footer`, `top`, `left`, `right`) or open as a pop-over beside the pinned region (`popover`); the Metrics control lets a viewer hide rows they do not want, remembered per drawing in their browser. Brushes with a `group` are offered one group at a time, so overlays that must not be drawn together never are.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Snapshots over time",
    body: [
      {
        kind: "text",
        text: "When a snapshot lists `dates`, a `WaybackSlider` scrubs through them and each change re-asks the source with that date (the latest date is asked as `null`). Milestones render as diamonds under the slider at their date's stop; ones close enough to overlap merge into a counted marker, and pressing it jumps to the last. Days listed in `reconstructedDates` are labelled as derived rather than measured. While a snapshot reports `computing: true` the viewer polls (`pollMs`) until figures arrive.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Exported helpers",
    body: [
      {
        kind: "text",
        text: "Pure and importable from `rebar-ui`, for hosts building their own source or UI around the same rules: `sumCells`, `metricValue`, `shadeValue`, `shadeRegions`, `shadeOptionsOf`, `brushGroupsOf`, `defaultVisibleBrushesIn`, `chipBrushes`, `frameFor`, `bandIndexFor`, `bandColorFor`, `groupMilestones`, and `DEFAULT_BANDED_SCALE`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="heatmap-viewer"` on the root `<section>`; `data-rebar-state="expanded"` while full screen. Parts: `header`, `freshness`, `brushes`, `brush-chip` (with `data-brush`), `filters`, `wayback`, `milestones`, `milestone`, `wayback-note`, `layout` (with `data-placement`), `plot`, `metrics-panel`, `subject`, `metrics-picker`, `panel-heading`, `metric-row` (with `data-metric`, and `data-shading` on the one shading the drawing), `narrative`, `error`, `computing`, `not-computed`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — Ant Design ships no schematic or BI-dashboard component. The module is composed of `Select`, `MultiSelect`, `SegmentedControl`, `Table`, `Popover` and `Checkbox`, which map to their AntD equivalents individually, around the owned-SVG `SchematicHeatmap`.",
      },
    ],
  },
];

const PAINTER_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Painter: how it feeds the viewer",
    body: [
      {
        kind: "text",
        text: "`HeatmapPainter` is the authoring half of the same module: it edits one `HeatmapLayout` (cell size, brushes, an optional tracing image, frames, regions), and `HeatmapViewerDef` *is* that layout plus metrics, filters and a scale. So the painter's `onChange` output goes straight into `getHeatmap` with nothing converted, as `sourceFromLayout` does above. The painter knows nothing about your data or where images are stored; it hands the host the whole next layout after every edit, and the host decides where to save it.",
      },
      {
        kind: "code",
        code: '<HeatmapPainter\n  value={layout}\n  onChange={setLayout}\n  onUploadBackground={async (file) => ({ url: await store(file) })}\n/>\n\n// then, in your HeatmapViewerSource:\ngetHeatmap: async (id) => ({ ...(await loadLayout(id)), id, title, metrics, filters }),',
      },
      {
        kind: "text",
        text: "Painting in short: scroll pans, Ctrl/Cmd+scroll zooms, hold Space to grab the canvas. The **Paint** tool colours cells by dragging (Shift-drag paints a box; starting on a painted cell erases), and naming the painted area creates a region. The **Frame** tool drags out the named rectangles the viewer's frame picker offers. The full prop table, host integration points (region-id pickers, image upload, persistence) and keyboard notes are on the [SchematicHeatmap page](/opinions/schematic-heatmap#painter).",
      },
    ],
  },
];

export default function HeatmapViewerPage() {
  // A little latency so the loading states are visible; the data is made up.
  const source = useMemo(() => createStubHeatmapSource({ delayMs: 150 }), []);
  const [layout, setLayout] = useState<HeatmapLayout>(PAINTER_SAMPLE);
  const painted = useMemo(() => sourceFromLayout(layout), [layout]);
  return (
    <Stack gap="lg">
      <Heading level={1}>HeatmapViewer</Heading>
      <Text color="secondary">
        A heatmap dashboard in one construct: drawing and frame pickers, shade-by, brush groups, slicers, a
        snapshot-date slider, a metrics panel and a table view around a SchematicHeatmap. Pin a region,
        Shift-press a second, scrub the date, switch the drawing.
      </Text>

      <HeatmapViewer source={source} title="Collection heatmap" renderNarrative={(ctx) => <Narrative ctx={ctx} />} />
      <Text size="sm" color="secondary">
        Every number here comes from the built-in stub source and is made up.
      </Text>

      <NextBlockRenderer blocks={BLOCKS} />

      <div id="painter">
        <Stack gap="lg">
          <Heading level={2}>The painter: authoring the layouts</Heading>
          <Text color="secondary">
            Drawings are painted, not extracted. Paint a few cells, name them, create the region, and the
            viewer below picks it up (the figures are made up).
          </Text>

          <HeatmapPainter
            value={layout}
            onChange={setLayout}
            height={520}
            idSuggestions={["room-c", "room-d", "plant", "stairs"]}
            onUploadBackground={async (file) => ({ url: URL.createObjectURL(file) })}
          />

          <Text size="sm" color="secondary">
            The viewer below reads the painter&apos;s layout through a one-drawing source.
          </Text>
          <HeatmapViewer source={painted} title="Painted layout" />

          <NextBlockRenderer blocks={PAINTER_BLOCKS} />
        </Stack>
      </div>
    </Stack>
  );
}
