"use client";

import { useState } from "react";
import { Avatar, Card, Heading, Stack, Tag, TagInput, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = "<TagInput values={tags} onValuesChange={setTags} placeholder=\"Add a tag...\" />";

function Fit({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)" }}>{children}</div>;
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TagInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Duplicates and limits",
    body: [{ kind: "text", text: "`allowDuplicates` (default `false`) skips a tag that already exists, case-insensitively. `maxTags` disables the input once reached." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"tag-input\"` on the root; parts: `chips`, `input`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Select` with `mode=\"tags\"` is the closest equivalent. Not codemod-covered." }],
  },
];

export default function TagInputPage() {
  const [tags, setTags] = useState<string[]>(["Design", "Harbour"]);
  const task = TASKS[2];
  const [taskTags, setTaskTags] = useState<string[]>([task.tag, "Brand"]);
  return (
    <Stack gap="lg">
      <Heading level={1}>TagInput</Heading>
      <Text color="secondary">A field where you type free-form tags: Enter or comma adds one.</Text>

      <DemoStage title="Task tags" caption="Type, press Enter or comma; Backspace removes the last" code={CODE}
        states={[
          { label: "Empty", node: <Fit><TagInput values={[]} placeholder="Add a tag..." aria-label="Empty tags" /></Fit> },
          { label: "Limit reached", node: <Fit><TagInput values={["Design", "Eng", "Ops"]} maxTags={3} aria-label="Limited tags" /></Fit> },
          { label: "Disabled", node: <Fit><TagInput values={["Research"]} disabled aria-label="Disabled tags" /></Fit> },
          { label: "Long tags", node: <Fit><TagInput values={["Harbour rebrand launch kit", "Crew interview follow-ups"]} aria-label="Long tags" /></Fit> },
        ]}>
        <div style={{ maxWidth: 420 }}>
          <TagInput values={tags} onValuesChange={setTags} placeholder="Add a tag..." aria-label="Task tags" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Edit task" caption="Tags on a task card" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title={task.title} subtitle={`${project(task.project).name}, due ${task.due ?? "next week"}`} avatar={<Avatar {...avatarOf(task.assignee)} />}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">Tags</Text>
            <TagInput values={taskTags} onValuesChange={setTaskTags} aria-label="Task tags" />
            <Text size="xs" color="secondary">Assigned to {person(task.assignee).name}, {person(task.assignee).role}</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
