"use client";

import { useState } from "react";
import { Button, Card, Heading, Stack, Text, TreeSelect } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = "<TreeSelect data={data} value={value} onValueChange={(value, label) => setValue(value)} placeholder=\"Select a project\" />";

const KICKERS = Array.from(new Set(PROJECTS.map((p) => p.kicker)));
const DATA = KICKERS.map((k) => ({ value: k, label: k, children: PROJECTS.filter((p) => p.kicker === k).map((p) => ({ value: p.id, label: p.name })) }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TreeSelect"] ?? [] },
  {
    type: "doc-section",
    heading: "Built on TreeView",
    body: [{ kind: "text", text: "The popover is the real `TreeView`, so `data` has the same shape and keyboard behaviour. Picking a node closes it." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"tree-select\"` on the trigger; the popover holds a real `TreeView` with its own attributes." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `TreeSelect` is a close equivalent: `data` (`value`, `label`, `children`) maps to `treeData` (`value`, `title`, `children`)." }],
  },
];

export default function TreeSelectPage() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Stack gap="lg">
      <Heading level={1}>TreeSelect</Heading>
      <Text color="secondary">A trigger that opens a popover tree; picking a node closes it.</Text>

      <DemoStage title="Team picker" caption="Projects grouped by team" code={CODE} widths={false}
        states={[
          { label: "Nothing chosen", node: <TreeSelect data={DATA} placeholder="Select a project" /> },
          { label: "A chosen project", node: <TreeSelect data={DATA} defaultValue="mobile" /> },
          { label: "A chosen group", node: <TreeSelect data={DATA} defaultValue="Brand" /> },
        ]}>
        <Stack gap="sm" align="start">
          <TreeSelect data={DATA} value={value} onValueChange={(v) => setValue(v)} placeholder="Select a project" />
          <Text size="sm" color="secondary">Selected: {value ?? "none"}</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Move task" caption="Send Icon audit to another project" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title="Move Icon audit" subtitle="Currently in Harbour rebrand" actions={[<Button key="c" variant="secondary">Cancel</Button>, <Button key="m">Move task</Button>]}>
          <Stack gap="xs">
            <Text size="xs" color="secondary">New project</Text>
            <TreeSelect data={DATA} defaultValue="signage" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
