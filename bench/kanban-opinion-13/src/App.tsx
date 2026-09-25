import { useState } from "react";
import {
  Avatar,
  Card,
  Input,
  Kanban,
  Text,
} from "rebar-ui";
import type { KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";

// Kanban's own `KanbanCard` is the minimal shape it round-trips through onChange (id/title/
// description/tags/color). The board's cards also need a lifecycle-status tag and an assignee
// initial that shouldn't be lumped in with free-form `tags`, so this extends it with two optional
// fields of our own -- optional because a card added via Kanban's built-in "+ Add card" control
// (which only ever knows `id`/`title`) won't have either yet.
interface SprintCard extends KanbanCard {
  status?: "Blocked" | "Review";
  assignee?: string;
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "main", cardIds: ["todo-1", "todo-2"] }] },
  {
    id: "in-progress",
    title: "In Progress",
    limit: 4,
    sections: [{ id: "main", cardIds: ["inprog-1", "inprog-2"] }],
  },
  { id: "done", title: "Done", sections: [{ id: "main", cardIds: ["done-1"] }] },
];

const INITIAL_CARDS: Record<string, SprintCard> = {
  "todo-1": {
    id: "todo-1",
    title: "Design empty states",
    description: "Cover zero-data and error variants",
    assignee: "J",
  },
  "todo-2": {
    id: "todo-2",
    title: "Write onboarding copy",
    assignee: "K",
  },
  "inprog-1": {
    id: "inprog-1",
    title: "Wire up auth flow",
    description: "Waiting on SSO credentials from IT",
    status: "Blocked",
    assignee: "R",
  },
  "inprog-2": {
    id: "inprog-2",
    title: "Refactor API client",
    assignee: "M",
  },
  "done-1": {
    id: "done-1",
    title: "Set up CI pipeline",
    assignee: "T",
  },
};

function columnCardCount(column: KanbanColumn): number {
  return column.sections.reduce((sum, section) => sum + section.cardIds.length, 0);
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [cards, setCards] = useState<Record<string, SprintCard>>(INITIAL_CARDS);
  const [search, setSearch] = useState("");

  const handleChange = (next: KanbanState) => {
    setColumns(next.columns);
    // Kanban's own state is authoritative for shape (drag/reorder/add all flow through here) --
    // cast back to our extended card type since every card it hands back originated either from
    // our own `cards` map (already a SprintCard) or from its own bare `{ id, title }` add-card
    // literal (a valid SprintCard with both optional fields simply absent).
    setCards(next.cards as Record<string, SprintCard>);
  };

  return (
    <div className="rebar-box" style={{ padding: "var(--rebar-space-lg, 24px)", maxWidth: 1100, margin: "0 auto" }}>
      <Text as="h1" size="md" style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)", marginBottom: 4 }}>
        Sprint Board
      </Text>
      <div style={{ maxWidth: 320, marginBottom: "var(--rebar-space-md, 16px)" }}>
        <Input
          aria-label="Search cards"
          placeholder="Search cards…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Kanban
        columns={columns}
        cards={cards}
        onChange={handleChange}
        search={search}
        renderColumnTitle={(column) => {
          // Every column shows its title plus a card count. A column with its own `limit` (only
          // "In Progress" here) already gets a built-in "n/limit" badge rendered right next to
          // this title by Kanban itself -- adding a second, plain count here for that column
          // would just duplicate it, so only the uncapped columns get one of their own.
          const total = columnCardCount(column);
          return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{column.title}</Text>
              {column.limit === undefined ? (
                <Text size="xs" color="secondary">
                  {total}
                </Text>
              ) : null}
            </span>
          );
        }}
        renderCard={(card, ctx) => {
          const sprintCard = card as SprintCard;
          return (
            <Card
              data-rebar-part="card"
              title={sprintCard.title}
              titleLines={2}
              labels={
                sprintCard.status
                  ? [{ label: sprintCard.status, tone: sprintCard.status === "Blocked" ? "error" : "warning" }]
                  : undefined
              }
              footer={<Avatar size="sm" fallback={sprintCard.assignee ?? "?"} />}
              draggable={ctx.dragHandlers.draggable}
              onDragStart={ctx.dragHandlers.onDragStart}
              onDragEnd={ctx.dragHandlers.onDragEnd}
              onDragOver={ctx.dragHandlers.onDragOver}
              onDrop={ctx.dragHandlers.onDrop}
              onTouchStart={ctx.touchHandlers.onTouchStart}
              onTouchMove={ctx.touchHandlers.onTouchMove}
              onTouchEnd={ctx.touchHandlers.onTouchEnd}
              onTouchCancel={ctx.touchHandlers.onTouchCancel}
            >
              {sprintCard.description}
            </Card>
          );
        }}
      />
    </div>
  );
}
