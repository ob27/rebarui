"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Alert, Button, Card, Heading, MultiSelect, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE_OPTIONS, project } from "@/fixtures/tideline";

const CODE = `const [people, setPeople] = useState(["maya", "jonas"]);

<MultiSelect options={PEOPLE_OPTIONS} values={people} onValuesChange={setPeople} placeholder="Select teammates" aria-label="Share with" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["MultiSelect"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Built on Radix `DropdownMenu` with `CheckboxItem`s: each option is a real `role="menuitemcheckbox"` with `aria-checked`; the trigger is a `<button>` with `aria-haspopup` and `aria-expanded`. Picking keeps the menu open, so several picks need one open.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="multi-select"` on the trigger; `data-rebar-part` is `"value"` (the summary text), `"content"` (the popup) or `"item"` (per option).' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'AntD has no closed-menu multi-select: its `Select mode="multiple"` is the searchable-with-chips shape that `Combobox multiple` covers. A `Checkbox.Group` inside a `Dropdown` is the closer match.',
      },
    ],
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

export default function MultiSelectPage() {
  const [people, setPeople] = useState<string[]>(["maya", "jonas"]);
  const [shared, setShared] = useState<string[]>(["priya", "leo", "jonas"]);
  const harbour = project("harbour");

  return (
    <Stack gap="lg">
      <Heading level={1}>MultiSelect</Heading>
      <Text color="secondary">Pick several, see them all.</Text>

      <DemoStage
        title="Share with"
        caption="Checkboxes in a closed menu"
        code={CODE}
        states={[
          { label: "Empty", node: <MultiSelect options={PEOPLE_OPTIONS} placeholder="Select teammates" aria-label="Share with" /> },
          { label: "Everyone", node: <MultiSelect options={PEOPLE_OPTIONS} defaultValues={PEOPLE_OPTIONS.map((p) => p.value)} aria-label="Share with" /> },
          {
            label: "Error",
            node: (
              <Field error="Choose at least one.">
                <MultiSelect options={PEOPLE_OPTIONS} placeholder="Select teammates" aria-label="Share with, required" />
              </Field>
            ),
          },
          { label: "Disabled", node: <MultiSelect options={PEOPLE_OPTIONS} defaultValues={["maya"]} disabled aria-label="Share with, locked" /> },
        ]}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Field label="Share with">
            <MultiSelect options={PEOPLE_OPTIONS} values={people} onValuesChange={setPeople} placeholder="Select teammates" aria-label="Share with" />
            <Text size="sm" color="secondary">
              {people.length} selected
            </Text>
          </Field>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Share a project" caption="Who can see it, and what they can do" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title={`Share “${harbour.name}”`} actions={[<Button key="cancel" variant="secondary">Cancel</Button>, <Button key="share">Share</Button>]}>
          <Stack gap="md">
            <Field label="People">
              <MultiSelect options={PEOPLE_OPTIONS} values={shared} onValuesChange={setShared} placeholder="Select teammates" aria-label="People" />
            </Field>
            <Alert type="info">
              {shared.length} {shared.length === 1 ? "person" : "people"} can comment. Only you can edit.
            </Alert>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
