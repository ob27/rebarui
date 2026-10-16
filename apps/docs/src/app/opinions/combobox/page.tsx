"use client";

import type { ReactNode } from "react";
import { Button, Card, Combobox, Heading, Input, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE_OPTIONS, TAG_OPTIONS } from "@/fixtures/tideline";

const CODE = `<Combobox options={PEOPLE_OPTIONS} placeholder="Choose a teammate" aria-label="Assignee" onValueChange={setAssignee} />

// several picks, shown as removable chips
<Combobox multiple options={TAG_OPTIONS} placeholder="Add a tag" aria-label="Tags" onValuesChange={setTags} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Combobox"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real WAI-ARIA combobox: `role="combobox"` with `aria-expanded` and `aria-controls`, a `role="listbox"` popup, and `aria-activedescendant` tracking the arrow-key-highlighted option. Type to filter, arrows to move, Enter to pick, Escape to close.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="combobox"`; `data-rebar-part="list"` on the option popup.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "A close, low-risk rename: AntD's `AutoComplete` takes the same `options` and filtering shape." }],
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

export default function ComboboxPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Combobox</Heading>
      <Text color="secondary">Search, pick, done.</Text>

      <DemoStage
        title="Assign a teammate"
        caption="Type to filter, arrows to move"
        code={CODE}
        states={[
          { label: "Empty", node: <Combobox options={PEOPLE_OPTIONS} placeholder="Choose a teammate" aria-label="Assignee" /> },
          { label: "Chosen", node: <Combobox options={PEOPLE_OPTIONS} defaultValue="maya" aria-label="Assignee" /> },
          { label: "Several", node: <Combobox multiple options={TAG_OPTIONS} defaultValues={["design", "ops"]} placeholder="Add a tag" aria-label="Tags" /> },
          {
            label: "Error",
            node: (
              <Field error="Pick someone to own this.">
                <Combobox options={PEOPLE_OPTIONS} placeholder="Choose a teammate" aria-label="Assignee, required" />
              </Field>
            ),
          },
          { label: "Disabled", node: <Combobox options={PEOPLE_OPTIONS} placeholder="Locked" disabled aria-label="Assignee, locked" /> },
        ]}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Field label="Assignee">
            <Combobox options={PEOPLE_OPTIONS} placeholder="Choose a teammate" aria-label="Assignee" />
          </Field>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="New task" caption="The same picker, closed, inside a form" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="New task" actions={[<Button key="cancel" variant="secondary">Cancel</Button>, <Button key="create">Create task</Button>]}>
          <Stack gap="md">
            <Input defaultValue="Draft the launch checklist" aria-label="Task title" />
            <Combobox options={PEOPLE_OPTIONS} defaultValue="priya" aria-label="Assignee" />
            <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
              <Tag tone="info">Research</Tag>
              <Tag tone="warning">Due Fri 30 Oct</Tag>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
