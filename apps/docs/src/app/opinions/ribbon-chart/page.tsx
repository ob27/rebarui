"use client";

import { Card, Heading, RibbonChart, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { WEEK_LABELS } from "@/fixtures/tideline";

const WEEKS = WEEK_LABELS.slice(-5);
const SERIES = [
  { label: "Maya Chen", values: [9, 8, 10, 12, 11] },
  { label: "Jonas Weber", values: [7, 10, 9, 8, 12] },
  { label: "Priya Nair", values: [4, 6, 8, 9, 7] },
  { label: "Leo Santos", values: [3, 4, 4, 2, 3] },
];

const CODE = `<RibbonChart
  title="Tasks closed, by rank"
  xLabels={["21 Sep", "28 Sep", "5 Oct", "12 Oct", "19 Oct"]}
  series={[
    { label: "Maya Chen", values: [9, 8, 10, 12, 11] },
    { label: "Jonas Weber", values: [7, 10, 9, 8, 12] },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["RibbonChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="ribbon-chart"` on the root `<figure>`; `data-rebar-part="mark"` on each ribbon.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically pre-computes the same per-position ranks and feeds them to a bump-chart implementation in whatever charting library the target project uses.",
      },
    ],
  },
];

export default function RibbonChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>RibbonChart</Heading>
      <Text color="secondary">A bump chart: height shows rank at each step, not the raw value.</Text>

      <DemoStage
        title="Tasks closed, by rank"
        caption="Who closed the most each week"
        code={CODE}
        states={[
          { label: "Two series", node: <RibbonChart title="Design vs Eng" xLabels={WEEKS} series={SERIES.slice(0, 2)} height={180} /> },
          { label: "Filterable", node: <RibbonChart title="Pick a person" xLabels={WEEKS} series={SERIES} filterable height={180} /> },
          { label: "Ties", node: <RibbonChart title="Flat week" xLabels={WEEKS.slice(0, 3)} series={[{ label: "Maya Chen", values: [5, 5, 5] }, { label: "Leo Santos", values: [5, 3, 5] }]} height={180} /> },
        ]}
      >
        <RibbonChart title="Tasks closed, by rank" xLabels={WEEKS} series={SERIES} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team leaderboard" caption="A card on the team page" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Closing tasks" subtitle="Last five weeks" extra={<Tag tone="success">Jonas leads</Tag>}>
          <RibbonChart ariaLabel="Rank by tasks closed per week" xLabels={WEEKS} series={SERIES} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
