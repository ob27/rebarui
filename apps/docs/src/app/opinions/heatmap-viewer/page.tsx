"use client";

import { useMemo, useState } from "react";
import { Card, Heading, HeatmapPainter, HeatmapViewer, Stack, Text, createStubHeatmapSource } from "rebar-ui";
import type { HeatmapLayout, HeatmapViewerNarrativeContext, HeatmapViewerSource } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `const source: HeatmapViewerSource = {
  listHeatmaps: () => api.get("/heatmaps"),
  getHeatmap: (id) => api.get("/heatmaps/" + id),
  getSnapshot: ({ heatmapId, date, filters }) => api.post("/heatmaps/" + heatmapId + "/snapshot", { date, filters }),
};
<HeatmapViewer source={source} title="Collection heatmap" renderNarrative={(ctx) => <Summary {...ctx} />} />`;

// The "narrative" slot: a one-line summary of whatever is pinned.
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

// Depot signage floor plan: three depots and the yard between them.
const DEPOTS: HeatmapLayout = {
  cellSize: 20,
  brushes: [
    { id: "depot", label: "Depot", color: "var(--rebar-color-primary)" },
    { id: "yard", label: "Yard", color: "var(--rebar-color-success)", showLabel: false },
  ],
  frames: [{ id: "frame-1", title: "All depots", crop: [-20, -20, 360, 260] }],
  regions: [
    { id: "north-depot", kind: "depot", label: "North depot", rects: [[0, 0, 120, 100]] },
    { id: "quay-depot", kind: "depot", label: "Quay depot", rects: [[160, 0, 340, 100], [240, 100, 340, 180]] },
    { id: "yard", kind: "yard", label: "Yard", rects: [[0, 120, 220, 160]] },
  ],
};

// Signs fitted per region: the yard has no figure, which hatches rather than reading as 0%.
const FITTED: Record<string, { done: number; expected: number }> = {
  "north-depot": { done: 9, expected: 10 },
  "quay-depot": { done: 5, expected: 10 },
  "east-depot": { done: 2, expected: 10 },
};
function figureFor(id: string): { done: number; expected: number } | undefined {
  if (id === "yard") return undefined;
  return FITTED[id] ?? { done: (id.length * 3) % 11, expected: 10 };
}

function sourceFromLayout(layout: HeatmapLayout, title: string): HeatmapViewerSource {
  const id = "layout";
  const cells: Record<string, Record<string, { done: number; expected: number }>> = {};
  for (const r of layout.regions) {
    const cell = figureFor(r.id);
    if (cell) cells[r.id] = { progress: cell };
  }
  return {
    listHeatmaps: async () => [{ id, title, regionCount: layout.regions.length }],
    getHeatmap: async () => ({ ...layout, id, title, metrics: [{ id: "progress", label: "Signs fitted", kind: "progress" }] }),
    getSnapshot: async () => ({ date: null, dates: [], computedAt: null, cells }),
  };
}

const STUB = createStubHeatmapSource({ delayMs: 150 });
const SLOW = createStubHeatmapSource({ delayMs: 600000 });
const FAILING: HeatmapViewerSource = {
  listHeatmaps: async () => {
    throw new Error("The collection service did not answer");
  },
  getHeatmap: async () => {
    throw new Error("The collection service did not answer");
  },
  getSnapshot: async () => {
    throw new Error("The collection service did not answer");
  },
};
const DEPOT_SOURCE = sourceFromLayout(DEPOTS, "Depot signage");

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["HeatmapViewer"] ?? [] },
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


const PAINTER_CODE = `<HeatmapPainter value={layout} onChange={setLayout} onUploadBackground={async (file) => ({ url: await store(file) })} />`;

export default function HeatmapViewerPage() {
  const signage = project("signage");
  const [layout, setLayout] = useState<HeatmapLayout>(DEPOTS);
  const painted = useMemo(() => sourceFromLayout(layout, "Painted layout"), [layout]);
  return (
    <Stack gap="lg">
      <Heading level={1}>HeatmapViewer</Heading>
      <Text color="secondary">A heatmap dashboard: drawing and frame pickers, shade-by, filters, a date slider and a metrics panel around a schematic.</Text>

      <DemoStage
        title="Collection heatmap"
        caption="Pin a region, Shift-press a second, scrub the date"
        code={CODE}
        widths={false}
        states={[
          { label: "Loading", node: <HeatmapViewer source={SLOW} title="Collection heatmap" /> },
          { label: "Error", node: <HeatmapViewer source={FAILING} title="Collection heatmap" /> },
        ]}
      >
        <HeatmapViewer source={STUB} title="Collection heatmap" renderNarrative={(ctx) => <Narrative ctx={ctx} />} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Depot signage" caption={`${signage.name}: signs fitted per depot`} widths={false}>
        <Card title={signage.name} subtitle={`Due ${signage.due}`} style={{ maxWidth: 760, margin: "0 auto" }}>
          <HeatmapViewer source={DEPOT_SOURCE} title="Depot signage" />
        </Card>
      </DemoStage>

      <div id="painter">
        <Stack gap="lg">
          <Heading level={2}>The painter</Heading>
          <Text color="secondary">Paint cells, name them to make a region, and the viewer reads the layout.</Text>
          <DemoStage title="Layout painter" caption="Scroll pans, Ctrl or Cmd scroll zooms, Space grabs" code={PAINTER_CODE} widths={false}>
            <Stack gap="md">
              <HeatmapPainter
                value={layout}
                onChange={setLayout}
                height={520}
                idSuggestions={["east-depot", "workshop", "stairs"]}
                onUploadBackground={async (file) => ({ url: URL.createObjectURL(file) })}
              />
              <HeatmapViewer source={painted} title="Painted layout" />
            </Stack>
          </DemoStage>
        </Stack>
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
