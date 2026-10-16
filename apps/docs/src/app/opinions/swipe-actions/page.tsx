"use client";

import { useState } from "react";
import { Heading, Stack, SwipeActions, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, person } from "@/fixtures/tideline";
import type { Task } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<SwipeActions
  actions={[
    { label: "Assign", onSelect: () => assign(task) },
    { label: "Delete", destructive: true, onSelect: () => remove(task) },
  ]}
>
  <TaskRow task={task} />
</SwipeActions>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SwipeActions"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Every revealed action is a real, keyboard-focusable button, and a small, always-visible kebab button on the row's trailing edge opens and closes the same state a swipe does, so a mouse or keyboard user has the same access. Past about 40% of the actions' width, release snaps open; otherwise the row springs back (a plain CSS transition).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="swipe-actions"`; parts: `content`, `actions`, `action` (destructive ones carry `data-rebar-destructive`), `toggle`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no direct equivalent. antd-mobile's `SwipeAction` is the closer sibling library if the migration target is genuinely mobile." }],
  },
];

const DUE: Record<string, string> = { home: "Fri 24 Oct", icons: "Mon", checklist: "Fri", sync: "Wed", export: "Done" };
const ROWS = ["home", "icons", "checklist", "export"].map((id) => TASKS.find((t) => t.id === id)).filter((t): t is Task => Boolean(t));
const TINT: Record<string, 1 | 2 | 3 | 4> = { home: 1, icons: 3, checklist: 2, export: 4 };

function row(t: Task, thumb = true) {
  return <PhoneRow thumb={thumb} title={t.title} meta={`${person(t.assignee).name.split(" ")[0]} · ${DUE[t.id] ?? t.due ?? ""}`} tint={TINT[t.id] ?? 1} trailing={<span style={{ width: 36 }} />} />;
}

export default function SwipeActionsPage() {
  const [log, setLog] = useState<string | null>(null);
  const [gone, setGone] = useState<string[]>([]);
  const act = (t: Task) => [
    { label: "Assign", onSelect: () => setLog(`Assign “${t.title}”`) },
    { label: "Delete", destructive: true, onSelect: () => setGone((g) => [...g, t.id]) },
  ];

  return (
    <Stack gap="lg">
      <Heading level={1}>SwipeActions</Heading>
      <Text color="secondary">Swipe a row to reveal quick actions.</Text>

      <DemoStage
        title="Task rows"
        caption="Swipe left, or use the kebab button"
        code={CODE}
        states={[
          { label: "Idle", node: <PhoneList><SwipeActions actions={act(ROWS[0])}>{row(ROWS[0], false)}</SwipeActions></PhoneList> },
          { label: "Disabled", node: <PhoneList><SwipeActions disabled actions={act(ROWS[3])}>{row(ROWS[3], false)}</SwipeActions></PhoneList> },
          { label: "One action", node: <PhoneList><SwipeActions actions={[{ label: "Done", onSelect: () => setLog(`Done “${ROWS[2].title}”`) }]}>{row(ROWS[2], false)}</SwipeActions></PhoneList> },
          { label: "Three actions", node: <PhoneList><SwipeActions actions={[{ label: "Assign", onSelect: () => setLog("Assign") }, { label: "Move", onSelect: () => setLog("Move") }, { label: "Delete", destructive: true, onSelect: () => setLog("Delete") }]}>{row(ROWS[1], false)}</SwipeActions></PhoneList> },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <Stack gap="sm">
            <PhoneList>
              {ROWS.filter((t) => !gone.includes(t.id)).map((t) => (
                <SwipeActions key={t.id} actions={act(t)}>
                  {row(t)}
                </SwipeActions>
              ))}
            </PhoneList>
            <Text size="xs" color="secondary" aria-live="polite">
              {gone.length ? `${gone.length} deleted. ` : ""}
              {log ?? "Nothing chosen yet."}
            </Text>
          </Stack>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Tasks" caption="The same rows on the phone, with a tip under the list" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title="Tasks" tabs={0} height={460} width={250}>
              <PhoneList>
                {ROWS.map((t) => (
                  <SwipeActions key={t.id} actions={act(t)}>
                    {row(t)}
                  </SwipeActions>
                ))}
              </PhoneList>
            </TidelinePhone>
            <TidelinePhone title="Tasks" tabs={0} height={460} width={250}>
              <Stack gap="md">
                <PhoneList>
                  {ROWS.slice(0, 3).map((t) => (
                    <SwipeActions key={t.id} actions={act(t)}>
                      {row(t)}
                    </SwipeActions>
                  ))}
                </PhoneList>
                <div style={{ padding: "12px 14px", borderRadius: 14, background: "var(--rebar-color-tint-2)" }}>
                  <Kicker style={{ marginBottom: 4 }}>Tip</Kicker>
                  <Text size="sm">Swipe left to assign or delete, or tap the dots.</Text>
                </div>
              </Stack>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
