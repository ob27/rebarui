"use client";

import { useState } from "react";
import { Box, Heading, Stack, Text, WorkspaceSwitcher } from "rebar-ui";
import type { WorkspaceSwitcherItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const WORKSPACES: WorkspaceSwitcherItem[] = [
  { id: "acme", name: "Acme Corp" },
  { id: "globex", name: "Globex Inc" },
  { id: "initech", name: "Initech" },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<WorkspaceSwitcher\n  workspaces={[{ id: "acme", name: "Acme Corp" }, { id: "globex", name: "Globex Inc" }]}\n  activeId={activeId}\n  onSelect={setActiveId}\n  onCreateNew={() => openCreateModal()}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["WorkspaceSwitcher"] ?? [] },
  {
    type: "doc-section",
    heading: "Page-level governance, not a form control",
    body: [
      {
        kind: "text",
        text: "The Slack/Notion/Linear header pattern — which org/workspace/tenant context the whole app is currently in, the same macro/page-level role `NavBar`/`SidebarNav` already play for navigation, just for tenant context instead of pages. Built on the real `Dropdown` (Radix underneath, correct focus/keyboard handling for free), not a hand-rolled popover.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="workspace-switcher"` on the trigger button.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated workspace-switcher component; a migration typically composes AntD's own `Dropdown` + `Avatar` to the same shape.",
      },
    ],
  },
];

export default function WorkspaceSwitcherPage() {
  const [activeId, setActiveId] = useState("acme");

  return (
    <Stack gap="lg">
      <Heading level={1}>WorkspaceSwitcher</Heading>
      <Text color="secondary">
        An org/workspace switcher for the header — pick one below, and watch the trigger update.
      </Text>

      <Box style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, padding: "var(--rebar-space-lg)" }}>
        <WorkspaceSwitcher
          workspaces={WORKSPACES}
          activeId={activeId}
          onSelect={setActiveId}
          onCreateNew={() => window.alert("Open your own create-workspace flow here.")}
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
