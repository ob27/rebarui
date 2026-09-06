import { Box, Heading, LineChart, Stack, Text } from "rebar-ui";
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
        code: '<LineChart title="Cumulative cost" xLabels={["R0","R1","R2","R3"]} crossoverIndex={3} series={[{ label: "antd", values: [10,20,30,42] }, { label: "rebar-ui + migration", values: [22,28,35,40], dashed: true }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["LineChart"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "A multi-series line chart over an ordered x-axis — for cumulative cost/measurement comparisons where one series may overtake another partway through, hence the optional `crossoverIndex` marker (a dashed vertical line labeled \"crossover\"). Promoted from this project's own [/benchmarks](/benchmarks/iteration) iteration experiment. A series' own `dashed` flag renders it as a dashed line, e.g. to distinguish a projected/blended cost from a directly measured one.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The line-chart block adds a filter footer",
    body: [
      {
        kind: "text",
        text: "Same as `scatter-chart`: the block wraps this component with a filter footer, one toggle per series, rather than being a 1:1 pass-through. See it live on [/blocks](/blocks#line-chart).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="line-chart"` on the root `<figure>`.',
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

export default function LineChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>LineChart</Heading>
      <Text color="secondary">
        A multi-series line chart over an ordered x-axis, with an optional crossover marker for
        cumulative comparisons.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <LineChart
          title="Cumulative cost per round"
          xLabels={["R0", "R1", "R2", "R3"]}
          crossoverIndex={3}
          series={[
            { label: "antd", values: [10, 20, 30, 42] },
            { label: "rebar-ui + migration", values: [22, 28, 35, 40], dashed: true },
          ]}
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
