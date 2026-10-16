"use client";

import { Card, Heading, Stack, StackedLineChart, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { WEEK_LABELS, DONE_BY_TAG } from "@/fixtures/tideline";

const WEEKS = WEEK_LABELS.slice(-6);
const SERIES = Object.entries(DONE_BY_TAG).map(([label, values]) => ({ label, values }));

const CODE = `<StackedLineChart
  title="Tasks done per week"
  xLabels={["28 Sep", "5 Oct", "12 Oct", "19 Oct"]}
  series={[
    { label: "Design", values: [8, 9, 8, 10] },
    { label: "Eng", values: [7, 10, 9, 11] },
  ]}
  filterable
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["StackedLineChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="stacked-line-chart"` on the root `<figure>`; `data-rebar-part="mark"` on each point.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically pre-computes the same cumulative sums and feeds them to whatever charting library's own line chart the target project uses.",
      },
    ],
  },
];

export default function StackedLineChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>StackedLineChart</Heading>
      <Text color="secondary">Lines that plot a running total, so each line sits on top of the ones before it.</Text>

      <DemoStage
        title="Tasks done per week"
        caption="Cumulative by tag, 14 Sep to 19 Oct"
        code={CODE}
        states={[
          { label: "Two series", node: <StackedLineChart title="Design and Eng" xLabels={WEEKS} series={SERIES.slice(0, 2)} height={180} /> },
          { label: "Single series", node: <StackedLineChart title="Research only" xLabels={WEEKS} series={SERIES.slice(2, 3)} height={180} /> },
          { label: "Formatted axis", node: <StackedLineChart title="Hours" xLabels={WEEKS} series={SERIES.slice(0, 2)} yFormat={(v) => `${v}h`} height={180} /> },
        ]}
      >
        <StackedLineChart title="Tasks done per week" xLabels={WEEKS} series={SERIES} filterable />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Delivery dashboard" caption="A card beside the area chart's totals" widths={false}>
        <Card style={{ maxWidth: 600, margin: "0 auto" }} title="Output by tag" subtitle="Each line includes the ones below it" extra={<Tag>Last 6 weeks</Tag>}>
          <StackedLineChart ariaLabel="Cumulative tasks done by tag" xLabels={WEEKS} series={SERIES} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
