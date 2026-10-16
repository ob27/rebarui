"use client";

import { useState } from "react";
import { Card, Heading, PertChart, Stack, Tag, Text, WaybackSlider } from "rebar-ui";
import type { PertTask } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<PertChart
  title="Harbour launch"
  tasks={[
    { id: "palette", label: "Brand palette", duration: 3 },
    { id: "home", label: "Homepage", duration: 4, dependsOn: ["palette"] },
    { id: "livery", label: "Van livery", duration: 2, dependsOn: ["palette"] },
    { id: "launch", label: "Launch", duration: 2, dependsOn: ["home", "livery"] },
  ]}
/>`;

// Palette > Homepage > Launch is 9 days (critical); Palette > Van livery > Launch is 7, so livery has 2 days of slack.
const TASKS: PertTask[] = [
  { id: "palette", label: "Brand palette", duration: 3 },
  { id: "home", label: "Homepage", duration: 4, dependsOn: ["palette"] },
  { id: "livery", label: "Van livery", duration: 2, dependsOn: ["palette"] },
  { id: "launch", label: "Launch", duration: 2, dependsOn: ["home", "livery"] },
];

const REPORT_DATES = [new Date(2026, 9, 3), new Date(2026, 9, 10), new Date(2026, 9, 17)];
const SNAPSHOTS: Record<number, PertTask[]> = {
  // Early on the homepage was a one-day job, so the van livery was the long path.
  [REPORT_DATES[0]!.getTime()]: [
    { id: "palette", label: "Brand palette", duration: 3 },
    { id: "home", label: "Homepage", duration: 1, dependsOn: ["palette"] },
    { id: "livery", label: "Van livery", duration: 2, dependsOn: ["palette"] },
    { id: "launch", label: "Launch", duration: 2, dependsOn: ["home", "livery"] },
  ],
  [REPORT_DATES[1]!.getTime()]: [
    { id: "palette", label: "Brand palette", duration: 3 },
    { id: "home", label: "Homepage", duration: 3, dependsOn: ["palette"] },
    { id: "livery", label: "Van livery", duration: 2, dependsOn: ["palette"] },
    { id: "launch", label: "Launch", duration: 2, dependsOn: ["home", "livery"] },
  ],
  [REPORT_DATES[2]!.getTime()]: TASKS,
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PertChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="pert-chart"` on the root (built on `NodeLinkGraph`, so its own toolbar/pan/zoom parts render underneath too); `data-rebar-part="critical-node"` on a zero-slack task\'s box, `"node-box"` otherwise.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; a PERT/CPM network diagram typically migrates to a dedicated project-management library rather than an antd component.",
      },
    ],
  },
];


export default function PertChartPage() {
  const harbour = project("harbour");
  const [reportDate, setReportDate] = useState<Date>(REPORT_DATES[REPORT_DATES.length - 1]!);
  const snapshot = SNAPSHOTS[reportDate.getTime()] ?? TASKS;

  return (
    <Stack gap="lg">
      <Heading level={1}>PertChart</Heading>
      <Text color="secondary">A task network that works out each task&apos;s slack and draws the critical path.</Text>

      <DemoStage
        title="Harbour launch"
        caption="Scrub the report date and watch the critical path move"
        code={CODE}
        widths={false}
        states={[
          { label: "One task", node: <PertChart title="One task" width={190} height={120} tasks={[{ id: "a", label: "Brand palette", duration: 3 }]} /> },
          { label: "Empty", node: <PertChart title="No tasks" width={190} height={120} tasks={[]} /> },
        ]}
      >
        <Stack gap="sm">
          <WaybackSlider dates={REPORT_DATES} value={reportDate} onValueChange={setReportDate} />
          <PertChart title="Harbour launch, as reported" tasks={snapshot} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch planning" caption={`${harbour.name}, due ${harbour.due}`} widths={false}>
        <Card title="Launch path" subtitle="Nine days end to end" extra={<Tag tone="success">{harbour.status}</Tag>} style={{ maxWidth: 640, margin: "0 auto" }}>
          <Stack gap="sm">
            <PertChart title="Harbour launch" tasks={TASKS} width={560} height={300} />
            <Text size="sm" color="secondary">The homepage is the critical path; the van livery can slip two days without moving launch.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
