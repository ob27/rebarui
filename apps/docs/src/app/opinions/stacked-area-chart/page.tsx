"use client";

import { Card, Heading, Stack, StackedAreaChart, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { WEEK_LABELS, DONE_BY_TAG } from "@/fixtures/tideline";

const WEEKS = WEEK_LABELS.slice(-6);
const SERIES = Object.entries(DONE_BY_TAG).map(([label, values]) => ({ label, values }));

const CODE = `<StackedAreaChart
  title="Tasks done per week"
  xLabels={["28 Sep", "5 Oct", "12 Oct", "19 Oct"]}
  series={[
    { label: "Design", values: [8, 9, 8, 10] },
    { label: "Eng", values: [7, 10, 9, 11] },
  ]}
  filterable
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["StackedAreaChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="stacked-area-chart"` on the root `<figure>`; `data-rebar-part="mark"` on each point.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically maps directly to whatever charting library's own \"stacked area\" mode the target project uses.",
      },
    ],
  },
];

export default function StackedAreaChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>StackedAreaChart</Heading>
      <Text color="secondary">Bands stacked on top of each other, so the top edge is the total.</Text>

      <DemoStage
        title="Tasks done per week"
        caption="By tag, 14 Sep to 19 Oct"
        code={CODE}
        states={[
          { label: "Two series", node: <StackedAreaChart title="Design and Eng" xLabels={WEEKS} series={SERIES.slice(0, 2)} height={180} /> },
          { label: "Single series", node: <StackedAreaChart title="Ops only" xLabels={WEEKS} series={SERIES.slice(3)} height={180} /> },
          { label: "Two points", node: <StackedAreaChart title="This fortnight" xLabels={WEEKS.slice(-2)} series={SERIES} height={180} /> },
        ]}
      >
        <StackedAreaChart title="Tasks done per week" xLabels={WEEKS} series={SERIES} filterable />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Delivery dashboard" caption="A card above the project table" widths={false}>
        <Card style={{ maxWidth: 600, margin: "0 auto" }} title="Output" subtitle="33 tasks done in the week of 19 Oct" extra={<Tag tone="success">Up 4 on last week</Tag>}>
          <StackedAreaChart ariaLabel="Tasks done per week by tag" xLabels={WEEKS} series={SERIES} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
