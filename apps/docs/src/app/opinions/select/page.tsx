"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Card, DeviceFrame, Heading, MobileTabBar, Select, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { COLUMN_TITLES, PROJECT_OPTIONS, TASKS, project } from "@/fixtures/tideline";

const STATUS_OPTIONS = [
  { value: "todo", label: COLUMN_TITLES.todo },
  { value: "doing", label: COLUMN_TITLES.doing },
  { value: "review", label: "In review" },
  { value: "done", label: COLUMN_TITLES.done },
  { value: "archived", label: "Archived", disabled: true },
];
const SORT_OPTIONS = [
  { value: "due", label: "Due date" },
  { value: "title", label: "Title" },
  { value: "owner", label: "Owner" },
];

const CODE = `const [status, setStatus] = useState("doing");

<Select options={STATUS_OPTIONS} value={status} onValueChange={setStatus} aria-label="Status" />
<Select options={PROJECT_OPTIONS} defaultValue="harbour" aria-label="Project" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Select"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real Radix select: the trigger is a `<button>` with `aria-haspopup` and `aria-expanded`, the list a `role=\"listbox\"`. Arrow keys move, typing jumps to a match, Enter picks, Escape closes; a disabled option is announced as such.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="select"` on the trigger, with `data-rebar-size`; `.rebar-select-content` on the popover.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Select` takes `options`, `value` and `onChange`: a close, low-risk rename." }],
  },
];

function Field({ label, error, children }: { label?: string; error?: string; children: ReactNode }) {
  return (
    <Stack gap="xs">
      {label ? (
        <Text as="span" size="xs" style={{ fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" }}>
          {label}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text size="sm" style={{ color: "var(--rebar-color-danger)" }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}

function Phone({ title, children, tabBar }: { title: string; children: ReactNode; tabBar?: boolean }) {
  return (
    <DeviceFrame variant="phone" style={{ maxWidth: 280 }}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
          <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
            {title}
          </Heading>
        </div>
        <Stack gap="md" style={{ padding: 16, flex: 1 }}>
          {children}
        </Stack>
        {tabBar ? <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={1} /> : null}
      </div>
    </DeviceFrame>
  );
}

export default function SelectPage() {
  const [status, setStatus] = useState("doing");
  const [filterProject, setFilterProject] = useState("harbour");
  const tasks = TASKS.filter((t) => t.project === filterProject);

  return (
    <Stack gap="lg">
      <Heading level={1}>Select</Heading>
      <Text color="secondary">A closed list of choices.</Text>

      <DemoStage
        title="Project status"
        caption="Native feel, custom list"
        code={CODE}
        states={[
          { label: "Placeholder", node: <Select options={STATUS_OPTIONS} placeholder="Select a status" aria-label="Status" /> },
          {
            label: "Error",
            node: (
              <Field error="Status is required.">
                <Select options={STATUS_OPTIONS} placeholder="Select a status" aria-label="Status, required" />
              </Field>
            ),
          },
          { label: "Disabled", node: <Select options={STATUS_OPTIONS} defaultValue="done" disabled aria-label="Status, locked" /> },
          {
            label: "Sizes",
            node: (
              <Stack gap="sm" align="start">
                <Select options={STATUS_OPTIONS} defaultValue="todo" size="sm" aria-label="Status, small" />
                <Select options={STATUS_OPTIONS} defaultValue="todo" aria-label="Status, medium" />
                <Select options={STATUS_OPTIONS} defaultValue="todo" size="lg" aria-label="Status, large" />
              </Stack>
            ),
          },
        ]}
      >
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: "1 1 220px", maxWidth: 300 }}>
            <Field label="Status">
              <Select options={STATUS_OPTIONS} value={status} onValueChange={setStatus} aria-label="Status" />
            </Field>
          </div>
          <div style={{ flex: "1 1 220px", maxWidth: 300 }}>
            <Field label="Project">
              <Select options={PROJECT_OPTIONS} defaultValue="harbour" aria-label="Project" />
              <Text size="sm" color="secondary">
                {project("harbour").done}% done
              </Text>
            </Field>
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Filter the board" caption="Two selects in a filter bar, and the picker on phones">
        <Stack gap="lg">
          <Card style={{ maxWidth: 520, margin: "0 auto" }} title="Filter the board">
            <Stack gap="md">
              <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 180px" }}>
                  <Field label="Project">
                    <Select options={PROJECT_OPTIONS} value={filterProject} onValueChange={setFilterProject} aria-label="Project" />
                  </Field>
                </div>
                <div style={{ flex: "1 1 180px" }}>
                  <Field label="Sort by">
                    <Select options={SORT_OPTIONS} defaultValue="due" aria-label="Sort by" />
                  </Field>
                </div>
              </Stack>
              <Stack gap="xs">
                {tasks.map((t) => (
                  <Stack key={t.id} direction="row" gap="sm" align="center" style={{ padding: "10px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--rebar-color-tint-3)", flex: "0 0 auto" }} />
                    <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                      <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                        {t.title}
                      </Text>
                      <Text as="span" size="xs" color="secondary">
                        {t.due ? `Due ${t.due}` : COLUMN_TITLES[t.column]}
                      </Text>
                    </Stack>
                    <Tag>{t.tag}</Tag>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <Phone title="New task">
              <Field label="Project">
                <Select options={PROJECT_OPTIONS} defaultValue="harbour" aria-label="Project" />
              </Field>
              <Field label="Status">
                <Select options={STATUS_OPTIONS} defaultValue="doing" aria-label="Status" />
              </Field>
            </Phone>
            <Phone title="New task" tabBar>
              <Field label="Project">
                <Select options={PROJECT_OPTIONS} defaultValue="harbour" aria-label="Project" />
              </Field>
              <Field label="Status" error="Status is required.">
                <Select options={STATUS_OPTIONS} placeholder="Select a status" aria-label="Status, required" />
              </Field>
            </Phone>
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
