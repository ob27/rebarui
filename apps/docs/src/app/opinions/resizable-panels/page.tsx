"use client";

import { Avatar, Box, Card, Heading, ResizablePanels, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, TASKS, avatarOf, gbp, person, project } from "@/fixtures/tideline";

const BOX = { border: "1px solid var(--rebar-color-border)", borderRadius: 8, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" } as const;

const CODE = `<ResizablePanels
  defaultSplit={0.4}
  first={<TaskList />}
  second={<TaskDetail />}
/>`;

const taskList = (
  <Stack gap="xs" style={{ padding: "var(--rebar-space-md)" }}>
    {TASKS.slice(0, 5).map((t) => (
      <Text key={t.id} size="sm">{t.title}</Text>
    ))}
  </Stack>
);
const taskDetail = (
  <Stack gap="xs" style={{ padding: "var(--rebar-space-md)" }}>
    <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{TASKS[3].title}</Text>
    <Text size="sm" color="secondary">{project(TASKS[3].project).name}, assigned to {person(TASKS[3].assignee).name}</Text>
  </Stack>
);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ResizablePanels"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The divider is a real `role="separator"` with `aria-orientation`/`aria-valuenow`/`aria-valuemin`/`aria-valuemax`, fully keyboard-operable (ArrowLeft/ArrowRight when horizontal, ArrowUp/ArrowDown when vertical, Home/End to jump to the min/max split) — not a drag-only control (ref/HEURISTICS.md #38, #48). Its real touch/click hit area is 44px wide even though the visible line is 4px, via padding.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="resizable-panels"`; `data-rebar-part="first-panel"|"divider"|"divider-line"|"second-panel"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD has no built-in resizable-panels/split-pane primitive of its own — a migration typically reaches for a small dedicated library (e.g. `react-resizable-panels` or `allotment`) rather than an antd component.",
      },
    ],
  },
];

export default function ResizablePanelsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ResizablePanels</Heading>
      <Text color="secondary">Two panels with a draggable divider. Arrow keys resize it too.</Text>

      <DemoStage
        title="Task list and detail"
        caption="Drag the divider, or focus it and use the arrow keys"
        code={CODE}
        states={[
          { label: "Vertical", node: <Box style={{ ...BOX, height: 180 }}><ResizablePanels direction="vertical" first={taskList} second={taskDetail} /></Box> },
          { label: "Narrow list", node: <Box style={{ ...BOX, height: 140 }}><ResizablePanels defaultSplit={0.25} minSplit={0.2} maxSplit={0.5} first={taskList} second={taskDetail} /></Box> },
        ]}
      >
        <Box style={{ ...BOX, height: 180 }}>
          <ResizablePanels defaultSplit={0.4} first={taskList} second={taskDetail} />
        </Box>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects" caption="List on the left, the open project on the right" widths={false}>
        <Box style={{ ...BOX, height: 280 }}>
          <ResizablePanels
            defaultSplit={0.38}
            minSplit={0.25}
            first={
              <Stack gap="xs" style={{ padding: "var(--rebar-space-sm)" }}>
                {PROJECTS.map((p) => (
                  <Stack key={p.id} direction="row" gap="sm" align="center" justify="between" style={{ padding: "6px 8px", borderRadius: 6, background: p.id === "harbour" ? "var(--rebar-color-tint-3)" : undefined }}>
                    <Text size="sm">{p.name}</Text>
                    <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                  </Stack>
                ))}
              </Stack>
            }
            second={
              <Card title={project("harbour").name} subtitle={project("harbour").summary} avatar={<Avatar {...avatarOf("maya")} />} style={{ margin: "var(--rebar-space-md)" }}>
                <Stack gap="xs">
                  <Text size="sm">{project("harbour").done}% done, due {project("harbour").due}</Text>
                  <Text size="sm" color="secondary">Budget {gbp(project("harbour").budget)}</Text>
                </Stack>
              </Card>
            }
          />
        </Box>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
