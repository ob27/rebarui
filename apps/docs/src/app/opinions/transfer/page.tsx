"use client";

import { useState } from "react";
import { Button, Card, Heading, Stack, Text, Transfer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, project } from "@/fixtures/tideline";

const CODE = "const [selected, setSelected] = useState<string[]>([]);\n\n<Transfer\n  items={items}\n  value={selected}\n  onValueChange={setSelected}\n  sourceTitle=\"Available\"\n  targetTitle=\"Reviewers\"\n/>";

const ITEMS = PEOPLE.map((p) => ({ key: p.id, label: `${p.name}, ${p.role}` }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Transfer"] ?? [] },
  {
    type: "doc-section",
    heading: "State",
    body: [{ kind: "text", text: "`value` says which side each item lives on. The component only keeps which rows are ticked in each list, cleared after a move." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"transfer\"`; `data-rebar-part=\"source-panel\"|\"target-panel\"|\"actions\"|\"move-to-target\"|\"move-to-source\"|\"panel-header\"|\"panel-list\"|\"panel-row\"|\"panel-empty\"`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Transfer` is a close equivalent: `items`, `value`, `onValueChange` map to `dataSource`, `targetKeys`, `onChange`; `sourceTitle`/`targetTitle` map to `titles`." }],
  },
];

export default function TransferPage() {
  const [selected, setSelected] = useState<string[]>(["priya"]);
  const [access, setAccess] = useState<string[]>(["maya", "jonas"]);
  return (
    <Stack gap="lg">
      <Heading level={1}>Transfer</Heading>
      <Text color="secondary">Two lists with arrows between them: check items, move them across.</Text>

      <DemoStage title="Reviewers" caption="Check people on one side and move them across" code={CODE} widths={false}
        states={[
          { label: "Nothing chosen, long labels", node: <Transfer items={[{ key: "a", label: "Fatima Khan, Dispatcher, Northern depot night shift" }, { key: "b", label: "Gareth Pryce, Crane operator, Quay 4" }]} value={[]} sourceTitle="Crew" targetTitle="Interview now" /> },
        ]}>
        <Transfer items={ITEMS} value={selected} onValueChange={setSelected} sourceTitle="Available" targetTitle="Reviewers" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Share a project" caption="Choose who can open Harbour rebrand" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title={`Share ${project("harbour").name}`} subtitle="Four people on the team" actions={[<Button key="c" variant="secondary">Cancel</Button>, <Button key="s">Update access</Button>]}>
          <Transfer items={ITEMS} value={access} onValueChange={setAccess} sourceTitle="Team" targetTitle="Has access" />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
