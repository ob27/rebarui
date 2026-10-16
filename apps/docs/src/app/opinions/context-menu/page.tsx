"use client";

import { Card, ContextMenu, Heading, Stack, Tag, Text } from "rebar-ui";
import type { ContextMenuItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const CODE = `<ContextMenu
  items={[
    { key: "open", label: "Open", onSelect: () => {} },
    { key: "rename", label: "Rename", onSelect: () => {} },
    { key: "sep", separator: true },
    { key: "delete", label: "Delete", danger: true, onSelect: () => {} },
  ]}
>
  <Card>depot-fascia-final.pdf</Card>
</ContextMenu>`;

const FILE_ITEMS: ContextMenuItem[] = [
  { key: "open", label: "Open", onSelect: () => {} },
  { key: "rename", label: "Rename", onSelect: () => {} },
  { key: "download", label: "Download", onSelect: () => {} },
  { key: "sep", separator: true },
  { key: "delete", label: "Delete", danger: true, onSelect: () => {} },
];
const READONLY_ITEMS: ContextMenuItem[] = [
  { key: "open", label: "Open", onSelect: () => {} },
  { key: "rename", label: "Rename", disabled: true, onSelect: () => {} },
  { key: "delete", label: "Delete", disabled: true, danger: true, onSelect: () => {} },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ContextMenu"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="context-menu"` on the wrapper; the menu carries `data-rebar-part="menu" | "item" | "separator"`, plus `data-rebar-danger` on destructive items.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no dedicated context-menu component of its own; its `Dropdown` supports a `trigger={[\"contextMenu\"]}` mode that's the closest direct equivalent on migration.",
      },
    ],
  },
];

export default function ContextMenuPage() {
  const [fascia, ...rest] = FILES;
  return (
    <Stack gap="lg">
      <Heading level={1}>ContextMenu</Heading>
      <Text color="secondary">A menu that opens at the cursor on right-click, or on a long press on touch.</Text>

      <DemoStage
        title="File tile"
        caption="Right-click or long-press the tile"
        code={CODE}
        widths={false}
        states={[
          {
            label: "With disabled items",
            node: (
              <ContextMenu items={READONLY_ITEMS}>
                <Card style={{ padding: 16 }}><Text size="sm">{rest[3].name} (read-only)</Text></Card>
              </ContextMenu>
            ),
          },
          {
            label: "One item",
            node: (
              <ContextMenu items={[FILE_ITEMS[0]]}>
                <Card style={{ padding: 16 }}><Text size="sm">{rest[0].name}</Text></Card>
              </ContextMenu>
            ),
          },
        ]}
      >
        <ContextMenu items={FILE_ITEMS}>
          <Card style={{ padding: 32, textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
            <Stack gap="xs" align="center">
              <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{fascia.name}</Text>
              <Text size="sm" color="secondary">{fascia.size} · {project(fascia.project).name}</Text>
            </Stack>
          </Card>
        </ContextMenu>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project files" caption="Every row carries its own menu" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto", padding: 0 }}>
          <Stack gap="xs" style={{ gap: 0 }}>
            {FILES.map((f) => (
              <ContextMenu key={f.id} items={FILE_ITEMS}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", boxShadow: "0 1px 0 var(--rebar-color-border)" }}>
                  <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 8, background: "var(--rebar-color-tint-3)", flex: "none" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>{f.name}</Text>
                    <Text size="xs" color="secondary">{f.size}</Text>
                  </span>
                  <Tag>{project(f.project).name}</Tag>
                </div>
              </ContextMenu>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
