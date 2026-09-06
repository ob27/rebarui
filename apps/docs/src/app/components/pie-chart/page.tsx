import { Box, Heading, PieChart, Stack, Text } from "rebar-ui";
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
        code: '<PieChart title="Browser market share" slices={[{ label: "Chrome", value: 65 }, { label: "Safari", value: 18 }, { label: "Edge", value: 8 }, { label: "Firefox", value: 5 }, { label: "Other", value: 4 }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["PieChart"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "A proportional slice chart — pie by default, donut via `innerRadiusRatio` — for showing how a small number of parts make up a whole, with a legend row (swatch + label + percentage) below the arcs rather than labels crammed inside thin slices. Colors default to a small built-in palette, cycled by slice index, when a slice omits its own.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="pie-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a pie chart, so a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function PieChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PieChart</Heading>
      <Text color="secondary">
        A proportional slice chart — pie by default, donut via <code>innerRadiusRatio</code> — with
        a legend row below the arcs.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <PieChart
          title="Browser market share"
          slices={[
            { label: "Chrome", value: 65 },
            { label: "Safari", value: 18 },
            { label: "Edge", value: 8 },
            { label: "Firefox", value: 5 },
            { label: "Other", value: 4 },
          ]}
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
