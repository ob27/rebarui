import { GanttChart, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const TASKS = [
  { id: "design", label: "Design", start: new Date(2026, 8, 1), end: new Date(2026, 8, 7), progress: 1 },
  { id: "build", label: "Build", start: new Date(2026, 8, 7), end: new Date(2026, 8, 18), progress: 0.6, dependsOn: ["design"] },
  { id: "test", label: "Test", start: new Date(2026, 8, 16), end: new Date(2026, 8, 23), progress: 0.1, dependsOn: ["build"] },
  { id: "launch", label: "Launch", start: new Date(2026, 8, 23), end: new Date(2026, 8, 25), dependsOn: ["test"] },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<GanttChart title="Launch plan" tasks={[{ id: "design", label: "Design", start: new Date(2026, 8, 1), end: new Date(2026, 8, 7), progress: 1 }, /* ... */]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["GanttChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Dependencies as simple elbow connectors",
    body: [
      {
        kind: "text",
        text: "A task's `dependsOn` draws a simple right-angle elbow line (with an arrowhead) from the depended-on task's bar end to this task's bar start — not a curved connector. A dangling id (referencing a task that's been renamed or removed) is silently skipped rather than throwing, since a caller mid-edit of a task list shouldn't have this component crash on a stale reference. The x-axis reuses the same tick-generation approach `LineChart`/`ScatterChart` already use, adapted for dates.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="gantt-chart"` on the root `<figure>`.',
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
  return (
    <Stack gap="lg">
      <Heading level={1}>GanttChart</Heading>
      <Text color="secondary">
        A project timeline — tasks positioned on a shared date axis, with dependency connectors.
      </Text>

      <GanttChart title="Launch plan" tasks={TASKS} />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
