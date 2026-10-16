import { Card, Heading, IndexChart, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { gbp, project } from "@/fixtures/tideline";

const CODE = `<IndexChart
  title="Spend, indexed to 100"
  xLabels={["Jun", "Jul", "Aug", "Sep", "Oct"]}
  series={[
    { label: "Harbour rebrand", values: [9000, 17500, 26400, 38100, 46500] },
    { label: "Tideline mobile", values: [30000, 42000, 53000, 62000, 70500] },
  ]}
/>`;

// Cumulative spend per project in GBP, June to October. Different scales, so index them.
const X = ["Jun", "Jul", "Aug", "Sep", "Oct"];
const HARBOUR = [9000, 17500, 26400, 38100, 46500];
const MOBILE = [30000, 42000, 53000, 62000, 70500];
const SIGNAGE = [2000, 4800, 9100, 14700, 20900];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["IndexChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="index-chart"` on the root `<figure>`; `data-rebar-part="mark"` on each point, `"trendline"` on a trendline when `trendline` is set.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically pre-computes the same index-100 rebasing and feeds it to whatever charting library the target project already uses.",
      },
    ],
  },
];


export default function IndexChartPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>IndexChart</Heading>
      <Text color="secondary">A line chart that rebases every series to 100, so different scales compare fairly.</Text>

      <DemoStage
        title="Spend since June"
        caption="Three projects, each indexed to its own June figure"
        code={CODE}
        states={[
          { label: "Two series", node: <IndexChart title="Harbour and mobile" height={170} xLabels={X} series={[{ label: "Harbour rebrand", values: HARBOUR }, { label: "Tideline mobile", values: MOBILE }]} /> },
          { label: "Index to 1000", node: <IndexChart title="Base 1000" height={170} baseValue={1000} xLabels={X} series={[{ label: "Depot signage", values: SIGNAGE }]} /> },
          { label: "Flat series", node: <IndexChart title="Nothing spent" height={170} xLabels={X} series={[{ label: "Rota export", values: [0, 0, 0, 0, 0] }]} /> },
        ]}
      >
        <IndexChart
          title="Spend, indexed to 100"
          xLabels={X}
          series={[
            { label: "Harbour rebrand", values: HARBOUR },
            { label: "Tideline mobile", values: MOBILE },
            { label: "Depot signage", values: SIGNAGE },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget review" caption="Growth in spend, whatever the project size" widths={false}>
        <Card title="Spend since June" subtitle={`${harbour.name} is at ${gbp(46500)} of ${gbp(harbour.budget)}`} extra={<Tag tone="info">Indexed</Tag>} style={{ maxWidth: 600, margin: "0 auto" }}>
          <Stack gap="sm">
            <IndexChart title="Spend, indexed to 100" height={220} xLabels={X} series={[{ label: "Harbour rebrand", values: HARBOUR }, { label: "Tideline mobile", values: MOBILE }, { label: "Depot signage", values: SIGNAGE }]} />
            <Text size="sm" color="secondary">Signage has grown tenfold from a small start; mobile is the biggest but the slowest mover.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
