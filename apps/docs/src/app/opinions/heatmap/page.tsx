import { Card, Heading, Heatmap, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE } from "@/fixtures/tideline";

const CODE = `<Heatmap
  title="Tasks done this week"
  rows={["Maya Chen", "Jonas Weber", "Priya Nair", "Leo Santos"]}
  cols={["Mon", "Tue", "Wed", "Thu", "Fri"]}
  data={[{ row: "Maya Chen", col: "Mon", value: 6 }, /* ... */]}
/>`;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const ROWS = PEOPLE.map((p) => p.name);
// Tasks done per day, in PEOPLE order. null is "no figure" (Leo was off on Wednesday), not zero.
const DONE: (number | null)[][] = [
  [6, 8, 7, 9, 5],
  [9, 7, 11, 8, 6],
  [3, 4, 5, 2, 3],
  [5, 6, null, 7, 4],
];
const DATA = DONE.flatMap((vals, r) => vals.flatMap((v, c) => (v === null ? [] : [{ row: ROWS[r]!, col: DAYS[c]!, value: v }])));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Heatmap"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="heatmap"` on the root `<figure>`; each cell carries `data-rebar-part="cell"` or `"cell-missing"`, plus `data-row`/`data-col`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a heatmap.",
      },
    ],
  },
];


export default function HeatmapPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Heatmap</Heading>
      <Text color="secondary">A grid of shaded cells; a missing figure looks different from a zero.</Text>

      <DemoStage
        title="Tasks done this week"
        caption="One row per person, one column per day. Leo is off on Wednesday."
        code={CODE}
        states={[
          { label: "No data yet", node: <Heatmap title="Tasks done" rows={ROWS.slice(0, 2)} cols={DAYS.slice(0, 3)} data={[]} cellSize={32} /> },
          { label: "Compact", node: <Heatmap title="Tasks done" rows={ROWS.slice(0, 2)} cols={DAYS} data={DATA.filter((d) => ROWS.slice(0, 2).includes(d.row))} cellSize={26} /> },
          { label: "One row", node: <Heatmap title="Maya Chen" rows={[ROWS[0]!]} cols={DAYS} data={DATA.filter((d) => d.row === ROWS[0])} cellSize={32} /> },
        ]}
      >
        <Heatmap title="Tasks done this week" rows={ROWS} cols={DAYS} data={DATA} cellSize={48} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team load" caption="The grid on the weekly summary" widths={false}>
        <Card title="This week" subtitle="Tasks done, 19 to 23 Oct" extra={<Tag tone="info">Mobile release</Tag>} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Heatmap title="Tasks done" rows={ROWS} cols={DAYS} data={DATA} cellSize={44} />
            <Text size="sm" color="secondary">Leo was off on Wednesday, so that cell has no figure rather than a zero.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
