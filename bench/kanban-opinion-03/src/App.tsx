import { useState } from "react";
import { Avatar, Card, Input, Kanban, Stack, Text } from "rebar-ui";
import type { KanbanCard, KanbanCardRenderContext, KanbanColumn } from "rebar-ui";

// Kanban's own KanbanCard has no assignee field -- extend it locally. The extra field survives
// every Kanban-internal mutation untouched (drag/reorder only ever touch column cardIds arrays;
// only a freshly-added card via "+ Add card" is missing it, which is fine -- new cards start
// unassigned).
interface SprintCard extends KanbanCard {
  assignee?: string;
}

const INITIAL_CARDS: Record<string, SprintCard> = {
  "todo-1": {
    id: "todo-1",
    title: "Design empty states",
    description: "Cover board, column, and search-with-no-results cases",
    assignee: "M",
  },
  "todo-2": {
    id: "todo-2",
    title: "Write onboarding copy",
    assignee: "J",
  },
  "inprog-1": {
    id: "inprog-1",
    title: "Refactor auth flow",
    description: "Blocked on the identity team's token change",
    tags: ["Blocked"],
    assignee: "R",
  },
  "inprog-2": {
    id: "inprog-2",
    title: "Fix flaky CI test",
    assignee: "K",
  },
  "done-1": {
    id: "done-1",
    title: "Update dependencies",
    description: "React, Vite, and the theme package all bumped",
    assignee: "T",
  },
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-section", cardIds: ["todo-1", "todo-2"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    limit: 4,
    sections: [{ id: "in-progress-section", cardIds: ["inprog-1", "inprog-2"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-section", cardIds: ["done-1"] }],
  },
];

function statusTone(tag: string): "error" | "warning" | "default" {
  if (tag === "Blocked") return "error";
  if (tag === "Review") return "warning";
  return "default";
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [cards, setCards] = useState<Record<string, SprintCard>>(INITIAL_CARDS);
  const [search, setSearch] = useState("");

  return (
    <Stack gap="lg" style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="xs">
        <Text as="h1" size="md" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
          Sprint Board
        </Text>
        <Input
          aria-label="Search cards"
          placeholder="Search cards by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </Stack>

      <Kanban
        columns={columns}
        cards={cards}
        search={search}
        onChange={(next) => {
          setColumns(next.columns);
          setCards(next.cards as Record<string, SprintCard>);
        }}
        renderColumnTitle={(column) => {
          const count = column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
          return (
            <Text style={{ fontWeight: 600 }}>
              {column.title}
              {column.limit === undefined ? ` (${count})` : ""}
            </Text>
          );
        }}
        renderCard={(card: KanbanCard, ctx: KanbanCardRenderContext) => {
          const sprintCard = card as SprintCard;
          const tag = sprintCard.tags?.[0];
          return (
            <Card
              data-rebar-part="card"
              title={sprintCard.title}
              avatar={
                sprintCard.assignee ? (
                  <Avatar fallback={sprintCard.assignee} size="sm" />
                ) : undefined
              }
              labels={tag ? [{ label: tag, tone: statusTone(tag) }] : undefined}
              {...ctx.dragHandlers}
              {...ctx.touchHandlers}
            >
              {sprintCard.description}
            </Card>
          );
        }}
      />
    </Stack>
  );
}
