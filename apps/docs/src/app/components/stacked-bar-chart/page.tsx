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
    heading: "The stacked-bar-chart block adds a filter footer",
    body: [
      {
        kind: "text",
        text: "The `stacked-bar-chart` block adds a filter footer too — one toggle per distinct segment label across every bar (a legend of categories, not a per-bar list), so hiding \"Revisions\" removes it from every bar at once rather than needing a separate control per bar. See it live on [/blocks](/blocks#stacked-bar-chart).",
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
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
