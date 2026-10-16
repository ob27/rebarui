"use client";

import { useState } from "react";
import { Card, Heading, Input, SlashCommandMenu, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS } from "@/fixtures/tideline";

const COMMANDS = [
  { key: "text", label: "Text", description: "Plain paragraph", category: "Basic blocks", onSelect: () => {} },
  { key: "heading", label: "Heading", description: "A section heading", category: "Basic blocks", onSelect: () => {} },
  { key: "task", label: "Task", description: "A checkbox with an assignee", category: "Basic blocks", onSelect: () => {} },
  { key: "project", label: "Project link", description: "Link to a Tideline project", category: "Embeds", onSelect: () => {} },
  { key: "file", label: "File", description: "Attach from the shared folder", category: "Embeds", onSelect: () => {} },
  { key: "date", label: "Date", description: "Insert 24 Oct", category: "Embeds", onSelect: () => {} },
];

const CODE = `<SlashCommandMenu
  commands={[{ key: "task", label: "Task", description: "A checkbox with an assignee", category: "Basic blocks", onSelect: addTask }]}
  query={query}
  onClose={() => setQuery("")}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SlashCommandMenu"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="slash-command-menu"`; parts include `category-heading` and `command`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no inline slash-command primitive; compose `Dropdown`/`Menu` positioned at the caret manually.",
      },
    ],
  },
];

export default function SlashCommandMenuPage() {
  const [query, setQuery] = useState("");
  return (
    <Stack gap="lg">
      <Heading level={1}>SlashCommandMenu</Heading>
      <Text color="secondary">A slash menu of commands grouped by category, filtered as you type.</Text>

      <DemoStage
        title="Block menu"
        caption="Type to filter; Enter picks the highlighted command"
        code={CODE}
        widths={false}
        states={[
          { label: "Filtered", node: <SlashCommandMenu commands={COMMANDS} query="ta" onClose={() => {}} /> },
          { label: "No match", node: <SlashCommandMenu commands={COMMANDS} query="zzz" onClose={() => {}} /> },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 320 }}>
          <Input placeholder="Type to filter…" aria-label="Filter commands" value={query} onChange={(e) => setQuery(e.target.value)} />
          <SlashCommandMenu commands={COMMANDS} query={query} onClose={() => setQuery("")} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Meeting notes" caption="Typing a slash at the end of a line" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title={`${EVENTS[1].title} notes`} subtitle={`${EVENTS[1].date}, ${EVENTS[1].time}`}>
          <Stack gap="sm">
            <Text size="sm">Offline sync is in review. Jonas to confirm the crew can finish a shift without signal.</Text>
            <Text size="sm">/ta</Text>
            <SlashCommandMenu commands={COMMANDS} query="ta" onClose={() => {}} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
