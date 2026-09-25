import { useState } from "react";
import { Avatar, Card, Input, Kanban, Stack, Text } from "rebar-ui";
import type {
  KanbanCard,
  KanbanCardRenderContext,
  KanbanColumn,
  KanbanState,
} from "rebar-ui";

/**
 * A Sprint Board card. Extends the library's own `KanbanCard` with the two fields the Kanban
 * component's data model doesn't carry itself — `status` (the lifecycle tag) and `assignee` (the
 * initial shown in the small round avatar). Kanban only ever reads/writes the fields it knows
 * about (id/title/description/tags/color), so these ride along untouched through drag/reorder;
 * a card added via the built-in "+ Add card" flow just won't have them set, which is fine — both
 * are optional.
 */
interface SprintCard extends KanbanCard {
  status?: "Blocked" | "Review";
  assignee?: string;
}

const initialCards: Record<string, SprintCard> = {
  "card-1": {
    id: "card-1",
    title: "Design login flow",
    description: "Wireframe the new SSO flow",
    assignee: "A",
  },
  "card-2": {
    id: "card-2",
    title: "Write onboarding copy",
    assignee: "J",
  },
  "card-3": {
    id: "card-3",
    title: "Integrate payment webhook",
    description: "Handle retries + idempotency",
    status: "Blocked",
    assignee: "R",
  },
  "card-4": {
    id: "card-4",
    title: "Refactor auth middleware",
    status: "Review",
    assignee: "M",
  },
  "card-5": {
    id: "card-5",
    title: "Ship v1.2 release notes",
    assignee: "T",
  },
};

const initialColumns: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "todo-section", cardIds: ["card-1", "card-2"] }] },
  // The soft cap lives on the column itself -- Kanban already rejects a drag/add past `limit`
  // and renders the "N/limit" badge in the column header, so neither behavior is reimplemented
  // here.
  {
    id: "in-progress",
    title: "In Progress",
    limit: 4,
    sections: [{ id: "in-progress-section", cardIds: ["card-3", "card-4"] }],
  },
  { id: "done", title: "Done", sections: [{ id: "done-section", cardIds: ["card-5"] }] },
];

function columnTotal(column: KanbanColumn): number {
  return column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
}

/** Replaces just the column title text. Uncapped columns ("To Do", "Done") get a plain "(N)"
 * count here since Kanban only prints its own built-in count-vs-cap badge when the column has a
 * `limit` -- "In Progress" already gets that badge for free and isn't touched here. */
function renderColumnTitle(column: KanbanColumn) {
  const total = columnTotal(column);
  return (
    <Stack direction="row" gap="xs" align="center">
      <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{column.title}</Text>
      {column.limit === undefined ? (
        <Text size="xs" color="secondary">
          ({total})
        </Text>
      ) : null}
    </Stack>
  );
}

/** Replaces the built-in card face to add the two things it doesn't render on its own: a
 * lifecycle-status tag with a tone that actually communicates severity, and the assignee avatar
 * (via `Card`'s own `footer` slot, documented for exactly this "kanban card's assignee avatar"
 * shape). Drag/touch wiring is just forwarded straight through from `ctx` -- Kanban still owns
 * all of the actual drag-and-drop/reorder/limit-checking behind it.
 */
function renderCard(card: KanbanCard, ctx: KanbanCardRenderContext) {
  const { status, assignee } = card as SprintCard;
  return (
    <Card
      data-rebar-part="card"
      title={card.title}
      labels={status ? [{ label: status, tone: status === "Blocked" ? "error" : "warning" }] : undefined}
      footer={assignee ? <Avatar size="sm" fallback={assignee} /> : undefined}
      draggable={ctx.dragHandlers.draggable}
      onDragStart={ctx.dragHandlers.onDragStart}
      onDragEnd={ctx.dragHandlers.onDragEnd}
      onDragOver={ctx.dragHandlers.onDragOver}
      onDrop={ctx.dragHandlers.onDrop}
      onTouchStart={ctx.touchHandlers.onTouchStart}
      onTouchEnd={ctx.touchHandlers.onTouchEnd}
      onTouchMove={ctx.touchHandlers.onTouchMove}
      onTouchCancel={ctx.touchHandlers.onTouchCancel}
    >
      {card.description}
    </Card>
  );
}

export default function App() {
  const [board, setBoard] = useState<KanbanState>({ columns: initialColumns, cards: initialCards });
  const [search, setSearch] = useState("");

  return (
    <Stack gap="lg" style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="xs">
        <Text as="h1" style={{ fontSize: "1.5rem", fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>
          Sprint Board
        </Text>
        <Input
          aria-label="Search cards"
          placeholder="Search cards by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </Stack>
      <Kanban
        columns={board.columns}
        cards={board.cards}
        onChange={setBoard}
        search={search}
        renderCard={renderCard}
        renderColumnTitle={renderColumnTitle}
      />
    </Stack>
  );
}
