import { Card, Heading, PieChart, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, gbp, person } from "@/fixtures/tideline";

const CODE = `<PieChart
  title="Budget by project"
  slices={[
    { label: "Tideline mobile", value: 72900 },
    { label: "Harbour rebrand", value: 48200 },
    { label: "Depot signage", value: 21800 },
    { label: "Other", value: 15550 },
  ]}
/>`;

const SLICES = [
  { label: "Tideline mobile", value: 72900 },
  { label: "Harbour rebrand", value: 48200 },
  { label: "Depot signage", value: 21800 },
  { label: "Other", value: 15550 },
];
const TOTAL = PROJECTS.reduce((n, p) => n + p.budget, 0);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PieChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="pie-chart"` on the root `<figure>`; parts: `slice-group`, `slice` (carries `data-rebar-exploded` when that slice is popped out), `legend`, `inside-label`, `outside-label`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a pie chart, so a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function PieChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PieChart</Heading>
      <Text color="secondary">A pie or donut showing how a few parts make up a whole.</Text>

      <DemoStage
        title="Budget by project"
        caption="Legend below the pie; four parts at most"
        code={CODE}
        states={[
          { label: "Donut", node: <PieChart title="Budget by project" slices={SLICES} innerRadiusRatio={0.6} /> },
          { label: "Labels inside", node: <PieChart title="Budget by project" slices={SLICES} labelPosition="inside" /> },
          { label: "Labels outside", node: <PieChart title="Budget by project" slices={SLICES} labelPosition="outside" /> },
          { label: "Exploded", node: <PieChart title="Budget by project" slices={SLICES.map((s, i) => (i === 0 ? { ...s, exploded: true } : s))} /> },
          { label: "One slice", node: <PieChart title="Rota export" slices={[{ label: "Rota export", value: 6150 }]} /> },
        ]}
      >
        <PieChart title="Budget by project" slices={SLICES} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget card" caption={`A donut beside the figures, ${gbp(TOTAL)} in all`} widths={false}>
        <Card title="Budget" subtitle="All five projects" extra={<Tag>{gbp(TOTAL)}</Tag>}>
          <Stack direction="row" gap="lg" align="center" style={{ flexWrap: "wrap" }}>
            <PieChart title="Budget by project" slices={SLICES} innerRadiusRatio={0.6} />
            <Stack gap="sm">
              {PROJECTS.slice(0, 3).map((p) => (
                <Stack key={p.id} direction="row" gap="sm" align="center">
                  <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                  <Text size="sm">{p.name}</Text>
                  <Text size="sm" color="secondary">{gbp(p.budget)} · {person(p.owner).name}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
