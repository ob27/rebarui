"use client";

import { AreaChart, Card, Heading, Stack, Statistic, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { KPIS, OPENED_PER_WEEK, WEEKLY_DONE, WEEK_LABELS } from "@/fixtures/tideline";

const CODE = `<AreaChart
  title="Tasks per week"
  xLabels={WEEK_LABELS}
  series={[
    { label: "Opened", values: OPENED_PER_WEEK },
    { label: "Done", values: WEEKLY_DONE },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AreaChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Trendline",
    body: [
      {
        kind: "text",
        text: "Set `trendline` to fit and draw a dashed ordinary-least-squares line per visible series over the filled area.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="area-chart"` on the root `<figure>`; the caption, when `title` is set, carries `data-rebar-part="title"`; `data-rebar-part="trendline"` on a fitted trendline.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends pairing with a separate charting library, e.g. `@ant-design/charts`, built on G2Plot); a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function AreaChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AreaChart</Heading>
      <Text color="secondary">A multi-series area chart over an ordered x-axis.</Text>

      <DemoStage title="Weekly throughput" caption="Tasks opened and done, 3 Aug to 19 Oct" code={CODE} widths={false}
        states={[
          { label: "Trendline", node: <div style={{ width: 300 }}><AreaChart title="Done, last six weeks" xLabels={WEEK_LABELS.slice(-6)} trendline series={[{ label: "Done", color: "var(--rebar-color-primary)", values: WEEKLY_DONE.slice(-6) }]} height={170} /></div> },
          { label: "Short run", node: <div style={{ width: 240 }}><AreaChart title="Last four weeks" xLabels={WEEK_LABELS.slice(-4)} series={[{ label: "Done", color: "var(--rebar-color-primary)", values: WEEKLY_DONE.slice(-4) }]} height={170} /></div> },
        ]}
      >
        <AreaChart
          title="Tasks per week"
          xLabels={WEEK_LABELS}
          labelStep={2}
          series={[
            { label: "Opened", color: "var(--rebar-color-info)", values: OPENED_PER_WEEK },
            { label: "Done", color: "var(--rebar-color-primary)", values: WEEKLY_DONE },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team page" caption="The chart under the headline figures" widths={false}>
        <Card title="Throughput" subtitle="Quarter to date">
          <Stack gap="lg">
            <Stack direction="row" gap="xl" style={{ flexWrap: "wrap" }}>
              {KPIS.map((k) => <Statistic key={k.label} title={k.label} value={k.value} />)}
            </Stack>
            <AreaChart title="Tasks done per week" xLabels={WEEK_LABELS} labelStep={2} series={[{ label: "Done", color: "var(--rebar-color-primary)", values: WEEKLY_DONE }]} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
