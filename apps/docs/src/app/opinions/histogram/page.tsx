import { Card, Heading, Histogram, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { KPIS } from "@/fixtures/tideline";

const CODE = `<Histogram
  title="Days from To do to Done"
  series={[{ label: "All tasks", values: [1, 1, 2, 2, 3, 3, 4, 5, 6, 9, 14] }]}
/>`;

// Days each finished task spent between To do and Done.
const ALL = [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 9, 12, 14];
const DESIGN = [1, 2, 2, 3, 3, 4, 4, 5, 6];
const ENG = [2, 3, 4, 4, 5, 6, 7, 9, 12, 14];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Histogram"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="histogram"` on the root `<figure>`; `data-rebar-part="mark"` on each bin\'s bar.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically feeds the same raw sample values to whatever charting library's own histogram/binning helper the target project uses.",
      },
    ],
  },
];


export default function HistogramPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Histogram</Heading>
      <Text color="secondary">Bins raw values into equal-width buckets and draws the count in each.</Text>

      <DemoStage
        title="Cycle time"
        caption="Days from To do to Done, 20 finished tasks"
        code={CODE}
        states={[
          { label: "Two series", node: <Histogram title="Design and Eng" height={170} series={[{ label: "Design", values: DESIGN }, { label: "Eng", values: ENG }]} /> },
          { label: "Few values", node: <Histogram title="Last week" height={170} series={[{ label: "Done", values: [2, 3, 3, 5, 8] }]} /> },
          { label: "Four bins", node: <Histogram title="Coarse" height={170} binCount={4} series={[{ label: "All tasks", values: ALL }]} /> },
        ]}
      >
        <Histogram title="Days from To do to Done" series={[{ label: "All tasks", values: ALL }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Delivery review" caption="The spread behind the weekly numbers" widths={false}>
        <Card title="How long tasks take" subtitle="Last 12 weeks" extra={<Tag tone="success">{KPIS[2]!.delta}</Tag>} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Histogram title="Days from To do to Done" height={200} series={[{ label: "All tasks", values: ALL }]} />
            <Text size="sm" color="secondary">Most tasks close within four days; a few long ones pull the tail out to two weeks.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
