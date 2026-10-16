"use client";

import { useState } from "react";
import { Card, Editable, Heading, Progress, Stack, Text, TodoItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, project } from "@/fixtures/tideline";

const CODE = "<TodoItem label=\"Draft launch checklist\" completed={done} onToggle={setDone} toggleLabel={`Mark as ${done ? \"incomplete\" : \"complete\"}`} />";

const LAUNCH = ["Final palette signed off", "Homepage live on staging", "Van livery photos filed", "Crew briefing sent"];
const noop = () => {};
function row(label: string, completed: boolean, extra: { disabled?: boolean; celebration?: "big" | "small" | "none" } = {}) {
  return <TodoItem label={<Text size="sm">{label}</Text>} completed={completed} onToggle={noop} toggleLabel={`Toggle ${label}`} {...extra} />;
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TodoItem"] ?? [] },
  {
    type: "doc-section",
    heading: "Label and disabled",
    body: [{ kind: "text", text: "`label` takes any node, so an `Editable` composes in. `disabled` shows a struck-through toggle that ignores clicks, for a task that is blocked rather than just not done." }],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The toggle is a real `<button role=\"checkbox\">` of at least 44 by 44 px. The burst only fires when completing, and is skipped under `prefers-reduced-motion`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"todo-item\"` on the root; parts: `toggle`, `label`, `burst` (only while a celebration animates)." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Checkbox` with your own confetti effect." }],
  },
];

export default function TodoItemPage() {
  const [tasks, setTasks] = useState(TASKS.slice(0, 4));
  const [done, setDone] = useState<string[]>(["sync"]);
  const [checked, setChecked] = useState<string[]>([LAUNCH[0]]);
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>TodoItem</Heading>
      <Text color="secondary">One checkable row: a large toggle, a label, and an optional confetti burst on completion.</Text>

      <DemoStage title="Task list" caption="Tick a task, rename it in place" code={CODE} widths={false}
        states={[
          { label: "Done", node: row("Brand palette", true) },
          { label: "Disabled", node: row("Waiting on legal review", false, { disabled: true }) },
          { label: "Big celebration", node: row("Ship the harbour homepage", false, { celebration: "big" }) },
          { label: "No celebration", node: row("Icon audit", false, { celebration: "none" }) },
          { label: "Long label", node: row("Book the twelve crew interviews and confirm every night-watch slot with Leo", false) },
        ]}>
        <Stack gap="sm" style={{ maxWidth: 380 }}>
          {tasks.map((t) => (
            <TodoItem
              key={t.id}
              label={<Editable value={t.title} onChange={(text) => setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, title: text } : x)))} aria-label="Task" className={done.includes(t.id) ? "rebar-todo-item-label-completed" : undefined} />}
              completed={done.includes(t.id)}
              onToggle={(c) => setDone((p) => (c ? [...p, t.id] : p.filter((i) => i !== t.id)))}
              toggleLabel={`Mark "${t.title}" as ${done.includes(t.id) ? "incomplete" : "complete"}`}
            />
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch checklist" caption="Harbour rebrand, launching 24 Oct" widths={false}>
        <Card style={{ maxWidth: 460, margin: "0 auto" }} title="Harbour launch checklist" subtitle={`${harbour.status}, ${harbour.done}% done`} labels={[{ label: "Brand", tone: "info" }]}>
          <Stack gap="md">
            <Progress value={checked.length * 25} aria-label="Checklist progress" />
            {LAUNCH.map((l) => (
              <TodoItem key={l} label={<Text size="sm">{l}</Text>} completed={checked.includes(l)} onToggle={(c) => setChecked((p) => (c ? [...p, l] : p.filter((i) => i !== l)))} toggleLabel={`Mark "${l}" as done`} celebration="small" />
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
