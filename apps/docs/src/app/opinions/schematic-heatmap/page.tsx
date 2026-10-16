"use client";

import { useState } from "react";
import { Card, Heading, HeatmapPainter, SchematicHeatmap, Stack, Tag, Text } from "rebar-ui";
import type { HeatmapBrush, HeatmapLayout, HeatmapRegion, HeatmapValue } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

// The northern depot site plan. Each region is a union of rects in the plan's own units; "East shed" is an L-shape
// drawn from two rects and "Quay yard" is a ring (a hole in the middle), so a multi-rect region is ONE shape with one outline.
const BRUSHES: HeatmapBrush[] = [
  { id: "building", label: "Building", color: "var(--rebar-color-primary)" },
  { id: "outdoor", label: "Outdoor", color: "var(--rebar-color-success)", showLabel: true },
  { id: "service", label: "Service", color: "var(--rebar-color-text-secondary)", showLabel: false },
];

const REGIONS: HeatmapRegion[] = [
  { id: "north-shed", kind: "building", label: "North shed", rects: [[0, 0, 220, 90]] },
  { id: "east-shed", kind: "building", label: "East shed", rects: [[230, 0, 380, 90], [290, 90, 380, 190]] },
  { id: "office", kind: "building", label: "Depot office", rects: [[0, 100, 120, 190]] },
  {
    id: "quay-yard",
    kind: "outdoor",
    label: "Quay yard",
    rects: [[130, 100, 280, 120], [130, 170, 280, 190], [130, 120, 150, 170], [260, 120, 280, 170]],
  },
  { id: "van-park", kind: "outdoor", label: "Van park", rects: [[0, 200, 280, 260]] },
  { id: "generator", kind: "service", label: "Generator", rects: [[290, 200, 380, 260]] },
  { id: "pump-house", kind: "service", label: "Pump house", rects: [[390, 0, 430, 40]] },
];

// Signage installed per area: done of expected panels.
const VALUES: Record<string, HeatmapValue> = {
  "north-shed": { done: 182, expected: 200 },
  "east-shed": { done: 96, expected: 210 },
  office: { done: 12, expected: 140 },
  "quay-yard": 0.55,
  "van-park": { done: 40, expected: 40 },
  // generator and pump-house deliberately have no entry: "no data", not 0%.
};

const CODE = `<SchematicHeatmap
  ariaLabel="Signage installed by area, northern depot"
  regions={[{ id: "north-shed", kind: "building", label: "North shed", rects: [[0, 0, 220, 90]] }, /* ... */]}
  values={{ "north-shed": { done: 182, expected: 200 }, "quay-yard": 0.55 }}
  crop={[-10, -10, 440, 270]}
  selectedId={selected}
  onSelect={setSelected}
/>`;

// Starting layout for the HeatmapPainter demo below.
const PAINTER_SAMPLE: HeatmapLayout = {
  cellSize: 20,
  brushes: [
    { id: "room", label: "Room", color: "var(--rebar-color-primary)" },
    { id: "corridor", label: "Corridor", color: "var(--rebar-color-success)", showLabel: false },
  ],
  frames: [{ id: "frame-1", title: "Frame 1", crop: [-20, -20, 360, 260] }],
  regions: [
    { id: "room-a", kind: "room", label: "Room A", rects: [[0, 0, 120, 100]] },
    { id: "room-b", kind: "room", label: "Room B", rects: [[160, 0, 340, 100], [240, 100, 340, 180]] },
    { id: "hall", kind: "corridor", label: "Hall", rects: [[0, 120, 220, 160]] },
  ],
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SchematicHeatmap"] ?? [] },
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

  return (
    <Stack gap="lg">
      <Heading level={1}>SchematicHeatmap</Heading>
      <Text color="secondary">
        Regions drawn at their own coordinates over a site plan, each shaded by how complete it is, hatched where there is no data.
      </Text>

      <DemoStage
        title="Signage installed"
        caption="Northern depot: hover, focus or click an area"
        code={CODE}
        states={[
          { label: "No data", node: <SchematicHeatmap ariaLabel="No data yet" regions={REGIONS.slice(0, 3)} brushes={BRUSHES} crop={[-10, -10, 390, 200]} /> },
          { label: "Pinned", node: <SchematicHeatmap ariaLabel="Pinned area" regions={REGIONS.slice(0, 3)} brushes={BRUSHES} values={VALUES} crop={[-10, -10, 390, 200]} defaultSelectedId="east-shed" /> },
          { label: "No legend", node: <SchematicHeatmap ariaLabel="Without legend" regions={REGIONS.slice(0, 3)} brushes={BRUSHES} values={VALUES} crop={[-10, -10, 390, 200]} hideLegend /> },
        ]}
      >
        <SchematicHeatmap
          ariaLabel="Signage installed by area, northern depot"
          regions={REGIONS}
          brushes={BRUSHES}
          values={VALUES}
          crop={[-10, -10, 440, 270]}
          selectedId={selected}
          onSelect={setSelected}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Depot signage" caption="The plan beside the project summary" widths={false}>
        <Stack direction="row" gap="md" align="start" style={{ flexWrap: "wrap" }}>
          <Card style={{ flex: "1 1 220px" }} title={project("signage").name} subtitle={project("signage").summary} extra={<Tag tone="info">{project("signage").status}</Tag>}>
            <Stack gap="xs">
              <Text size="sm">{project("signage").done}% done, due {project("signage").due}</Text>
              <Text size="sm" color="secondary">{selected ? `Pinned: ${REGIONS.find((r) => r.id === selected)?.label}` : "Pin an area on the plan to see its numbers."}</Text>
            </Stack>
          </Card>
          <div style={{ flex: "3 1 380px" }}>
            <SchematicHeatmap ariaLabel="Signage installed by area" regions={REGIONS} brushes={BRUSHES} values={VALUES} crop={[-10, -10, 440, 270]} selectedId={selected} onSelect={setSelected} />
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />

      <div id="painter">
        <Stack gap="lg">
          <Heading level={2}>HeatmapPainter</Heading>
          <Text color="secondary">
            The authoring tool that comes with SchematicHeatmap: an infinite canvas for painting the
            regions it draws. Paint a few cells, name them, create the region. The dashboard built on
            these layouts is <a href="/opinions/heatmap-viewer" className="rebar-link">HeatmapViewer</a>.
          </Text>

          <HeatmapPainter
            value={layout}
            onChange={setLayout}
            height={520}
            idSuggestions={["room-c", "room-d", "plant", "stairs"]}
            onUploadBackground={async (file) => ({ url: URL.createObjectURL(file) })}
          />

          <NextBlockRenderer blocks={PAINTER_BLOCKS} />
        </Stack>
      </div>
    </Stack>
  );
}
