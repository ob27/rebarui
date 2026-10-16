"use client";

import { BoxPlot, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CYCLE_DAYS, person } from "@/fixtures/tideline";

const GROUPS = CYCLE_DAYS.map(({ person: id, ...five }) => ({ label: person(id).name, ...five }));
const days = (v: number) => `${Math.round(v)}d`;
const CODE = `<BoxPlot title="Days to finish a task, by person" groups={[{ label: "Maya Chen", min: 1, q1: 2, median: 3, q3: 5, max: 9 }, { label: "Jonas Weber", min: 2, q1: 4, median: 6, q3: 9, max: 15 }]} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BoxPlot"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="box-plot"` on the root `<figure>`.',
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

export default function BoxPlotPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BoxPlot</Heading>
      <Text color="secondary">Box-and-whisker groups from a five-number summary.</Text>

      <DemoStage title="Cycle time" caption="Days from start to done, by person" code={CODE} widths={false}
        states={[
          { label: "Two groups", node: <div style={{ width: 280 }}><BoxPlot title="Design and ops" height={170} yFormat={days} groups={GROUPS.filter((g) => g.label === "Maya Chen" || g.label === "Leo Santos")} /></div> },
          { label: "One group", node: <div style={{ width: 200 }}><BoxPlot title="Jonas only" height={170} yFormat={days} groups={GROUPS.filter((g) => g.label === "Jonas Weber")} /></div> },
        ]}
      >
        <BoxPlot title="Days to finish a task, by person" yFormat={days} groups={GROUPS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Delivery review" caption="The spread behind the average, with a note on the slow end" widths={false}>
        <Card title="Cycle time" subtitle="Last 12 weeks" extra={<Tag tone="info">Median 4 days</Tag>}>
          <Stack gap="md">
            <BoxPlot title="Days to finish a task" yFormat={days} groups={GROUPS} height={220} />
            <Text size="sm" color="secondary">Jonas&apos;s long tail is mostly the offline sync work, still in review.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
