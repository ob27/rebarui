import { CandlestickChart, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { OPEN_TASK_CANDLES } from "@/fixtures/tideline";

const CODE = `<CandlestickChart
  title="Open tasks, week of 20 Oct"
  data={[{ label: "Mon 20", open: 48, high: 50, low: 45, close: 47 }, /* ... */]}
  upColor="var(--rebar-color-danger)"
  downColor="var(--rebar-color-success)"
/>`;

// More open tasks is bad news, fewer is good.
const COLORS = { upColor: "var(--rebar-color-danger)", downColor: "var(--rebar-color-success)" };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["CandlestickChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Wick and body",
    body: [
      {
        kind: "text",
        text: "Each entry draws a thin wick from `low` to `high` and a body from `open` to `close`, in `upColor` when the period closed at or above its open and `downColor` otherwise. It is a record of real periodic values; for the spread of a dataset use `BoxPlot`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="candlestick-chart"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD ships no chart components of its own; a candlestick chart typically migrates to a dedicated library like `lightweight-charts`.",
      },
    ],
  },
];

export default function CandlestickChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>CandlestickChart</Heading>
      <Text color="secondary">One wick-and-body candle per period: open, high, low, close.</Text>

      <DemoStage
        title="Open tasks"
        caption="Daily range of open tasks, 20 to 24 Oct"
        code={CODE}
        states={[
          { label: "Two days", node: <CandlestickChart ariaLabel="Open tasks" data={OPEN_TASK_CANDLES.slice(0, 2)} height={160} {...COLORS} /> },
          { label: "No data", node: <CandlestickChart ariaLabel="Open tasks" data={[]} height={160} {...COLORS} /> },
          { label: "Default colours", node: <CandlestickChart ariaLabel="Open tasks" data={OPEN_TASK_CANDLES.slice(2)} height={160} /> },
        ]}
      >
        <CandlestickChart title="Open tasks, week of 20 Oct" data={OPEN_TASK_CANDLES} {...COLORS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Weekly review" caption="Next to the week's numbers" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          <Card title="Open tasks" style={{ flex: "1 1 420px" }}>
            <CandlestickChart ariaLabel="Open tasks per day" data={OPEN_TASK_CANDLES} {...COLORS} />
          </Card>
          <Card title="This week" style={{ flex: "1 1 180px" }}>
            <Stack gap="xs">
              <Text size="sm" color="secondary">Closed Friday at</Text>
              <Heading level={2}>43</Heading>
              <Text size="sm" color="secondary">5 fewer than Monday&apos;s open.</Text>
            </Stack>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
