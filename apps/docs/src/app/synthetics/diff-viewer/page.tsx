"use client";

import { useState } from "react";
import { Button, Card, DiffViewer, Heading, SegmentedControl, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const OLD_TEXT = `export function syncTasks(crewId) {
  const tasks = fetchTasks(crewId);
  return tasks;
}

syncTasks("harbour");`;

const NEW_TEXT = `export function syncTasks(crewId, offline = true) {
  const tasks = offline ? readCache(crewId) : fetchTasks(crewId);
  return tasks;
}

syncTasks("harbour");
syncTasks("mobile");`;

const CODE = `<DiffViewer oldText={before} newText={after} mode="split" oldLabel="main" newLabel="offline-sync" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DiffViewer"] ?? [] },
  {
    type: "doc-section",
    heading: "A real line alignment",
    body: [
      {
        kind: "text",
        text: "It aligns the two texts with a longest-common-subsequence diff, so an insertion in the middle does not mark every later line as changed. Only the changed signature, the changed body line and the new last line are marked here. It is static, like `CodeBlock`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="diff-viewer"`, `data-rebar-mode="split" | "unified"`; each line carries `data-rebar-line-type="same" | "add" | "remove" | "empty"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no diff component; a migration typically keeps this LCS-diff logic and re-skins the rendering." }],
  },
];

export default function DiffViewerPage() {
  const [mode, setMode] = useState<"split" | "unified">("split");
  const toggle = (
    <SegmentedControl
      options={[
        { value: "split", label: "Split" },
        { value: "unified", label: "Unified" },
      ]}
      value={mode}
      onValueChange={(v) => setMode(v as "split" | "unified")}
    />
  );

  return (
    <Stack gap="lg">
      <Heading level={1}>DiffViewer</Heading>
      <Text color="secondary">Old and new text compared line by line.</Text>

      <DemoStage
        title="Offline sync change"
        caption="Switch between split and unified"
        code={CODE}
        states={[
          { label: "No differences", node: <DiffViewer oldText="syncTasks(crew);" newText="syncTasks(crew);" mode="unified" /> },
          { label: "All added", node: <DiffViewer oldText="" newText={"readCache(crew);\nsyncTasks(crew);"} mode="unified" /> },
          { label: "Long line", node: <DiffViewer oldText="const note = 'Offline sync is in review.';" newText="const note = 'Offline sync is in review and the crew-interview notes are late.';" mode="unified" /> },
        ]}
      >
        <Stack gap="sm">
          {toggle}
          <DiffViewer oldText={OLD_TEXT} newText={NEW_TEXT} mode={mode} oldLabel="main" newLabel="offline-sync" />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Review" caption="A change awaiting Jonas Weber's approval" widths={false}>
        <Card title="Offline sync" actions={[<Button key="a">Approve</Button>, <Button key="r" variant="secondary">Request changes</Button>]}>
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center">
              <Tag tone="info">Review</Tag>
              <Text size="sm" color="secondary">Tideline mobile, due 7 Nov</Text>
            </Stack>
            <DiffViewer oldText={OLD_TEXT} newText={NEW_TEXT} mode="unified" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
