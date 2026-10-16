import { BarChart, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HOURS_BY_PERSON, person, WEEKLY_DONE, WEEK_LABELS } from "@/fixtures/tideline";

const CODE = `<BarChart
  title="Tasks completed per week"
  trendline
  bars={WEEK_LABELS.map((label, i) => ({ label, value: WEEKLY_DONE[i], color: "var(--rebar-color-primary)" }))}
/>`;

// One series, one colour: the title names it, so there is no legend.
const INK = "var(--rebar-color-primary)";
const weekly = WEEK_LABELS.map((label, i) => ({ label, value: WEEKLY_DONE[i], color: INK }));
const hours = HOURS_BY_PERSON.map((h) => ({ label: person(h.person).name.split(" ")[0], value: h.hours, color: INK }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BarChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Trendline",
    body: [{ kind: "text", text: "`trendline` fits a dashed least-squares line across the bars, with bar index as x. Use it only when the bars are an ordered sequence such as weeks." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bar-chart"` on the root `<figure>`; `data-rebar-part="title"` on the caption and `"trendline"` on a fitted line.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no charts; reimplement against the charting library the target project uses (for example `@ant-design/charts`)." }],
  },
];

export default function BarChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BarChart</Heading>
      <Text color="secondary">One bar per category, for a plain comparison of values.</Text>

      <DemoStage
        title="Weekly throughput"
        caption="Tasks completed per week, 3 Aug to 19 Oct, with a trendline"
        code={CODE}
        states={[
          { label: "Few bars", node: <BarChart title="Hours this week" bars={hours} height={200} /> },
          { label: "No title", node: <BarChart ariaLabel="Hours this week" bars={hours.slice(0, 3)} height={200} /> },
        ]}
      >
        <BarChart title="Tasks completed per week" trendline bars={weekly} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team page" caption="Hours logged this week, per person" widths={false}>
        <Card title="This week" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">109 hours across four people.</Text>
            <BarChart title="Hours logged" bars={hours} height={240} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
