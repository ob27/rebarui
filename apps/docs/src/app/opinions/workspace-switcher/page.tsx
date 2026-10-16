"use client";

import { useState } from "react";
import { Avatar, Card, Heading, Stack, Tag, Text, WorkspaceSwitcher } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import type { WorkspaceSwitcherItem } from "rebar-ui";
import { PROJECTS, STATUS_TONE, avatarOf } from "@/fixtures/tideline";

const CODE = "<WorkspaceSwitcher\n  workspaces={[{ id: \"studio\", name: \"Tideline Studio\" }, { id: \"harbour\", name: \"Harbour Trust\" }]}\n  activeId={activeId}\n  onSelect={setActiveId}\n  onCreateNew={() => openCreateModal()}\n/>";

const WORKSPACES: WorkspaceSwitcherItem[] = [
  { id: "studio", name: "Tideline Studio" },
  { id: "harbour", name: "Harbour Trust" },
  { id: "depots", name: "Northern Depots" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["WorkspaceSwitcher"] ?? [] },
  {
    type: "doc-section",
    heading: "Built on Dropdown",
    body: [{ kind: "text", text: "The Slack, Notion and Linear header pattern, built on the real `Dropdown` for focus and keyboard handling. Omit `onCreateNew` to hide the create row." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"workspace-switcher\"` on the trigger button." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Dropdown` and `Avatar` to the same shape." }],
  },
];

export default function WorkspaceSwitcherPage() {
  const [activeId, setActiveId] = useState("studio");
  const [ctx, setCtx] = useState("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>WorkspaceSwitcher</Heading>
      <Text color="secondary">A header dropdown for switching between workspaces, with a create option.</Text>

      <DemoStage title="Header switcher" caption="Pick a workspace and the trigger follows" code={CODE} widths={false}
        states={[
          { label: "One workspace", node: <WorkspaceSwitcher workspaces={WORKSPACES.slice(0, 1)} activeId="studio" onSelect={() => {}} /> },
          { label: "Without create", node: <WorkspaceSwitcher workspaces={WORKSPACES} activeId="harbour" onSelect={() => {}} /> },
          { label: "Long name", node: <WorkspaceSwitcher workspaces={[{ id: "l", name: "Northern Depots Operations and Signage Group" }]} activeId="l" onSelect={() => {}} /> },
        ]}>
        <div style={{ maxWidth: 320 }}>
          <WorkspaceSwitcher workspaces={WORKSPACES} activeId={activeId} onSelect={setActiveId} onCreateNew={() => {}} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Sidebar" caption="The switcher heads the app's sidebar" widths={false}>
        <Card style={{ maxWidth: 300, margin: "0 auto" }}>
          <Stack gap="md">
            <WorkspaceSwitcher workspaces={WORKSPACES} activeId={ctx} onSelect={setCtx} onCreateNew={() => {}} />
            <Stack gap="sm">
              {PROJECTS.slice(0, 4).map((p) => (
                <Stack key={p.id} direction="row" gap="sm" align="center" justify="between">
                  <Stack direction="row" gap="sm" align="center"><Avatar size="sm" {...avatarOf(p.owner)} /><Text size="sm">{p.name}</Text></Stack>
                  <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
