"use client";

import { Card, Heading, Stack, Tag, Text, UMAPPlot } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = "<UMAPPlot\n  title=\"Interview excerpts, by theme\"\n  clusters={[\n    { label: \"Shift swaps\", points: [{ x: 3.1, y: 1.4, id: \"int-04\", preview: \"We still sort swaps out in the group chat.\" }] },\n    { label: \"Notifications\", points: [{ x: -2.4, y: 2.1, id: \"int-09\", preview: \"I need the phone quiet on night watch.\" }] },\n  ]}\n/>";

const CLUSTERS = [
  {
    label: "Shift swaps",
    points: [
      { x: 3.1, y: 1.4, id: "int-04", preview: "We still sort swaps out in the group chat and someone always misses it." },
      { x: 3.6, y: 0.9, id: "int-07", preview: "I would pay for one place that shows who is covering Friday." },
      { x: 2.7, y: 1.9, id: "int-02" },
      { x: 3.3, y: 2.2 },
    ],
  },
  {
    label: "Notifications",
    points: [
      { x: -2.4, y: 2.1, id: "int-09", preview: "On night watch I need the phone quiet unless the pilot boat calls." },
      { x: -1.9, y: 1.6, id: "int-11", preview: "Too many pings. I stopped reading them by Tuesday." },
      { x: -2.8, y: 2.6 },
      { x: -1.5, y: 2.4, id: "int-05" },
      { x: -2.2, y: 1.1 },
    ],
  },
  {
    label: "Training",
    points: [
      { x: 0.4, y: -2.8, id: "int-06", preview: "New starters learn the rota by shadowing, not from the app." },
      { x: 0.9, y: -3.3, id: "int-10", preview: "A five-minute walkthrough on the depot screen would help." },
      { x: -0.2, y: -2.4 },
    ],
  },
];
const PLAIN = CLUSTERS.map((c) => ({ label: c.label, points: c.points.map((p) => ({ x: p.x, y: p.y })) }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["UMAPPlot"] ?? [] },
  {
    type: "doc-section",
    heading: "Reading the plot",
    body: [{ kind: "text", text: "There are no numeric ticks on purpose: only distance and clustering mean anything in a UMAP. Hover shows a point's `preview`; click keeps its tag, click empty space clears it." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"umap-plot\"` on the root `<figure>`; `data-rebar-part=\"point\"` per point, `\"cluster\"` per group, and `\"legend\"`, `\"legend-item\"`, `\"legend-swatch\"` for the legend." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no charts (it points to `@ant-design/charts`), so there is no 1:1 mapping." }],
  },
];

export default function UmapPlotPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>UMAPPlot</Heading>
      <Text color="secondary">A 2D scatter of embeddings, grouped by cluster; hover a point to read its record.</Text>

      <DemoStage title="Interview excerpts" caption="Hover or click a point to read the excerpt" code={CODE}
        states={[
          { label: "One cluster", node: <UMAPPlot title="Shift swaps only" clusters={CLUSTERS.slice(0, 1)} height={220} /> },
          { label: "No previews", node: <UMAPPlot title="Plain points" clusters={PLAIN} height={220} /> },
        ]}>
        <UMAPPlot title="Interview excerpts, by theme" clusters={CLUSTERS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Themes" caption="The plot beside what it found" widths={false}>
        <Card style={{ maxWidth: 640, margin: "0 auto" }} title="Crew interviews" subtitle="12 calls, 3 themes" labels={[{ label: "Late", tone: "error" }]}>
          <Stack gap="md">
            <UMAPPlot title="Excerpts by theme" clusters={CLUSTERS} height={260} />
            <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
              {CLUSTERS.map((c) => (
                <Tag key={c.label}>{`${c.label}, ${c.points.length} excerpts`}</Tag>
              ))}
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
