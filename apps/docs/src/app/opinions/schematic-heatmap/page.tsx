"use client";

import { useMemo, useState } from "react";
import { Heading, HeatmapPainter, SchematicHeatmap, Stack, Text, framesOf } from "rebar-ui";
import type { HeatmapBrush, HeatmapLayout, HeatmapRegion, HeatmapValue } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// Made-up data: a fictional campus site plan. Each region is a union of rects in the plan's own
// units; "East Hall" is an L-shape drawn from two rects and "Courtyard" is a ring (a hole in the
// middle), to show that a multi-rect region is ONE shape with one outline.
const BRUSHES: HeatmapBrush[] = [
  { id: "building", label: "Building", color: "#0066cc" },
  { id: "outdoor", label: "Outdoor", color: "#2e7d32", showLabel: true },
  { id: "service", label: "Service", color: "#757575", showLabel: false },
];

const REGIONS: HeatmapRegion[] = [
  { id: "north-block", kind: "building", label: "North Block", rects: [[0, 0, 220, 90]] },
  { id: "east-hall", kind: "building", label: "East Hall", rects: [[230, 0, 380, 90], [290, 90, 380, 190]] },
  { id: "library", kind: "building", label: "Library", rects: [[0, 100, 120, 190]] },
  {
    id: "courtyard",
    kind: "outdoor",
    label: "Courtyard",
    rects: [[130, 100, 280, 120], [130, 170, 280, 190], [130, 120, 150, 170], [260, 120, 280, 170]],
  },
  { id: "car-park", kind: "outdoor", label: "Car park", rects: [[0, 200, 280, 260]] },
  { id: "plant-room", kind: "service", label: "Plant", rects: [[290, 200, 380, 260]] },
  { id: "pump-house", kind: "service", label: "Pump house", rects: [[390, 0, 430, 40]] },
];

const VALUES: Record<string, HeatmapValue> = {
  "north-block": { done: 182, expected: 200 },
  "east-hall": { done: 96, expected: 210 },
  library: { done: 12, expected: 140 },
  courtyard: 0.55,
  "car-park": { done: 40, expected: 40 },
  // plant-room and pump-house deliberately have no entry — "no data", not 0%.
};

// Starting layout for the HeatmapPainter demo below.
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

