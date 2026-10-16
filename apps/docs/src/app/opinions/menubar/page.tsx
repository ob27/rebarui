"use client";

import { useState } from "react";
import { Card, Heading, Menubar, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE } from "@/fixtures/tideline";

const CODE = `<Menubar
  items={[
    { label: "File", items: [{ key: "new", label: "New project", onSelect: newProject }, { key: "export", label: "Export rota", onSelect: exportRota }] },
    { label: "Edit", items: [{ key: "copy", label: "Copy link", onSelect: copyLink }] },
    { label: "View", items: [{ key: "board", label: "Board", onSelect: showBoard }] },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Menubar"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="menubar"`, `role="menubar"` on the root; each trigger carries `data-rebar-part="trigger"`, each open menu `data-rebar-part="menu"`, with items/separators matching Dropdown\'s own convention.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD has no direct `Menubar` primitive of its own — its closest analog is a `Menu mode=\"horizontal\"` with nested `SubMenu`s, which a migration would restructure `items` into.",
      },
    ],
  },
];


export default function MenubarPage() {
  const [last, setLast] = useState("nothing yet");
  const pick = (what: string) => () => setLast(what);
  const items = [
    {
      label: "File",
      items: [
        { key: "new", label: "New project", onSelect: pick("New project") },
        { key: "open", label: "Open recent", onSelect: pick("Open recent") },
        { key: "export", label: "Export rota", onSelect: pick("Export rota") },
        { key: "sep-1", separator: true },
        { key: "archive", label: "Archive project", disabled: true, onSelect: pick("Archive") },
      ],
    },
    {
      label: "Edit",
      items: [
        { key: "copy", label: "Copy link", onSelect: pick("Copy link") },
        { key: "rename", label: "Rename", onSelect: pick("Rename") },
      ],
    },
    {
      label: "View",
      items: [
        { key: "board", label: "Board", onSelect: pick("Board") },
        { key: "list", label: "List", onSelect: pick("List") },
      ],
    },
  ];

  return (
    <Stack gap="lg">
      <Heading level={1}>Menubar</Heading>
      <Text color="secondary">A row of File, Edit and View style menus, like a desktop app.</Text>

      <DemoStage
        title="Tideline menus"
        caption={`Last choice: ${last}`}
        code={CODE}
        states={[
          { label: "One menu", node: <Menubar items={[items[0]!]} /> },
          { label: "Long labels", node: <Menubar items={[{ label: "Harbour rebrand", items: [{ key: "a", label: "Share with the harbour trust", onSelect: pick("Share") }] }, { label: "Depot signage", items: [{ key: "b", label: "Send fascia proofs to Northern Print Co.", onSelect: pick("Send") }] }]} /> },
        ]}
      >
        <Menubar items={items} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Desktop window" caption="The menu bar above the project list" widths={false}>
        <div style={{ maxWidth: 560, margin: "0 auto", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius-lg)", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid var(--rebar-color-border)", padding: "2px 6px" }}>
            <Menubar items={items} />
          </div>
          <Stack gap="xs" style={{ padding: 14 }}>
            {PROJECTS.slice(0, 4).map((p) => (
              <Card key={p.id} title={p.name} subtitle={`${p.kicker}, due ${p.due}`} extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} />
            ))}
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
