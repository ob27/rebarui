"use client";

import { useState } from "react";
import { Button, Card, Dropdown, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, STATUS_TONE, person, project } from "@/fixtures/tideline";

const SORTS = ["Due date", "Priority", "Owner", "Recently updated"];

const CODE = `<Dropdown
  trigger={<Button variant="secondary">Sort: {sort}</Button>}
  items={SORTS.map((s) => ({ key: s, label: s, onSelect: () => setSort(s) }))}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Dropdown"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A Radix dropdown menu: the trigger carries `aria-haspopup="menu"` and `aria-expanded`; the list is a `role="menu"` of `role="menuitem"`s. Arrow keys move, typing jumps to a match, Enter or Space picks, Esc closes and returns focus to the trigger.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="dropdown"` on the content; `data-rebar-part="item"` per row, `data-rebar-danger` on destructive items.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Dropdown` takes a `menu={{ items }}` shape with similar per-item fields: a close, low-risk rename." }],
  },
];

export default function DropdownPage() {
  const [sort, setSort] = useState(SORTS[0]);
  const [last, setLast] = useState<string | null>(null);
  const rota = project("rota");
  const rotaFile = FILES.find((f) => f.project === "rota") ?? FILES[0];

  return (
    <Stack gap="lg">
      <Heading level={1}>Dropdown</Heading>
      <Text color="secondary">A button that opens a list of actions.</Text>

      <DemoStage
        title="Sort menu"
        caption="Typeahead, arrows, Esc"
        code={CODE}
        states={[
          {
            label: "Actions",
            node: (
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm">
                    Actions
                  </Button>
                }
                items={[
                  { key: "rename", label: "Rename" },
                  { key: "duplicate", label: "Duplicate" },
                ]}
              />
            ),
          },
          {
            label: "Danger item",
            node: (
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm">
                    Project
                  </Button>
                }
                items={[
                  { key: "rename", label: "Rename" },
                  { key: "archive", label: "Archive", danger: true },
                ]}
              />
            ),
          },
          {
            label: "Disabled item",
            node: (
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm">
                    Export
                  </Button>
                }
                items={[
                  { key: "csv", label: "Export as CSV" },
                  { key: "pdf", label: "Export as PDF (soon)", disabled: true },
                ]}
              />
            ),
          },
          {
            label: "Disabled trigger",
            node: (
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm" disabled>
                    Actions
                  </Button>
                }
                items={[{ key: "rename", label: "Rename" }]}
              />
            ),
          },
        ]}
      >
        <Stack gap="sm" align="center">
          <Dropdown trigger={<Button variant="secondary">Sort: {sort}</Button>} items={SORTS.map((s) => ({ key: s, label: s, onSelect: () => setSort(s) }))} />
          <Text size="sm" color="secondary">
            Tasks sorted by {sort.toLowerCase()}
          </Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Card actions" caption="An overflow menu in a card header" widths={false}>
        <Card
          style={{ maxWidth: 480, margin: "0 auto" }}
          title={rota.name}
          extra={
            <Stack direction="row" gap="sm" align="center">
              <Tag tone={STATUS_TONE[rota.status]}>{rota.status}</Tag>
              <Dropdown
                trigger={
                  <Button variant="secondary" size="sm" aria-label="More actions">
                    ···
                  </Button>
                }
                items={[
                  { key: "csv", label: "Export as CSV", onSelect: () => setLast("Exported as CSV") },
                  { key: "pdf", label: "Export as PDF", onSelect: () => setLast("Exported as PDF") },
                  { key: "payroll", label: "Send to payroll", onSelect: () => setLast("Sent to payroll") },
                  { key: "delete", label: "Delete export", danger: true, onSelect: () => setLast("Deleted") },
                ]}
              />
            </Stack>
          }
        >
          <Stack gap="xs">
            <Text size="sm" color="secondary">
              {rota.summary} Owner {person(rota.owner).name}, done {rota.due}.
            </Text>
            <Text size="sm">
              {rotaFile.name} · {rotaFile.size}
            </Text>
            {last ? (
              <Text size="sm" style={{ color: "var(--rebar-color-success)" }}>
                {last}
              </Text>
            ) : null}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
