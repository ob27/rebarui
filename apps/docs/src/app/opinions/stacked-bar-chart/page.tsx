import { Box, Heading, Stack, StackedBarChart, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<StackedBarChart title="Cost composition" bars={[{ label: "Hire developers", segments: [{ label: "Build", value: 16800 }, { label: "Revisions", value: 16800 }] }, { label: "AI-assisted", segments: [{ label: "Oversight", value: 3500 }] }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["StackedBarChart"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "A stacked bar chart — each bar broken into labeled cost/quantity segments, with the bar's own total shown above it. Promoted from this project's own [/benchmarks](/benchmarks) \"vibe coding vs. hiring developers\" scenario. Segment label text color is computed from that segment's own background luminance, so it stays readable regardless of which color (default palette or explicit) the segment ends up with.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Default colors, stated once for every chart",
    body: [
      {
        kind: "text",
        text: 'When a series/segment/stage doesn\'t supply its own `color`, every one of `AreaChart`, `BarChart`, `BoxPlot`, `BubbleChart`, `FunnelChart`, `LineChart`, `PieChart`, `RadarChart`, `ScatterChart`, and `StackedBarChart` picks one from the same small built-in palette (`--rebar-color-primary`, `-success`, `-warning`, `-danger`, `-text-secondary`, in that order) cycled by that item\'s own index — the first series always gets the first color, the second the second, wrapping back to the first once the palette runs out. Checking this directly (not assuming it) surfaced a real inconsistency worth fixing rather than just documenting around: 6 of these 10 charts actually started their cycle at `-text-secondary` instead of `-primary` — unified to the single order stated above, so a caller can now genuinely predict which color a first, unlabeled series gets on any chart in this library. `WaterfallChart` is the one deliberate exception: its bars use fixed *semantic* colors (a total bar is always `-primary`, an increase always `-success`, a decrease always `-danger`) rather than a cycled palette, since a waterfall\'s colors encode meaning (direction), not arbitrary series identity.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The stacked-bar-chart block adds a filter footer",
    body: [
      {
        kind: "text",
        text: "The `stacked-bar-chart` block adds a filter footer too — one toggle per distinct segment label across every bar (a legend of categories, not a per-bar list), so hiding \"Revisions\" removes it from every bar at once rather than needing a separate control per bar. See it live on [/opinions](/opinions#stacked-bar-chart).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="stacked-bar-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function StackedBarChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>StackedBarChart</Heading>
      <Text color="secondary">
        Each bar broken into labeled cost/quantity segments, with the bar&apos;s own total shown
        above it.
      </Text>
      <Text size="sm" color="secondary">
        Set <code>filterable</code> for a row of toggle buttons — one per distinct segment label
        across every bar. Hiding one drops that segment from every bar it appears in, not just one.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <StackedBarChart
          title="Cost composition"
          bars={[
            {
              label: "Hire developers",
              segments: [
                { label: "Build", value: 16800 },
                { label: "Revisions", value: 16800 },
              ],
            },
            {
              label: "AI-assisted",
              segments: [{ label: "Oversight", value: 3500 }],
            },
          ]}
          filterable
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
