// Sprint Board — built directly on top of rebar-ui's own `Kanban` component (Opinion tier).
// Kanban already owns drag-and-drop (mouse + touch), reordering, search visibility, filterCard
// composition, and column/section cap enforcement for both drop and add-card — none of that is
// reimplemented here. This file only supplies: seed data, the search input, and two customization
// points (`renderCard`, `renderColumnTitle`) to get the card face and plain-column count this
// board's spec wants beyond Kanban's own defaults.
import { useState } from "react";
import { Avatar, Box, Input, Kanban, Stack, Tag, Text } from "rebar-ui";
import type { KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";

// Kanban's own `KanbanCard` only carries id/title/description/tags/color. This board also needs a
// single-letter assignee — an extra field layered on top, not something Kanban itself has to know
// about. `tags[0]` (when present) doubles as the lifecycle-status tag ("Blocked"/"Review"): a
// freeform `tags` array is exactly what Kanban's own built-in edit dialog already edits, so no
// separate schema is needed for that part.
interface SprintCard extends KanbanCard {
  assignee?: string;
}

type SprintCards = Record<string, SprintCard>;

const IN_PROGRESS_LIMIT = 4;

function seedColumns(): KanbanColumn[] {
  return [
    { id: "todo", title: "To Do", sections: [{ id: "todo-section", cardIds: ["card-1", "card-2"] }] },
    {
      id: "in-progress",
      title: "In Progress",
      sections: [{ id: "in-progress-section", cardIds: ["card-3", "card-4"] }],
      limit: IN_PROGRESS_LIMIT,
    },
    { id: "done", title: "Done", sections: [{ id: "done-section", cardIds: ["card-5"] }] },
  ];
}

function seedCards(): SprintCards {
  return {
    "card-1": {
      id: "card-1",
      title: "Write onboarding checklist",
      description: "Draft the first-week steps for new hires.",
      assignee: "M",
    },
    "card-2": {
      id: "card-2",
      title: "Audit sidebar nav links",
      assignee: "R",
    },
    "card-3": {
      id: "card-3",
      title: "Migrate auth service",
      description: "Blocked on infra team's cert rotation.",
      tags: ["Blocked"],
      assignee: "J",
    },
    "card-4": {
      id: "card-4",
      title: "Polish empty states",
      description: "Ready for a second pass.",
      tags: ["Review"],
      assignee: "K",
    },
    "card-5": {
      id: "card-5",
      title: "Set up CI pipeline",
      assignee: "M",
    },
  };
}

function statusTone(status: string): "error" | "warning" | "default" {
  if (status === "Blocked") return "error";
  if (status === "Review") return "warning";
  return "default";
}

function columnTotal(column: KanbanColumn): number {
  return column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
}

export default function App() {
  const [board, setBoard] = useState<KanbanState>(() => ({ columns: seedColumns(), cards: seedCards() }));
  const [search, setSearch] = useState("");

  const cards = board.cards as SprintCards;

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text as="h1" size="md" style={{ fontSize: 24, fontWeight: 700 }}>
            Sprint Board
          </Text>
          <Input
            aria-label="Search cards"
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Kanban
          className="sprint-board"
          columns={board.columns}
          cards={board.cards}
          onChange={(next) => setBoard(next)}
          filterCard={(card) => {
            const needle = search.trim().toLowerCase();
            if (!needle) return true;
            return card.title.toLowerCase().includes(needle);
          }}
          renderColumnTitle={(column) => (
            <Text style={{ fontWeight: 600 }}>
              {column.title}
              {column.limit === undefined ? ` (${columnTotal(column)})` : ""}
            </Text>
          )}
          renderCard={(card, ctx) => {
            const sprintCard = cards[card.id] ?? (card as SprintCard);
            const status = sprintCard.tags?.[0];
            return (
              <Box
                key={card.id}
                data-rebar-part="card"
                className="rebar-card sprint-card"
                draggable={ctx.dragHandlers.draggable}
                onDragStart={ctx.dragHandlers.onDragStart}
                onDragEnd={ctx.dragHandlers.onDragEnd}
                onDragOver={ctx.dragHandlers.onDragOver}
                onDrop={ctx.dragHandlers.onDrop}
                onTouchStart={ctx.touchHandlers.onTouchStart}
                onTouchEnd={ctx.touchHandlers.onTouchEnd}
                onTouchMove={ctx.touchHandlers.onTouchMove}
                onTouchCancel={ctx.touchHandlers.onTouchCancel}
                style={{ padding: 12, marginBottom: 8, cursor: "grab" }}
              >
                <Stack gap="sm">
                  <Stack direction="row" justify="between" align="start" gap="sm">
                    <Text style={{ fontWeight: 600 }}>{sprintCard.title}</Text>
                    {status ? <Tag tone={statusTone(status)}>{status}</Tag> : null}
                  </Stack>
                  {sprintCard.description ? (
                    <Text size="sm" color="secondary">
                      {sprintCard.description}
                    </Text>
                  ) : null}
                  <Stack direction="row" justify="end">
                    <Avatar size="sm" fallback={sprintCard.assignee ?? "?"} />
                  </Stack>
                </Stack>
              </Box>
            );
          }}
        />
      </Stack>
    </Box>
  );
}
