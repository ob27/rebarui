"use client";

import { Card, Heading, Stack, StepChart, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const DAYS = ["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24", "Sat 25"];

const CODE = `<StepChart
  title="Crew on shift"
  xLabels={["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24", "Sat 25"]}
  series={[{ label: "Crew", values: [8, 8, 10, 10, 12, 6] }]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["StepChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="step-chart"` on the root `<figure>`; `data-rebar-part="mark"` on each point, `"trendline"` on a trendline when `trendline` is set.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically maps directly to whatever charting library's own \"step\" line-interpolation option the target project uses.",
      },
    ],
  },
];

export default function StepChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>StepChart</Heading>
      <Text color="secondary">A line drawn as steps, for values that hold until the next change.</Text>

      <DemoStage
        title="Crew on shift"
        caption="Headcount at the three northern depots, launch week"
        code={CODE}
        states={[
          { label: "Two series", node: <StepChart title="Crew by depot" xLabels={DAYS} series={[{ label: "North", values: [4, 4, 5, 5, 6, 3] }, { label: "East", values: [4, 4, 5, 5, 6, 3] }]} height={180} /> },
          { label: "Formatted axis", node: <StepChart title="Hourly rate" xLabels={DAYS} series={[{ label: "Rate", values: [18, 18, 20, 20, 22, 22] }]} yFormat={(v) => `£${v}`} height={180} /> },
          { label: "Trendline", node: <StepChart title="Crew on shift" xLabels={DAYS} series={[{ label: "Crew", values: [8, 8, 10, 10, 12, 6] }]} trendline height={180} /> },
        ]}
      >
        <StepChart title="Crew on shift" xLabels={DAYS} series={[{ label: "Crew", values: [8, 8, 10, 10, 12, 6] }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Rota" caption="A card on the rota page" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Staffing this week" subtitle="Payroll cut-off 28 Oct" extra={<Tag tone="info">Launch Fri</Tag>}>
          <StepChart ariaLabel="Crew on shift per day" xLabels={DAYS} series={[{ label: "Crew", values: [8, 8, 10, 10, 12, 6] }]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
