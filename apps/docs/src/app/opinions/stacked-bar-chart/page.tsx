"use client";

import { Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const COST = [
  { label: "Harbour rebrand", segments: [{ label: "Design", value: 21000 }, { label: "Print", value: 14200 }, { label: "Contractors", value: 8000 }] },
  { label: "Tideline mobile", segments: [{ label: "Design", value: 9000 }, { label: "Print", value: 0 }, { label: "Contractors", value: 41000 }] },
  { label: "Depot signage", segments: [{ label: "Design", value: 4200 }, { label: "Print", value: 9800 }, { label: "Contractors", value: 5100 }] },
];

const CODE = `{
  type: "stacked-bar-chart",
  title: "Spend so far",
  bars: [
    { label: "Harbour rebrand", segments: [
      { label: "Design", value: 21000 },
      { label: "Print", value: 14200 },
    ] },
  ],
}`;

const block = (bars: typeof COST, title: string): Construct => ({ type: "stacked-bar-chart", title, bars });

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["StackedBarChart"] ?? [] },
];

export default function StackedBarChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Stacked Bar Chart</Heading>
      <Text color="secondary">Each bar split into labelled segments, with its total above it.</Text>

      <DemoStage
        title="Spend so far"
        caption="Cost per project, split by kind (GBP)"
        code={CODE}
        states={[
          { label: "One bar", node: <NextBlockRenderer blocks={[block(COST.slice(0, 1), "Harbour rebrand")]} /> },
          { label: "Two segments", node: <NextBlockRenderer blocks={[block(COST.slice(1).map((b) => ({ ...b, segments: b.segments.filter((s) => s.label !== "Print") })), "No print")]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[block(COST, "Spend so far")]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget view" caption="A card on the finance page" widths={false}>
        <Card style={{ maxWidth: 600, margin: "0 auto" }} title="Spend by project" subtitle="Budgets: £48,200, £72,900, £21,800" extra={<Tag tone="info">Oct</Tag>}>
          <NextBlockRenderer blocks={[block(COST, "Spend so far")]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
