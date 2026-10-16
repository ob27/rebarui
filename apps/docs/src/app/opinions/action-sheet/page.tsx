"use client";

import { useState } from "react";
import { ActionSheet, Button, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, person, project } from "@/fixtures/tideline";
import { PhoneList, PhoneRow, PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<ActionSheet
  trigger={<Button variant="secondary">Actions</Button>}
  title="Offline sync for tasks"
  actions={[
    { label: "Assign to…", onSelect: assign },
    { label: "Move to…", onSelect: move },
    { label: "Duplicate", onSelect: duplicate },
    { label: "Delete task", destructive: true, onSelect: remove },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ActionSheet"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Built on the same `Drawer`/Radix Dialog wiring as `BottomSheet`: focus trapped while open, Esc and backdrop click close it. Every action is a real, full-width button at least 44px tall; selecting one (or Cancel) closes the sheet after its `onSelect`. The handle is a real drag surface, never the only way out.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="action-sheet"` on the panel; `data-rebar-part="actions"` on the list, `"action"` per button, `"cancel"` on the dismiss button.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no direct equivalent (an action sheet is a mobile-native pattern). The closest antd building block is a `Dropdown` menu, which loses the bottom-anchored layout and the separate Cancel row." }],
  },
];

const sync = TASKS.find((t) => t.id === "sync") ?? TASKS[0];
const home = TASKS.find((t) => t.id === "home") ?? TASKS[0];
const rota = project("rota");

/** A static action list, for showing a sheet open inside a phone. */
function StaticActions({ actions, cancel = "Cancel" }: { actions: { label: string; destructive?: boolean; disabled?: boolean }[]; cancel?: string }) {
  return (
    <>
      <div style={{ border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden" }}>
        {actions.map((a) => (
          <div
            key={a.label}
            style={{
              minHeight: 46,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              boxShadow: "0 1px 0 var(--rebar-color-border)",
              fontSize: "var(--rebar-font-size-sm)",
              fontWeight: "var(--rebar-font-weight-medium)",
              color: a.destructive ? "var(--rebar-color-danger)" : a.disabled ? "var(--rebar-color-text-secondary)" : "var(--rebar-color-text-primary)",
            }}
          >
            {a.label}
          </div>
        ))}
      </div>
      <Button variant="secondary" style={{ width: "100%", marginTop: 12 }}>
        {cancel}
      </Button>
    </>
  );
}

export default function ActionSheetPage() {
  const [last, setLast] = useState<string | null>(null);
  const actions = (title: string) => [
    { label: "Assign to…", onSelect: () => setLast(`Assign ${title}`) },
    { label: "Move to…", onSelect: () => setLast(`Move ${title}`) },
    { label: "Duplicate", onSelect: () => setLast(`Duplicated ${title}`) },
    { label: "Delete task", destructive: true, onSelect: () => setLast(`Deleted ${title}`) },
  ];

  return (
    <Stack gap="lg">
      <Heading level={1}>ActionSheet</Heading>
      <Text color="secondary">A short list of choices that slides up from the bottom.</Text>

      <DemoStage
        title="Task actions"
        caption="Backdrop tap and Cancel dismiss"
        code={CODE}
        states={[
          {
            label: "Destructive",
            node: <ActionSheet trigger={<Button variant="secondary" size="sm">Delete…</Button>} actions={[{ label: "Delete task", destructive: true }]} />,
          },
          {
            label: "No title",
            node: <ActionSheet trigger={<Button variant="secondary" size="sm">Export…</Button>} actions={[{ label: "Export as CSV" }, { label: "Export as PDF" }]} />,
          },
          {
            label: "Long text",
            node: <ActionSheet trigger={<Button variant="secondary" size="sm">Long label…</Button>} title={sync.title} actions={[{ label: `Move “${sync.title}, edge cases” to Done` }, { label: "Keep it where it is" }]} />,
          },
          {
            label: "Custom cancel",
            node: <ActionSheet trigger={<Button variant="secondary" size="sm">Rota…</Button>} title={rota.name} cancelLabel="Not now" actions={[{ label: "Send to payroll" }]} />,
          },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <Stack gap="sm">
            <PhoneList>
              {[sync, home].map((t) => (
                <PhoneRow key={t.id} thumb={false} title={t.title} meta={`${person(t.assignee).name.split(" ")[0]} · ${t.tag}`} trailing={<ActionSheet trigger={<Button variant="secondary" size="sm">Actions</Button>} title={t.title} actions={actions(t.title)} />} />
              ))}
            </PhoneList>
            <Text size="xs" color="secondary" aria-live="polite">
              {last ? `Last choice: ${last}.` : "Nothing chosen yet."}
            </Text>
          </Stack>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On the phone" caption="A task's actions, and an export sheet with a disabled choice" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone
              title={project("harbour").name}
              height={480}
              width={250}
              dim
              overlay={
                <PhoneSheet label={sync.title}>
                  <StaticActions actions={[{ label: "Assign to…" }, { label: "Move to…" }, { label: "Duplicate" }, { label: "Delete task", destructive: true }]} />
                </PhoneSheet>
              }
            >
              <PhoneList>
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
                <PhoneRow title={home.title} meta={`${person(home.assignee).name.split(" ")[0]} · ${home.tag}`} tint={2} />
              </PhoneList>
            </TidelinePhone>
            <TidelinePhone
              title={rota.name}
              height={480}
              width={250}
              dim
              overlay={
                <PhoneSheet title="Export rota" label="48 shifts, 6 crew">
                  <StaticActions actions={[{ label: "Export as CSV" }, { label: "Export as PDF" }, { label: "Send to payroll", disabled: true }]} />
                </PhoneSheet>
              }
            >
              <PhoneList>
                <PhoneRow title="Export shift pattern" meta={`${person("leo").name.split(" ")[0]} · Ops`} tint={4} />
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
              </PhoneList>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
