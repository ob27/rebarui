"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Avatar, Button, Heading, SidePanel, Skeleton, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, avatarOf, gbp, person, project } from "@/fixtures/tideline";
import type { Task } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Stack direction="row" style={{ height: 420 }}>
  <TaskList tasks={tasks} selected={task} onSelect={setTask} />
  <SidePanel title="Task" width={240} open={open} onOpenChange={setOpen}>
    <TaskDetails task={task} />
  </SidePanel>
</Stack>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SidePanel"] ?? [] },
  {
    type: "doc-section",
    heading: "Behaviour",
    body: [{ kind: "text", text: "Non-modal: no backdrop, no portal, the page beside it stays usable. Collapsing leaves a slim rail with a reopen button, so there is always a way back in. Same `open`/`defaultOpen`/`onOpenChange` convention as every other stateful construct." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="side-panel"`, `data-rebar-open`; parts: `header`, `close`, `content`, `toggle` (on the collapsed rail).' }],
  },
];

const ROWS = ["export", "home", "icons"].map((id) => TASKS.find((t) => t.id === id)).filter((t): t is Task => Boolean(t));
const META: Record<string, { due: string; status: string; tone: "success" | "info" | "default"; budget: number }> = {
  export: { due: "Thu", status: "Done", tone: "success", budget: 900 },
  home: { due: "Fri", status: "In progress", tone: "info", budget: 2400 },
  icons: { due: "Mon", status: "To do", tone: "default", budget: 600 },
};

function Details({ task, compact }: { task: Task; compact?: boolean }) {
  const owner = person(task.assignee);
  const m = META[task.id];
  const rows: [string, ReactNode][] = [
    ["Status", <Tag key="s" tone={m.tone}>{m.status}</Tag>],
    ["Owner", <Stack key="o" direction="row" gap="xs" align="center"><Avatar size="sm" {...avatarOf(owner.id)} /><Text size="sm">{compact ? owner.name.split(" ")[0] : owner.name}</Text></Stack>],
    ["Due", <Text key="d" size="sm">{m.due} {project(task.project).due}</Text>],
  ];
  if (!compact) rows.push(["Budget", <Text key="b" size="sm">{gbp(m.budget)}</Text>]);
  return (
    <Stack gap="md">
      <Heading level={3} style={{ fontSize: 18 }}>
        {task.title}
      </Heading>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", alignItems: "center" }}>
        {rows.map(([k, v]) => (
          <span key={k} style={{ display: "contents" }}>
            <Text size="sm" color="secondary">
              {k}
            </Text>
            {v}
          </span>
        ))}
      </div>
      {compact ? null : (
        <div style={{ padding: "12px 14px", borderRadius: 14, background: "var(--rebar-color-tint-2)" }}>
          <Kicker style={{ marginBottom: 4 }}>Note</Kicker>
          <Text size="sm">Waiting on final harbour photography from Leo.</Text>
        </div>
      )}
      <Stack direction={compact ? "column" : "row"} gap="sm" style={{ flexWrap: "wrap" }}>
        <Button size="sm">Mark done</Button>
        <Button size="sm" variant="secondary">
          Reassign
        </Button>
      </Stack>
    </Stack>
  );
}

const FRAME: CSSProperties = { display: "flex", border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" };

export default function SidePanelPage() {
  const [task, setTask] = useState<Task>(ROWS[1]);
  const [open, setOpen] = useState(true);

  return (
    <Stack gap="lg">
      <Heading level={1}>SidePanel</Heading>
      <Text color="secondary">A detail panel beside the page, or a sheet from the edge on phones.</Text>

      <DemoStage
        title="Task details"
        caption="Pick a row; the panel collapses to a rail and comes back"
        code={CODE}
        states={[
          { label: "Loading", node: <div style={{ ...FRAME, height: 180 }}><SidePanel title="Task" width={180} hideToggle style={{ flex: 1 }}><Stack gap="sm"><Skeleton variant="text" lines={2} /><Skeleton variant="rect" height={48} /></Stack></SidePanel></div> },
          { label: "Empty", node: <div style={{ ...FRAME, height: 180 }}><SidePanel title="Task" width={180} hideToggle style={{ flex: 1 }}><Text size="sm" color="secondary">Select a task to see its details.</Text></SidePanel></div> },
          { label: "Error", node: <div style={{ ...FRAME, height: 180 }}><SidePanel title="Task" width={180} hideToggle style={{ flex: 1 }}><Stack gap="sm"><Text size="sm" style={{ color: "var(--rebar-color-danger)", fontWeight: "var(--rebar-font-weight-semibold)" }}>Could not load task</Text><Button size="sm" variant="secondary">Try again</Button></Stack></SidePanel></div> },
          { label: "Collapsed", node: <div style={{ ...FRAME, height: 180, justifyContent: "flex-end" }}><SidePanel title="Task" defaultOpen={false}><Text size="sm">Details</Text></SidePanel></div> },
        ]}
      >
        <div style={{ ...FRAME, height: 420 }}>
          <div style={{ flex: 1, minWidth: 0, padding: 18, overflow: "auto" }}>
            <Stack gap="sm">
              <Kicker>{project("harbour").name}</Kicker>
              <PhoneList>
                {ROWS.map((t) => (
                  <button key={t.id} type="button" onClick={() => { setTask(t); setOpen(true); }} aria-pressed={task.id === t.id} style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", textAlign: "left", font: "inherit", cursor: "pointer" }}>
                    <PhoneRow thumb={false} selected={task.id === t.id} title={t.title} meta={`${person(t.assignee).name}, due ${META[t.id].due}`} trailing={<Tag tone={META[t.id].tone}>{META[t.id].status}</Tag>} />
                  </button>
                ))}
              </PhoneList>
            </Stack>
          </div>
          <SidePanel title="Task" width={240} open={open} onOpenChange={setOpen}>
            <Details task={task} />
          </SidePanel>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="The panel slides over the list from the right" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone
              title="Tasks"
              height={460}
              dim
              overlay={
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, zIndex: 1002, display: "flex", boxShadow: "var(--rebar-shadow-float)" }}>
                  <SidePanel title="Task" width={205} defaultOpen style={{ height: "100%" }}>
                    <Details task={ROWS[1]} compact />
                  </SidePanel>
                </div>
              }
            >
              <PhoneList>
                {ROWS.map((t, i) => (
                  <PhoneRow key={t.id} title={t.title} meta={META[t.id].status} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                ))}
              </PhoneList>
            </TidelinePhone>
            <TidelinePhone title="Tasks" tabs={0} height={460}>
              <PhoneList>
                {ROWS.map((t, i) => (
                  <PhoneRow key={t.id} title={t.title} meta={META[t.id].status} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                ))}
              </PhoneList>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
