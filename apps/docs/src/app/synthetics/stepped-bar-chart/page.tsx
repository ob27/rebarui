import { Card, Heading, Stack, SteppedBarChart, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { WEEKLY_DONE, WEEK_LABELS } from "@/fixtures/tideline";

const CODE = `<SteppedBarChart
  title="Tasks done per week"
  bars={[{ label: "7 Sep", value: 20 }, { label: "14 Sep", value: 25 }, { label: "21 Sep", value: 23 }]}
/>`;

const bars = WEEKLY_DONE.map((value, i) => ({ label: WEEK_LABELS[i]!, value }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SteppedBarChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="stepped-bar-chart"` on the root `<figure>`; `data-rebar-part="outline"` on the bold top-tracing polyline.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no chart components; set `barGap: 0` and `barCategoryGap: 0` on the bar chart you use, plus an outline overlay if you need the staircase." }],
  },
];

export default function SteppedBarChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SteppedBarChart</Heading>
      <Text color="secondary">A bar chart with no gaps, so the tops trace one staircase.</Text>

      <DemoStage
        title="Tasks done per week"
        caption="Twelve weeks, 3 Aug to 19 Oct"
        code={CODE}
        states={[
          { label: "Four weeks", node: <SteppedBarChart title="Last four weeks" height={140} bars={bars.slice(-4)} /> },
          { label: "Single bar", node: <SteppedBarChart title="This week" height={140} bars={bars.slice(-1)} /> },
          { label: "Falling", node: <SteppedBarChart title="Open tasks, falling" height={140} bars={[{ label: "Mon", value: 42 }, { label: "Tue", value: 36 }, { label: "Wed", value: 30 }, { label: "Thu", value: 21 }]} /> },
        ]}
      >
        <SteppedBarChart title="Tasks done per week" bars={bars} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team velocity" caption="The staircase beside the headline number" widths={false}>
        <Card title="Throughput" style={{ maxWidth: 620, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">33 tasks done in the week of 19 Oct, the best of the quarter.</Text>
            <SteppedBarChart title="Last six weeks" height={180} bars={bars.slice(-6)} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
