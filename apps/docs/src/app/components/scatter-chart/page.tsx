import { Box, Heading, ScatterChart, Stack, Text } from "rebar-ui";
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
        code: '<ScatterChart title="Token cost" series={[{ label: "antd", values: [31231, 31131, 30891] }, { label: "rebar-ui", values: [30211, 30212, 30149] }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ScatterChart"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "A distribution scatter plot — each series' individual values plotted as a jittered column of points, with a dashed line marking that series' own mean. Promoted from one-off SVG helpers this project's own [/benchmarks](/benchmarks) pages used to keep locally as one-off, un-reused code — see it at real scale there. `title` renders as a real, visible caption per [Design Heuristics](/docs/heuristics) #16 (charts ship with context, not just an accessible name); colors default to a small built-in palette, cycled by series index, when a series omits its own — see [StackedBarChart](/components/stacked-bar-chart)'s own page for the exact default-palette order every chart in this library shares.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The scatter-chart block adds a filter footer",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/placement`'s `scatter-chart` block doesn't just wrap this component 1:1 — a block always makes a real composition decision, not just pass through a canvas. It adds a filter footer below the chart: one toggle button per series, letting a viewer hide/show individual series without touching the underlying data. See it live on [/blocks](/blocks#scatter-chart).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="scatter-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends pairing with a separate charting library, e.g. `@ant-design/charts`); a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function ScatterChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ScatterChart</Heading>
      <Text color="secondary">
        A distribution scatter plot — each series&apos; individual values plotted as a jittered
        column of points, with a dashed mean line per series.
      </Text>
      <Text size="sm" color="secondary">
        Set <code>filterable</code> for a row of toggle buttons below the chart — hiding a series
        drops its whole column and reflows the rest to fill the plot width.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <ScatterChart
          title="Token cost, antd vs. rebar-ui"
          series={[
            { label: "antd", values: [31231, 31131, 30891, 31921, 30950] },
            { label: "rebar-ui", values: [30211, 30212, 30149, 30253, 30180] },
          ]}
          filterable
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
