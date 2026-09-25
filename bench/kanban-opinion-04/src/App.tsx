import { useState } from "react";
import {
  Avatar,
  Card,
  Input,
  Kanban,
  Stack,
  Text,
} from "rebar-ui";
import type { KanbanCard, KanbanCardRenderContext, KanbanColumn, KanbanState } from "rebar-ui";

// Kanban's own `KanbanCard` shape has no assignee field — this benchmark's cards need one, so it's
// tracked in a side lookup keyed by card id (never touched by Kanban itself) rather than smuggled
// into `tags` (which already carries the real lifecycle-status tag) or `description`.
const ASSIGNEES: Record<string, string> = {
  "card-1": "A",
  "card-2": "R",
  "card-3": "J",
  "card-4": "M",
  "card-5": "S",
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-main", cardIds: ["card-1", "card-2"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    // Soft cap of 4 — Kanban rejects both a drag-drop and an "+ Add card" submission past this,
    // and renders the "n/4" badge next to the column title itself.
    limit: 4,
    sections: [{ id: "in-progress-main", cardIds: ["card-3", "card-4"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-main", cardIds: ["card-5"] }],
  },
];

const INITIAL_CARDS: Record<string, KanbanCard> = {
  "card-1": { id: "card-1", title: "Write onboarding checklist", description: "Cover first-week setup" },
  "card-2": { id: "card-2", title: "Audit color contrast", description: "WCAG AA sweep across the app" },
  "card-3": { id: "card-3", title: "Fix flaky drag-drop test", description: "Fails ~1 in 20 CI runs", tags: ["Blocked"] },
  "card-4": { id: "card-4", title: "Ship search filter", description: "Case-insensitive substring match" },
  "card-5": { id: "card-5", title: "Set up CI pipeline", description: "GitHub Actions, lint + test" },
};

function statusTone(tag: string): "error" | "warning" | "default" {
  if (tag === "Blocked") return "error";
  if (tag === "Review") return "warning";
  return "default";
}

/** Custom card face for the Sprint Board: title, optional description, a lifecycle-status tag,
 * and a single-letter assignee avatar — wired to the drag/touch handlers Kanban hands back via
 * `renderCard`'s context so drag-and-drop keeps working exactly as it does for the built-in card. */
function renderSprintCard(card: KanbanCard, ctx: KanbanCardRenderContext) {
  const status = card.tags?.[0];
  const initial = ASSIGNEES[card.id] ?? "?";
  return (
    <Card
      key={card.id}
      data-rebar-part="card"
      avatar={<Avatar fallback={initial} size="sm" />}
      title={card.title}
      subtitle={card.description}
      labels={status ? [{ label: status, tone: statusTone(status) }] : undefined}
      draggable={ctx.dragHandlers.draggable}
      onDragStart={ctx.dragHandlers.onDragStart}
      onDragEnd={ctx.dragHandlers.onDragEnd}
      onDragOver={ctx.dragHandlers.onDragOver}
      onDrop={ctx.dragHandlers.onDrop}
      onTouchStart={ctx.touchHandlers.onTouchStart}
      onTouchEnd={ctx.touchHandlers.onTouchEnd}
      onTouchMove={ctx.touchHandlers.onTouchMove}
      onTouchCancel={ctx.touchHandlers.onTouchCancel}
    />
  );
}

export default function App() {
  const [board, setBoard] = useState<KanbanState>({ columns: INITIAL_COLUMNS, cards: INITIAL_CARDS });
  const [search, setSearch] = useState("");

  return (
    <Stack gap="lg" style={{ padding: "var(--rebar-space-lg, 24px)", maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="xs">
        <Text as="h1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
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
        columns={board.columns}
        cards={board.cards}
        onChange={setBoard}
        // Title-substring filtering only, per spec — Kanban's own built-in `search` prop also
        // matches description/tags, so `filterCard` is used instead to keep this to title-only
        // while still leaving the true per-section cardIds (and the limit badge) untouched.
        filterCard={(card) => card.title.toLowerCase().includes(search.trim().toLowerCase())}
        renderCard={renderSprintCard}
      />
    </Stack>
  );
}
