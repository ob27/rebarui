import { Card, Heading, LineChart, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { KPIS, WEEKLY_DONE, WEEK_LABELS } from "@/fixtures/tideline";

const CODE = `{
  type: "line-chart",
  title: "Tasks per week",
  xLabels: WEEK_LABELS,
  labelStep: 2,
  series: [
    { label: "Done", values: WEEKLY_DONE },
    { label: "Opened", values: OPENED, dashed: true },
  ],
}`;

// Tasks opened per week, to set against WEEKLY_DONE.
const OPENED = [18, 20, 19, 24, 23, 24, 26, 27, 29, 30, 31, 30];

const MAIN: Construct = {
  type: "line-chart",
  title: "Tasks per week",
  xLabels: WEEK_LABELS,
  labelStep: 2,
  series: [
    { label: "Done", values: WEEKLY_DONE },
    { label: "Opened", values: OPENED, dashed: true },
  ],
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["LineChart"] ?? [] },
];


export default function LineChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Line Chart</Heading>
      <Text color="secondary">A multi-series line chart over an ordered x-axis, with an optional crossover marker.</Text>

      <DemoStage
        title="Tasks per week"
        caption="Done against opened, 3 Aug to 19 Oct"
        code={CODE}
        states={[
          { label: "One series", node: <LineChart title="Done" height={170} xLabels={WEEK_LABELS} labelStep={3} series={[{ label: "Done", values: WEEKLY_DONE }]} /> },
          { label: "Few points", node: <LineChart title="Last four weeks" height={170} xLabels={WEEK_LABELS.slice(-4)} series={[{ label: "Done", values: WEEKLY_DONE.slice(-4) }]} /> },
          { label: "Trendline", node: <LineChart title="With trend" height={170} xLabels={WEEK_LABELS} labelStep={3} trendline series={[{ label: "Done", values: WEEKLY_DONE }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[MAIN]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Weekly review" caption="The chart under the headline numbers" widths={false}>
        <Card title="Throughput" subtitle="Last 12 weeks" extra={<Tag tone="success">{KPIS[2]!.delta}</Tag>} style={{ maxWidth: 600, margin: "0 auto" }}>
          <Stack gap="sm">
            <Stack direction="row" gap="lg">
              {KPIS.map((k) => (
                <Stack key={k.label} gap="xs">
                  <Text size="xs" color="secondary">{k.label}</Text>
                  <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)", fontSize: 22 }}>{k.value}</Text>
                </Stack>
              ))}
            </Stack>
            <LineChart title="Tasks per week" height={210} xLabels={WEEK_LABELS} labelStep={2} series={[{ label: "Done", values: WEEKLY_DONE }, { label: "Opened", values: OPENED, dashed: true }]} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
