"use client";

import { useState } from "react";
import { Badge, Button, Card, CommandPalette, Heading, Kbd, Stack, Text } from "rebar-ui";
import type { CommandPaletteCommand } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, PROJECTS, TASKS } from "@/fixtures/tideline";

const CODE = `const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>Jump to… <Kbd>⌘K</Kbd></Button>
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  placeholder="Projects, tasks, people"
  commands={[
    ...PROJECTS.map((p) => ({ id: p.id, label: p.name, group: "Projects", onSelect: () => go(p) })),
    ...TASKS.map((t) => ({ id: t.id, label: t.title, group: "Tasks", onSelect: () => go(t) })),
    { id: "new", label: "New task", group: "Actions", shortcut: "N", onSelect: newTask },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["CommandPalette"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Built on Radix Dialog (focus trap, Esc to close, backdrop click). The search input drives keyboard navigation through `aria-activedescendant` rather than moving focus between rows: ArrowUp and ArrowDown move, Enter runs the highlighted command. No global shortcut is registered for you; bind ⌘K in the app.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="command-palette"`; `data-rebar-part="overlay"|"search-input"|"list"|"group-label"|"item"`, with `data-rebar-active` on the highlighted item.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no command palette. A migration composes `Modal` with `AutoComplete`, or reaches for a small library such as `cmdk`." }],
  },
];

export default function CommandPalettePage() {
  const [open, setOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [fewOpen, setFewOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const commands: CommandPaletteCommand[] = [
    ...PROJECTS.map((p) => ({ id: p.id, label: p.name, group: "Projects", onSelect: () => setPicked(p.name) })),
    ...TASKS.slice(0, 4).map((t) => ({ id: t.id, label: t.title, group: "Tasks", onSelect: () => setPicked(t.title) })),
    ...PEOPLE.map((p) => ({ id: p.id, label: p.name, group: "People", onSelect: () => setPicked(p.name) })),
    { id: "new-task", label: "New task", group: "Actions", shortcut: "N", onSelect: () => setPicked("New task") },
    { id: "theme", label: "Toggle theme", group: "Actions", shortcut: "T", onSelect: () => setPicked("Toggle theme") },
  ];

  return (
    <Stack gap="lg">
      <Heading level={1}>CommandPalette</Heading>
      <Text color="secondary">Search every action and project from one box.</Text>

      <DemoStage
        title="Palette"
        caption="Substring match, grouped results, arrows and Enter"
        code={CODE}
        states={[
          {
            label: "Few commands",
            node: (
              <>
                <Button variant="secondary" size="sm" onClick={() => setFewOpen(true)}>
                  Open
                </Button>
                <CommandPalette open={fewOpen} onOpenChange={setFewOpen} placeholder="Type a command" commands={commands.filter((c) => c.group === "Actions")} />
              </>
            ),
          },
          {
            label: "Picked",
            node: (
              <Text size="sm" color="secondary">
                {picked ? `Last pick: ${picked}` : "Nothing picked yet"}
              </Text>
            ),
          },
        ]}
      >
        <div className="cs-grain" style={{ padding: "48px 16px", display: "flex", justifyContent: "center" }}>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Jump to… <Kbd>⌘K</Kbd>
          </Button>
          <CommandPalette open={open} onOpenChange={setOpen} placeholder="Projects, tasks, people" commands={commands} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects header" caption="The palette behind a search button" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
            <Heading level={3}>Projects</Heading>
            <Badge count={PROJECTS.length} />
            <span style={{ flex: 1 }} />
            <Button variant="secondary" size="sm" onClick={() => setSceneOpen(true)}>
              Jump to… <Kbd>⌘K</Kbd>
            </Button>
            <Button size="sm">New</Button>
          </Stack>
          <CommandPalette open={sceneOpen} onOpenChange={setSceneOpen} placeholder="Jump to a project or task" commands={commands.filter((c) => c.group !== "People")} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
