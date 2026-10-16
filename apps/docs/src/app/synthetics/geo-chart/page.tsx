import { Card, GeoChart, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<GeoChart
  title="Crew interviews by harbour area"
  regions={[{ id: "ferry", label: "Ferry", value: 4 }, { id: "quay", label: "Quay", value: 2 } /* ... */]}
  layout={[{ id: "ferry", row: 0, col: 2 }, { id: "quay", row: 1, col: 1 } /* ... */]}
  cellSize={72}
/>`;

// The twelve crew interviews, by where on the harbour each person works.
const AREAS = [
  { id: "pilot", label: "Pilot", value: 2 },
  { id: "depot-n", label: "North", value: 1 },
  { id: "ferry", label: "Ferry", value: 4 },
  { id: "office", label: "Office", value: 2 },
  { id: "quay", label: "Quay", value: 1 },
  { id: "dock", label: "Dock", value: 2 },
];
// A rough plan of the harbour: north depot above the ferry terminal and pilot station, the quay and dock along the front.
const LAYOUT = [
  { id: "depot-n", row: 0, col: 1 },
  { id: "pilot", row: 0, col: 2 },
  { id: "office", row: 1, col: 0 },
  { id: "ferry", row: 1, col: 1 },
  { id: "quay", row: 1, col: 2 },
  { id: "dock", row: 2, col: 1 },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["GeoChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="geo-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a real geographic choropleth typically migrates to a dedicated mapping library (e.g. `@ant-design/charts`' geo chart, built on real GeoJSON) rather than an antd component, since this component's own abstraction wouldn't carry over as-is.",
      },
    ],
  },
];

export default function GeoChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>GeoChart</Heading>
      <Text color="secondary">A shaded grid of regions you place yourself: a choropleth without map data.</Text>

      <DemoStage
        title="Interviews by harbour area"
        caption="Darker means more interviews; hover a cell for the figure"
        code={CODE}
        states={[
          { label: "One region", node: <GeoChart title="Ferry terminal" regions={[AREAS[2]!]} cellSize={64} /> },
          { label: "Even values", node: <GeoChart title="Even" regions={AREAS.map((a) => ({ ...a, value: 2 }))} layout={LAYOUT} cellSize={44} /> },
          { label: "Default layout", node: <GeoChart title="No layout" regions={AREAS} cellSize={44} /> },
        ]}
      >
        <GeoChart title="Crew interviews by harbour area" regions={AREAS} layout={LAYOUT} cellSize={72} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Research summary" caption="The map beside the headline numbers" widths={false}>
        <Card title="Crew interviews" subtitle="12 calls, 6 to 20 Oct">
          <Stack direction="row" gap="lg" align="center" style={{ flexWrap: "wrap" }}>
            <GeoChart title="By harbour area" regions={AREAS} layout={LAYOUT} cellSize={64} />
            <Stack gap="xs">
              <Text size="sm" color="secondary">Most heard from</Text>
              <Text style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 28 }}>Ferry terminal</Text>
              <Text size="sm" color="secondary">4 of 12 interviews</Text>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
