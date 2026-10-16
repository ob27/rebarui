"use client";

import { useState } from "react";
import { Avatar, Card, GanttChart, Heading, Stack, Tag, Text, WaybackSlider } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, project } from "@/fixtures/tideline";

const CODE = `<GanttChart
  title="Studio timeline"
  tasks={[
    { id: "harbour", label: "Harbour rebrand", start: new Date(2026, 8, 2), end: new Date(2026, 9, 24), progress: 0.84 },
    { id: "mobile", label: "Tideline mobile", start: new Date(2026, 8, 15), end: new Date(2026, 10, 7), progress: 0.61 },
  ]}
  currentDate={new Date(2026, 9, 22)}
/>`;

const d = (month: number, day: number) => new Date(2026, month, day);

const STUDIO = [
  { id: "harbour", label: "Harbour rebrand", start: d(8, 2), end: d(9, 24), progress: 0.84 },
  { id: "mobile", label: "Tideline mobile", start: d(8, 15), end: d(10, 7), progress: 0.61 },
  { id: "interviews", label: "Crew interviews", start: d(9, 1), end: d(9, 17), progress: 0.33 },
  { id: "rota", label: "Rota export", start: d(8, 15), end: d(9, 10), progress: 1 },
  { id: "signage", label: "Depot signage", start: d(9, 6), end: d(10, 21), progress: 0.48 },
];

const LAUNCH = [
  { id: "palette", label: "Brand palette", start: d(8, 28), end: d(9, 6), progress: 1 },
  { id: "icons", label: "Icon audit", start: d(9, 6), end: d(9, 14), progress: 0.7, dependsOn: ["palette"] },
  { id: "home", label: "Harbour homepage", start: d(9, 8), end: d(9, 21), progress: 0.5, dependsOn: ["palette"] },
  { id: "checklist", label: "Launch checklist", start: d(9, 17), end: d(9, 23), progress: 0, dependsOn: ["icons", "home"] },
  { id: "launch", label: "Harbour launch", start: d(9, 23), end: d(9, 24), dependsOn: ["checklist"] },
];

// Earlier reports of the same plan: each is a complete task list, not a diff.
const REPORT_DATES = [d(9, 6), d(9, 13), d(9, 20)];
const SNAPSHOTS: Record<number, typeof LAUNCH> = {
  [REPORT_DATES[0]!.getTime()]: LAUNCH.map((t) => ({ ...t, progress: t.id === "palette" ? 0.8 : t.id === "launch" ? undefined : 0 })) as typeof LAUNCH,
  [REPORT_DATES[1]!.getTime()]: LAUNCH.map((t) => ({ ...t, progress: t.id === "palette" ? 1 : t.id === "icons" ? 0.4 : t.id === "home" ? 0.2 : t.id === "launch" ? undefined : 0 })) as typeof LAUNCH,
  [REPORT_DATES[2]!.getTime()]: LAUNCH,
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["GanttChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="gantt-chart"` on the root `<figure>`; `data-rebar-part="current-date-marker"` for the `currentDate` hash-mark.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a Gantt chart typically migrates to a dedicated library (e.g. `dhtmlx-gantt`, `frappe-gantt`) rather than an antd component.",
      },
    ],
  },
];

export default function GanttChartPage() {
  const [reportDate, setReportDate] = useState<Date>(REPORT_DATES[REPORT_DATES.length - 1]!);
  const snapshot = SNAPSHOTS[reportDate.getTime()] ?? LAUNCH;
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>GanttChart</Heading>
      <Text color="secondary">A project timeline: tasks on a shared date axis, with dependency connectors.</Text>

      <DemoStage
        title="Studio timeline"
        caption="Five projects, a dashed marker for today"
        code={CODE}
        states={[
          { label: "One task", node: <GanttChart title="Rota export" tasks={[STUDIO[3]!]} /> },
          { label: "No today marker", node: <GanttChart title="Crew interviews" tasks={[STUDIO[2]!]} /> },
          { label: "Not started", node: <GanttChart title="Depot signage" tasks={[{ ...STUDIO[4]!, progress: 0 }]} currentDate={d(9, 22)} /> },
        ]}
      >
        <GanttChart title="Studio timeline" tasks={STUDIO} currentDate={d(9, 22)} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch plan" caption="Dependencies as elbows; scrub back through earlier reports" widths={false}>
        <Card
          title={`${harbour.name}: launch plan`}
          subtitle={`Due ${harbour.due}`}
          extra={<Tag tone="success">{harbour.status}</Tag>}
          avatar={<Avatar {...avatarOf(harbour.owner)} />}
        >
          <Stack gap="md">
            <WaybackSlider dates={REPORT_DATES} value={reportDate} onValueChange={setReportDate} />
            <GanttChart title="Harbour launch, as reported" tasks={snapshot} currentDate={reportDate} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
