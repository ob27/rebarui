"use client";

import { Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CYCLE = [
  { label: "Maya Chen", values: [1.5, 2, 3, 2.5, 1, 4, 2] },
  { label: "Jonas Weber", values: [3, 5, 4, 6, 2.5, 7, 4.5] },
  { label: "Priya Nair", values: [2, 2.5, 6, 3, 2, 8, 3.5] },
];

const CODE = `{
  type: "scatter-chart",
  title: "Days from start to done",
  series: [
    { label: "Maya Chen", values: [1.5, 2, 3, 2.5, 1, 4, 2] },
    { label: "Jonas Weber", values: [3, 5, 4, 6, 2.5, 7, 4.5] },
  ],
}`;

const mainBlock = (series: typeof CYCLE, title: string): Construct => ({ type: "scatter-chart", title, series });

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ScatterChart"] ?? [] },
];

export default function ScatterChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Scatter Chart</Heading>
      <Text color="secondary">Each series as a column of points with a dashed mean line, for comparing spreads.</Text>

      <DemoStage
        title="Days from start to done"
        caption="Every task closed since 1 Oct, by person"
        code={CODE}
        states={[
          { label: "One series", node: <NextBlockRenderer blocks={[mainBlock(CYCLE.slice(0, 1), "Maya's tasks")]} /> },
          { label: "Tight spread", node: <NextBlockRenderer blocks={[mainBlock([{ label: "Leo Santos", values: [2, 2, 2.5, 2, 2, 3] }], "Rota export")]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[mainBlock(CYCLE, "Days from start to done")]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Cycle time" caption="A card on the delivery dashboard" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="How long tasks take" subtitle="Dashed line is the mean" extra={<Tag tone="info">Last 3 weeks</Tag>}>
          <NextBlockRenderer blocks={[mainBlock(CYCLE.slice(1), "Jonas and Priya")]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
