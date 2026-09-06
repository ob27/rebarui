import { CandlestickChart, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const DATA = [
  { label: "Mon", open: 42, high: 45, low: 40, close: 44 },
  { label: "Tue", open: 44, high: 44.5, low: 39, close: 40 },
  { label: "Wed", open: 40, high: 43, low: 39.5, close: 42.8 },
  { label: "Thu", open: 42.8, high: 43, low: 38, close: 38.5 },
  { label: "Fri", open: 38.5, high: 41, low: 38, close: 40.9 },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<CandlestickChart title="Weekly close" data={[{ label: "Mon", open: 42, high: 45, low: 40, close: 44 }, /* ... */]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["CandlestickChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Wick and body",
    body: [
      {
        kind: "text",
        text: "Each entry renders a thin wick spanning the full `high`/`low` range, and a filled body spanning `open`/`close`, colored `upColor` when the period closed at or above its open, `downColor` otherwise. The y-axis range and tick spacing reuse the same convention `LineChart`/`ScatterChart` already use — padded min/max, evenly spaced ticks — rather than a new axis approach invented for this chart alone.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="candlestick-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a financial candlestick chart typically migrates to a dedicated library like `lightweight-charts` rather than an antd component.",
      },
    ],
  },
];

export default function CandlestickChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>CandlestickChart</Heading>
      <Text color="secondary">
        A financial price-range chart — one wick-and-body candle per period.
      </Text>

      <CandlestickChart title="Weekly close" data={DATA} />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
