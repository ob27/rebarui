"use client";

import { BubbleChart, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, PROJECT_HOURS, project } from "@/fixtures/tideline";

const k = (v: number) => `£${Math.round(v)}k`;
const point = (id: string) => ({ x: project(id).budget / 1000, y: project(id).done, size: PROJECT_HOURS[id] });
const COLORS = ["var(--rebar-color-primary)", "var(--rebar-color-info)", "var(--rebar-color-warning)", "var(--rebar-color-success)", "var(--rebar-color-text-secondary)"];
const SERIES = PROJECTS.map((p, i) => ({ label: p.name, color: COLORS[i], points: [point(p.id)] }));
const CODE = `<BubbleChart title="Budget vs. progress, sized by hours" series={projects.map((p) => ({ label: p.name, points: [{ x: p.budget / 1000, y: p.done, size: hours[p.id] }] }))} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BubbleChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Trendline",
    body: [
      {
        kind: "text",
        text: "Set `trendline` to fit a dashed ordinary-least-squares line per series over its real `(x, y)` points, drawn from the series' own min to max x.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="bubble-chart"` on the root `<figure>`; `data-rebar-part="trendline"` on a fitted trendline.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a bubble chart.",
      },
    ],
  },
];

export default function BubbleChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BubbleChart</Heading>
      <Text color="secondary">A scatter chart with a third value drawn as marker size.</Text>

      <DemoStage title="Projects" caption="Budget (x), percent done (y), hours logged (size)" code={CODE} widths={false}
        states={[
          { label: "One series with trendline", node: <div style={{ width: 340 }}><BubbleChart title="All projects" height={200} trendline xFormat={k} series={[{ label: "Projects", color: "var(--rebar-color-primary)", points: PROJECTS.map((p) => point(p.id)) }]} /></div> },
        ]}
      >
        <BubbleChart title="Budget vs. progress, sized by hours" xFormat={k} yFormat={(v) => `${Math.round(v)}%`} series={SERIES} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Portfolio" caption="Where the money and the hours are going" widths={false}>
        <Card title="Portfolio" subtitle="Five projects, this quarter">
          <Stack gap="sm">
            <BubbleChart title="Budget vs. progress, sized by hours" xFormat={k} yFormat={(v) => `${Math.round(v)}%`} series={SERIES} height={240} />
            <Text size="sm" color="secondary">Tideline mobile has the most hours and the second-largest budget; Crew interviews is small and behind.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
