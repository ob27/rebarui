"use client";

import { useState } from "react";
import { Card, Heading, Stack, Sticky, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, person } from "@/fixtures/tideline";

const CODE = `<Sticky title="Offline sync for tasks" seed="sync" tags={["Eng"]}>
  Jonas: in review
</Sticky>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Sticky"] ?? [] },
  {
    type: "doc-section",
    heading: "Deterministic",
    body: [{ kind: "text", text: "`seed` (default `title`) picks the rotation and the pastel colour, so a re-render never reshuffles a board. The ink colour follows the note, not the theme, so it reads in light and dark. `Kanban` uses this for `cardVariant=\"sticky\"`." }],
  },
  {
    type: "doc-section",
    heading: "Tags",
    body: [{ kind: "text", text: "`tags` takes strings or `{ label, tone }`. Pass `onTagClose` and each tag gets a close button." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="sticky"` on the root; `data-rebar-part` is `"title"`, `"body"` or `"tags"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no sticky-note component; reimplement the look or use a plain Card." }],
  },
];

const doing = TASKS.filter((t) => t.column === "doing");

export default function StickyPage() {
  const [tags, setTags] = useState([
    { label: "Eng", tone: "info" as const },
    { label: "Blocked", tone: "error" as const },
  ]);
  return (
    <Stack gap="lg">
      <Heading level={1}>Sticky</Heading>
      <Text color="secondary">A postit-style note with a stable tilt and colour.</Text>

      <DemoStage
        title="Retro board"
        caption="Notes tilt and colour from their seed"
        code={CODE}
        states={[
          { label: "Closable tags", node: <Sticky title="Offline sync for tasks" seed="sync-closable" tags={tags} onTagClose={(closed) => setTags((prev) => prev.filter((t) => t.label !== closed))} /> },
          { label: "Long title", node: <Sticky title="Move the crew interview notes into one shared document before Friday" seed="long" /> },
          { label: "Title only", node: <Sticky title="Icon audit" seed="icons" /> },
        ]}
      >
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          <Sticky title="Brand palette shipped" seed="went1" tags={["Design"]} />
          <Sticky title="Interviews ran late" seed="improve1">
            Book slots a week ahead
          </Sticky>
          <Sticky title="Rota export done" seed="went2" tags={["Ops"]} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Sprint wall" caption="Tasks in progress, one note each" widths={false}>
        <Card title="In progress" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
            {doing.map((t) => (
              <Sticky key={t.id} title={t.title} seed={t.id} tags={[t.tag]}>
                {person(t.assignee).name}
              </Sticky>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
