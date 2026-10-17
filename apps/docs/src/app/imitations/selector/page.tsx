"use client";

import { Button, Card, Heading, Selector, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, TAG_OPTIONS } from "@/fixtures/tideline";
import { useState } from "react";

const CODE = `<Selector options={TAG_OPTIONS} multiple value={tags} onValueChange={setTags} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Selector"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="selector"` on the root; parts: `chip`, `chip-label`, `chip-description`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — the antd-mobile pattern. AntD desktop has no direct equivalent; a `Checkbox.Group`/`Radio.Group` with `optionType=\"button\"` is the closest structural match.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Grid columns and choice semantics",
    body: [
      {
        "kind": "text",
        "text": "`columns` lays the chips out as a real grid (`display: grid` with that many equal columns). `chipRole=\"choice\"` swaps the default toggle buttons (`aria-pressed`) for `role=\"checkbox\"` with `aria-checked` when `multiple`, or `role=\"radio\"` inside a `radiogroup` otherwise (arrow keys move and select; the selected chip is the tab stop)."
      },
      {
        "kind": "code",
        "code": "<Selector options={sizes} columns={3} chipRole=\"choice\" aria-label=\"Size\" />"
      }
    ],
  },
];

export default function SelectorPage() {
  const [tags, setTags] = useState<(string | number)[]>(["design", "eng"]);
  const [projectId, setProjectId] = useState<(string | number)[]>(["harbour"]);

  return (
    <Stack gap="lg">
      <Heading level={1}>Selector</Heading>
      <Text color="secondary">A grid of selectable chips, every option visible at once.</Text>

      <DemoStage title="Task tags" caption="Pick any number; every option stays on screen" code={CODE} widths={false}
        states={[
          { label: "Disabled option", node: <Selector options={[...TAG_OPTIONS.slice(0, 3), { ...TAG_OPTIONS[3], disabled: true }]} defaultValue={["design"]} aria-label="With a disabled option" /> },
          { label: "Disabled", node: <Selector options={TAG_OPTIONS} defaultValue={["eng"]} disabled aria-label="Disabled" /> },
          { label: "Single choice", node: <Selector options={TAG_OPTIONS} defaultValue={["ops"]} aria-label="Single choice" /> },
        ]}
      >
        <Selector options={TAG_OPTIONS} multiple value={tags} onValueChange={setTags} aria-label="Task tags" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="New task" caption="Chips with a description line: one project, one or more tags" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Add a task" actions={[<Button key="add">Add task</Button>, <Button key="cancel" variant="tertiary">Cancel</Button>]}>
          <Stack gap="lg">
            <Stack gap="xs">
              <Text size="sm" color="secondary">Project</Text>
              <Selector options={PROJECTS.slice(0, 3).map((p) => ({ value: p.id, label: p.name, description: `Due ${p.due}` }))} value={projectId} onValueChange={setProjectId} columns={1} aria-label="Project" />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" color="secondary">Tags</Text>
              <Selector options={TAG_OPTIONS} multiple defaultValue={["design"]} aria-label="Tags" />
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
