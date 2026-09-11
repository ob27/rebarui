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
    heading: "Series filtering",
    body: [
      {
        kind: "text",
        text: "Set `filterable` for a row of toggle buttons below the chart — hiding a series drops its line, its points, and its top-right label. The y-axis scale stays fixed to the full dataset regardless of what's hidden, so a remaining series' own shape never visually distorts as others are toggled. The `line-chart` placement block wraps this same capability rather than reimplementing it — see it live on [/blocks](/blocks#line-chart).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Trendline",
    body: [
      {
        kind: "text",
        text: "Set `trendline` to fit and draw a dashed ordinary-least-squares line per visible series — useful when the underlying signal is noisy and the direction matters more than any single point.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="line-chart"` on the root `<figure>`; `data-rebar-part="trendline"` on a fitted trendline.',
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

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>filterable</code> adds a toggle row below the chart.
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
            filterable
            series={[
              { label: "antd", values: [10, 20, 30, 42] },
              { label: "rebar-ui + migration", values: [22, 28, 35, 40], dashed: true },
            ]}
          />
        </Box>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>trendline</code> fits and draws a dashed OLS line per series.
        </Text>
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
          }}
        >
          <LineChart
            title="Noisy signal with trend"
            xLabels={["R0", "R1", "R2", "R3", "R4", "R5"]}
            trendline
            series={[{ label: "Series A", values: [10, 22, 18, 30, 26, 38] }]}
          />
        </Box>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
