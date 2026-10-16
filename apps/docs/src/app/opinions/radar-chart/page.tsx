"use client";

import { Avatar, Card, Heading, RadarChart, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";

const AREAS = ["Design", "Eng", "Research", "Ops", "Review"];
const SERIES = [
  { label: "Maya Chen", values: [30, 6, 8, 4, 14] },
  { label: "Jonas Weber", values: [5, 34, 6, 8, 10] },
  { label: "Priya Nair", values: [8, 6, 28, 5, 9] },
];

const CODE = `<RadarChart
  title="Hours by area"
  axes={["Design", "Eng", "Research", "Ops", "Review"]}
  series={[
    { label: "Maya Chen", values: [30, 6, 8, 4, 14] },
    { label: "Jonas Weber", values: [5, 34, 6, 8, 10] },
  ]}
  filterable
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["RadarChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="radar-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends pairing with a separate charting library, e.g. `@ant-design/charts`); a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function RadarChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>RadarChart</Heading>
      <Text color="secondary">A filled polygon per series across shared axes, for comparing a few items on the same dimensions.</Text>

      <DemoStage
        title="Hours by area"
        caption="Where each person's week went, 19 Oct"
        code={CODE}
        states={[
          { label: "Three axes", node: <RadarChart title="Leo's week" axes={["Ops", "Review", "Research"]} series={[{ label: "Leo Santos", values: [30, 12, 6] }]} /> },
          { label: "Eight axes", node: <RadarChart title="Harbour tasks" axes={["Brief", "Logo", "Palette", "Type", "Site", "Livery", "Signage", "Launch"]} series={[{ label: "Done", values: [100, 100, 100, 80, 60, 70, 40, 20] }]} /> },
          { label: "Single series", node: <RadarChart title="Priya's week" axes={AREAS} series={[SERIES[2]]} /> },
        ]}
      >
        <RadarChart title="Hours by area" axes={AREAS} series={SERIES} filterable />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team balance" caption="A card on the team page" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title="Where the hours went" subtitle="Week of 19 Oct" avatar={<Avatar {...avatarOf("maya")} />}>
          <RadarChart ariaLabel="Hours by area for Maya and Jonas" axes={AREAS} series={SERIES.slice(0, 2)} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
