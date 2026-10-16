"use client";

import { Card, DistributionChart, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<DistributionChart
  title="Days to finish a task, by team"
  series={[
    { label: "Design", mean: 4.2, stdDev: 1.1 },
    { label: "Engineering", mean: 6.5, stdDev: 2 },
    { label: "Operations", mean: 3, stdDev: 0.8 },
  ]}
/>`;

const DESIGN = { label: "Design", mean: 4.2, stdDev: 1.1, color: "var(--rebar-color-primary)" };
const ENG = { label: "Engineering", mean: 6.5, stdDev: 2, color: "var(--rebar-color-info)" };
const OPS = { label: "Operations", mean: 3, stdDev: 0.8, color: "var(--rebar-color-success)" };
const days = (v: number) => `${v} d`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DistributionChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="distribution-chart"` on the root `<figure>`; parts: `series`, `stddev-band`, `mean-line`, `mean-mark`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a distribution/bell-curve plot, so a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function DistributionChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DistributionChart</Heading>
      <Text color="secondary">Bell curves drawn from a mean and a spread, with an optional shaded band.</Text>

      <DemoStage
        title="Days to finish a task"
        caption="One curve per team; the band is one standard deviation"
        code={CODE}
        states={[
          { label: "One series", node: <DistributionChart title="Engineering" series={[ENG]} xFormat={days} height={160} /> },
          { label: "No band", node: <DistributionChart title="Three teams, no band" series={[DESIGN, ENG, OPS]} xFormat={days} showStdDevBand={false} height={160} /> },
          { label: "Very wide spread", node: <DistributionChart title="Crew interviews" series={[{ label: "Interviews", mean: 12, stdDev: 5, color: "var(--rebar-color-warning)" }]} xFormat={days} height={160} /> },
        ]}
      >
        <DistributionChart title="Days to finish a task, by team" series={[DESIGN, ENG, OPS]} xFormat={days} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team report" caption="Cycle time beside the headline" widths={false}>
        <Card style={{ maxWidth: 680, margin: "0 auto" }} title="Cycle time, last 12 weeks">
          <Stack gap="md">
            <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
              <Tag tone="success">Operations 3 d</Tag>
              <Tag tone="info">Design 4.2 d</Tag>
              <Tag tone="default">Engineering 6.5 d</Tag>
            </Stack>
            <DistributionChart title="Days to finish a task" series={[DESIGN, ENG, OPS]} xFormat={days} height={200} />
            <Text size="sm" color="secondary">Engineering varies most, mostly offline-sync work on Tideline mobile.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
