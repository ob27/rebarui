import { useState } from "react";
import {
  Avatar,
  Input,
  Kanban,
  Stack,
  Tag,
  Text,
} from "rebar-ui";
import type { KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";

// Sprint Board — see bench/KANBAN_BENCHMARK_SPEC.md. Built on the real `Kanban` component:
// column layout, drag-and-drop (mouse + touch), search filtering, and the "+ Add card" flow with
// its Enter/Escape handling and cap enforcement all come from Kanban itself. Everything below is
// props/data/styling customization only.

/** Kanban's own `KanbanCard` plus the two fields this board's spec needs that Kanban doesn't
 * know about: a lifecycle-status tag (represented as the single entry in `tags`, when present)
 * and a single-letter assignee initial. A card added via Kanban's built-in "+ Add card" control
 * only ever sets `id`/`title` — so `assignee` has to be optional here, not a field this board can
 * assume every card has. */
interface SprintCard extends KanbanCard {
  assignee?: string;
}

interface BoardState {
  columns: KanbanColumn[];
  cards: Record<string, SprintCard>;
}

const IN_PROGRESS_LIMIT = 4;

const initialBoard: BoardState = {
  columns: [
    { id: "todo", title: "To Do", sections: [{ id: "todo-section", cardIds: ["t1", "t2"] }] },
    {
      id: "in-progress",
      title: "In Progress",
      limit: IN_PROGRESS_LIMIT,
      sections: [{ id: "in-progress-section", cardIds: ["p1", "p2"] }],
    },
    { id: "done", title: "Done", sections: [{ id: "done-section", cardIds: ["d1"] }] },
  ],
  cards: {
    t1: { id: "t1", title: "Design empty states", description: "Cover no-results and error cases", assignee: "J" },
    t2: { id: "t2", title: "Write onboarding copy", assignee: "M" },
    p1: {
      id: "p1",
      title: "Refactor auth middleware",
      description: "Blocked on the new session store",
      tags: ["Blocked"],
      assignee: "K",
    },
    p2: { id: "p2", title: "Update API docs", assignee: "S" },
    d1: { id: "d1", title: "Set up CI pipeline", assignee: "T" },
  },
};

export default function App() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [search, setSearch] = useState("");

  const handleChange = (next: KanbanState) => {
    setBoard((prev) => {
      // Kanban's own "+ Add card" flow always inserts the new card at the *end* of its section
      // (see `insertCard` in Kanban.tsx: no `beforeCardId` means append). The spec wants a new
      // card at the *top* instead, so that's the one thing this board adjusts after the fact —
      // everything else about `next` (drag/reorder results, cap rejection, the new card's data)
      // comes straight from Kanban unchanged.
      const newCardIds = Object.keys(next.cards).filter((id) => !(id in prev.cards));
      const columns =
        newCardIds.length === 0
          ? next.columns
          : next.columns.map((col) => ({
              ...col,
              sections: col.sections.map((section) => {
                const toFront = section.cardIds.filter((id) => newCardIds.includes(id));
                if (toFront.length === 0) return section;
                const rest = section.cardIds.filter((id) => !newCardIds.includes(id));
                return { ...section, cardIds: [...toFront, ...rest] };
              }),
            }));
      return { columns, cards: next.cards as Record<string, SprintCard> };
    });
  };

  return (
    <Stack gap="md" style={{ padding: "var(--rebar-space-lg, 24px)" }}>
      <Text style={{ fontSize: "1.25rem", fontWeight: 600 }}>Sprint Board</Text>
      <Input
        aria-label="Search cards"
        placeholder="Search cards by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320 }}
      />
      <Kanban
        columns={board.columns}
        cards={board.cards}
        onChange={handleChange}
        search={search}
        renderColumnTitle={(column) => {
          const total = column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
          return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{column.title}</Text>
              {/* Columns with no `limit` get a plain count; "In Progress" already gets Kanban's
                  own built-in "count/limit" badge (rendered alongside this title, not by us) since
                  it has `limit` set — showing a second count here would just duplicate it. */}
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
          const status = sprintCard.tags?.[0];
          const tone = status === "Blocked" ? "error" : status === "Review" ? "info" : "default";
          return (
            <div
              className="rebar-card"
              data-rebar-component="card"
              data-rebar-part="card"
              draggable={ctx.dragHandlers.draggable}
              onDragStart={ctx.dragHandlers.onDragStart}
              onDragEnd={ctx.dragHandlers.onDragEnd}
              onDragOver={ctx.dragHandlers.onDragOver}
              onDrop={ctx.dragHandlers.onDrop}
              onTouchStart={ctx.touchHandlers.onTouchStart}
              onTouchEnd={ctx.touchHandlers.onTouchEnd}
              onTouchMove={ctx.touchHandlers.onTouchMove}
              onTouchCancel={ctx.touchHandlers.onTouchCancel}
              style={{ padding: "var(--rebar-space-sm, 8px)", display: "flex", flexDirection: "column", gap: 6 }}
            >
              <Stack direction="row" justify="between" align="start" gap="sm">
                <Text style={{ fontWeight: 600 }}>{sprintCard.title}</Text>
                <Avatar fallback={sprintCard.assignee ?? "?"} size="sm" />
              </Stack>
              {sprintCard.description ? (
                <Text size="sm" color="secondary">
                  {sprintCard.description}
                </Text>
              ) : null}
              {status ? <Tag tone={tone}>{status}</Tag> : null}
            </div>
          );
        }}
      />
    </Stack>
  );
}
