"use client";

import { useState } from "react";
import { Avatar, AvatarGroup, Button, Card, DeviceFrame, Heading, Kanban, MobileTabBar, SegmentedControl, Stack, Tag, Text } from "rebar-ui";
import type { KanbanCard, KanbanState } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, avatarOf, avatarsOf, kanbanBoard, person, project } from "@/fixtures/tideline";

const CODE = `const [board, setBoard] = useState(kanbanBoard());

<Kanban columns={board.columns} cards={board.cards} onChange={setBoard} />`;

/** The Tideline tasks as a board, each card carrying its owner's initials and a WIP limit of 3 on "In progress". */
function projectBoard(): KanbanState {
  const { columns, cards } = kanbanBoard();
  for (const t of TASKS) cards[t.id] = { ...cards[t.id], assignee: person(t.assignee).initials, tags: t.due ? [t.tag, `Due ${t.due}`] : [t.tag] };
  return { columns: columns.map((c) => (c.id === "doing" ? { ...c, limit: 3 } : c)), cards };
}

const sync: KanbanCard = { id: "sync", title: "Offline sync for tasks", tags: ["Eng", "Due 26 Oct"], assignee: "JW" };
const home: KanbanCard = { id: "home", title: "Harbour homepage", tags: ["Design"], assignee: "MC" };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Kanban"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Cards and columns drag with the mouse (native HTML5 drag and drop) and with touch (a long-press lifts a card). There is no keyboard-operable move yet; a documented gap. Each card title is a real `Editable`, so renaming works from the keyboard.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="kanban"`; each column, section and card carries `data-rebar-part="column"`, `"section"` or `"card"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD has no board component; a migration reimplements the board on top of a drag-and-drop library of the consuming team's choice.",
      },
    ],
  },
];

function PhoneBoard() {
  const harbour = project("harbour");
  const doing = TASKS.filter((t) => t.column === "doing");
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 520, background: "var(--rebar-color-bg-primary)" }}>
      <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
        <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
          {harbour.name}
        </Heading>
      </div>
      <Stack gap="sm" style={{ padding: 14, flex: 1 }}>
        <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
          <Tag>To do 3</Tag>
          <Tag tone="info">In progress 2</Tag>
          <Tag>Done</Tag>
        </Stack>
        {doing.map((t) => (
          <Card key={t.id} title={t.title} labels={[{ label: t.tag }]} avatar={<Avatar size="sm" {...avatarOf(t.assignee)} />} />
        ))}
      </Stack>
      <MobileTabBar
        aria-label="Tideline"
        style={{ position: "static" }}
        items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]}
        defaultActiveIndex={1}
      />
    </div>
  );
}

export default function KanbanPage() {
  const [board, setBoard] = useState<KanbanState>(projectBoard);
  const [scene, setScene] = useState<KanbanState>(projectBoard);
  const [wip, setWip] = useState<KanbanState>({
    columns: [{ id: "doing", title: "In progress", limit: 2, sections: [{ id: "doing-main", cardIds: ["sync", "home"] }] }],
    cards: { sync, home },
  });
  const harbour = project("harbour");

  return (
    <Stack gap="lg">
      <Heading level={1}>Kanban</Heading>
      <Text color="secondary">Columns, cards, drag.</Text>

      <DemoStage
        title="Project board"
        caption="Drag, drop, touch; WIP limit on In progress"
        code={CODE}
        states={[
          {
            label: "Empty column",
            node: <Kanban columns={[{ id: "blocked", title: "Blocked", sections: [{ id: "blocked-main", cardIds: [] }] }]} cards={{}} />,
          },
          { label: "At WIP limit", node: <Kanban columns={wip.columns} cards={wip.cards} onChange={setWip} /> },
        ]}
      >
        <Kanban columns={board.columns} cards={board.cards} onChange={setBoard} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project screen" caption="The board inside a project page, and the same board on a phone">
        <Stack gap="lg">
          <Card>
            <Stack gap="md">
              <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
                <Heading level={3}>{harbour.name}</Heading>
                <Text size="sm" color="secondary">
                  9 of 14 done · launch {harbour.due}
                </Text>
              </Stack>
              <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
                <SegmentedControl
                  aria-label="View"
                  options={[
                    { value: "board", label: "Board" },
                    { value: "list", label: "List" },
                  ]}
                  defaultValue="board"
                />
                <span style={{ flex: 1 }} />
                <AvatarGroup avatars={avatarsOf(["maya", "jonas", "priya", "leo"])} size="sm" />
                <Tag>Design</Tag>
                <Tag>Ops</Tag>
                <Button variant="secondary" size="sm">
                  Filter
                </Button>
                <Button size="sm">Add task</Button>
              </Stack>
              <Kanban columns={scene.columns} cards={scene.cards} onChange={setScene} />
            </Stack>
          </Card>
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
            <DeviceFrame variant="phone" style={{ maxWidth: 320 }}>
              <PhoneBoard />
            </DeviceFrame>
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