// A stable pseudo-value per region id, so the live plot below has something to shade.
function demoValue(id: string): HeatmapValue | undefined {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const done = Math.abs(h) % 11;
  return id.includes("hall") ? undefined : { done, expected: 10 };
}

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<SchematicHeatmap\n  ariaLabel="Handover progress by zone"\n  regions={[{ id: "north-block", kind: "building", label: "North Block", rects: [[0, 0, 220, 90]] }, /* ... */]}\n  values={{ "north-block": { done: 182, expected: 200 }, courtyard: 0.55 }}\n  crop={[-10, -10, 440, 270]}\n  selectedId={selected}\n  onSelect={setSelected}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SchematicHeatmap"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "Heatmap is a row-by-column matrix and GeoChart projects a map; neither can draw a floor plan, a site layout or a long thin strip of intervals *where the source drawing has them*. SchematicHeatmap draws arbitrary rectangle-union regions at their own coordinates and shades each by how complete it is, optionally over a tracing image of the original drawing. Nothing in it knows what the numbers mean — the host supplies `values` keyed by region id, and brings its own filters and table view alongside.",
      },
      {
        kind: "text",
        text: "`HeatmapPainter` (the last section of this page) is its authoring counterpart and ships with it: paint the regions on a canvas, and the layout it produces (`HeatmapLayout`) feeds straight into this component's `regions`, `brushes`, `background` and a frame's `crop`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "One region, one shape",
    body: [
      {
        kind: "text",
        text: 'A region painted as several rectangles is drawn with one fill per rect but a single closed outline around the whole union — computed by the exported pure helper `outlinePath(rects)`, which traces the outer boundary and any holes (the Courtyard above is a ring). That is why East Hall reads as one L-shaped block with no seam line where its two rects meet. The outline is a closed path, so `stroke-linejoin` rounds its corners.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "No data is not zero",
    body: [
      {
        kind: "text",
        text: "A region with no entry in `values`, a non-finite number, or `expected <= 0` is drawn as a neutral diagonal hatch, never as the lightest shade. \"Nothing was collected here\" and \"0% complete\" are different claims. `values` accepts either `{ done, expected }` (shaded by `done / expected`) or a ready-made 0..1 share. The default `colorScale` is eight steps of `--rebar-color-primary` blended into the page background; pass your own `colorScale` to change it, and `labels`/`formatValue` to change the wording.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Selection and keyboard",
    body: [
      {
        kind: "text",
        text: "Each region is a focusable `role=\"button\"` with an accessible name carrying its value. Hover or focus shows its numbers in the readout; click, Enter or Space pins it (`aria-pressed`), Escape un-pins. Selection is controlled via `selectedId`/`onSelect` (where `null` means \"none\") or uncontrolled via `defaultSelectedId`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Exported helpers",
    body: [
      {
        kind: "text",
        text: "Pure functions, importable from `rebar-ui`: `outlinePath`, `regionBounds`, `contentBounds`, `framesOf`, `brushesOf`, `brushesInFrame`, `regionsInFrame`, `defaultVisibleBrushes`, `shareOf`, `labelLayout`. A host builds its own brush filter chips and frame picker from `brushesInFrame`/`regionsInFrame`/`framesOf` and passes the filtered `regions` and the chosen frame's `crop` in.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="schematic-heatmap"` on the root `<figure>`; `data-rebar-state` is `idle`, `hovering` or `selected`. Parts: `canvas` (the `<svg>`), `background`, `region` (with `data-region="<id>"` and `data-rebar-state` of `value`, `no-data` or `selected`), `region-outline`, `region-label`, `legend-row`, `readout`, `legend`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart or schematic components (it points to `@ant-design/charts`), and there is no 1:1 mapping. Keep this component as a small owned SVG, or redraw regions in your charting library of choice.",
      },
    ],
  },
];

const PAINTER_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Painter: Code",
    body: [
      {
        kind: "code",
        code: '<HeatmapPainter\n  value={layout}\n  onChange={setLayout}\n  height={560}\n  idSuggestions={knownAreaIds}\n  onUploadBackground={async (file) => ({ url: await store(file) })}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Painter: Props", rows: componentProps["HeatmapPainter"] ?? [] },
  {
    type: "doc-section",
    heading: "Painter: What it's for",
    body: [
      {
        kind: "text",
        text: "Extracting a drawing's geometry automatically proved hit-and-miss, so the layouts `SchematicHeatmap` draws are *painted*: lay a grid over a tracing image, colour in cells, and turn the painted area into a named region. This is that authoring tool, with no knowledge of where region ids or images come from. It edits one `HeatmapLayout` (cell size, brushes, optional tracing image, frames, regions) — controlled via `value`/`onChange`, or uncontrolled via `defaultValue` — and the host decides how to save it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Painter: Using it",
    body: [
      {
        kind: "text",
        text: "The canvas is infinite: scroll pans, Ctrl/Cmd+scroll (or pinch) zooms at the cursor, hold Space (or the middle button) and drag to grab it. The **Paint** tool paints cells by dragging, Shift-drag paints a box, and starting a stroke on a painted cell erases. Name the painted area in the side panel and create the region; its rectangles are merged by a greedy run-merge (`cellsToRects`), and **Edit** loads a region's cells back for re-painting (`rectsToCells`). The **Frame** tool drags out the named rectangles a plot will show; move a frame by its body, resize it by its eight handles, press Delete to remove it. The focused canvas also takes arrow keys (pan), + / - (zoom) and 0 (fit).",
      },
      {
        kind: "text",
        text: "Painting itself is pointer-only (there is no keyboard cell cursor); every other control in the side panel is a native, keyboard-operable form control. Destructive buttons (delete, clear all) need a second press.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Painter: Host integration points",
    body: [
      {
        kind: "text",
        text: "**Region ids.** The default form is a plain text field, with `idSuggestions` offered through a native datalist. To plug in your own picker (an area search, a register lookup), pass `renderCellForm`, which receives the draft state and a `create()` function. `onCreateRegion` can transform or veto (`return false`) a region just before it is added.",
      },
      {
        kind: "text",
        text: "**Images.** The painter never uploads anything: `onUploadBackground(file)` must store the file and resolve `{ url, width?, height?, version? }`, and `onRemoveBackground` lets you delete it. Without `onUploadBackground` the upload control is not offered. On this page the handler returns a session-only `blob:` URL.",
      },
      {
        kind: "text",
        text: "**Persistence.** None — `onChange` receives the whole next layout after every edit; save it however you like. Painted-but-uncreated cells are transient UI state and never leave the component.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Painter: Exported pure helpers",
    body: [
      {
        kind: "text",
        text: "`cellsToRects`, `rectsToCells`, `outlinePath`, `fitCamera`, `zoomCameraAt`, `scrollCamera`, `dragCamera`, `screenToWorld`, `worldToScreen`, `hitHandle`, `resizeBounds`, `moveBounds`, `frameAt`, and the layout helpers. The camera, frame hit-testing and resize math are plain functions, unit-tested directly — jsdom cannot drive canvas or real pointer geometry.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Painter: data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="heatmap-painter"` on the root; `data-rebar-state` is the current tool (`paint` or `frame`). Parts: `stage`, `canvas`, `tools`, `tool-paint`, `tool-frame`, `zoom`, `zoom-readout`, `panel`, `toolbar`, `notice` (a `role="status"` line), `cell-form`, `frames-section`, `frame-row`, `brushes-section`, `brush-row`, `image-section`, `image-input`, `regions-section`, `region-row`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Painter: Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no canvas authoring component. The side panel maps onto AntD's `Collapse`, `Input`, `Select`, `Slider` and `Popconfirm`; the canvas itself is plain `<canvas>` and carries over unchanged.",
      },
    ],
  },
];

export default function SchematicHeatmapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [layout, setLayout] = useState<HeatmapLayout>(PAINTER_SAMPLE);
  const frame = useMemo(() => framesOf(layout)[0]!, [layout]);
  const painted = useMemo(
    () => Object.fromEntries(layout.regions.map((r) => [r.id, demoValue(r.id)])),
    [layout.regions],
  );

  return (
    <Stack gap="lg">
      <Heading level={1}>SchematicHeatmap</Heading>
      <Text color="secondary">
        Regions drawn at their own coordinates over a site plan, each shaded by how complete it is —
        hatched where there is no data. Hover, focus or click a region.
      </Text>

      <SchematicHeatmap
        ariaLabel="Handover progress by zone, fictional campus"
        regions={REGIONS}
        brushes={BRUSHES}
        values={VALUES}
        crop={[-10, -10, 440, 270]}
        selectedId={selected}
        onSelect={setSelected}
      />
      <Text size="sm" color="secondary">
        {selected ? `Pinned: ${selected} (controlled by this page's own state).` : "Nothing pinned."} The
        data here is made up.
      </Text>

      <NextBlockRenderer blocks={BLOCKS} />

      <div id="painter">
        <Stack gap="lg">
          <Heading level={2}>HeatmapPainter</Heading>
          <Text color="secondary">
            The authoring tool that comes with SchematicHeatmap: an infinite canvas for painting the
            regions it draws. Paint a few cells, name them, create the region — then watch the plot
            below update.
          </Text>

          <HeatmapPainter
            value={layout}
            onChange={setLayout}
            height={520}
            idSuggestions={["room-c", "room-d", "plant", "stairs"]}
            onUploadBackground={async (file) => ({ url: URL.createObjectURL(file) })}
          />

          <Text size="sm" color="secondary">
            The plot below is fed straight from the painter&apos;s layout (made-up values).
          </Text>
          <SchematicHeatmap
            ariaLabel="Plot of the painted layout"
            regions={layout.regions}
            brushes={layout.brushes}
            background={layout.background}
            crop={frame.crop}
            values={painted}
          />

          <NextBlockRenderer blocks={PAINTER_BLOCKS} />
        </Stack>
      </div>
    </Stack>
  );
}
