// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useState } from "react";
import {
  Avatar,
  Card,
  Input,
  Kanban,
  Text,
  type KanbanCard,
  type KanbanCardRenderContext,
  type KanbanColumn,
  type KanbanState,
} from "rebar-ui";

// Kanban's own `KanbanCard` shape has no dedicated "status" or "assignee" fields — this board
// encodes both into the generic `tags` array Kanban already threads through drag/drop/search/
// onChange untouched, rather than reimplementing any of that plumbing. "Blocked"/"Review" are
// recognized as the lifecycle-status tag; an `assignee:<initial>` tag carries the avatar initial.
const STATUS_VALUES = ["Blocked", "Review"] as const;
type StatusTag = (typeof STATUS_VALUES)[number];
const ASSIGNEE_PREFIX = "assignee:";

function getStatus(card: KanbanCard): StatusTag | undefined {
  return card.tags?.find((t): t is StatusTag => (STATUS_VALUES as readonly string[]).includes(t));
}

function getAssignee(card: KanbanCard): string | undefined {
  const tag = card.tags?.find((t) => t.startsWith(ASSIGNEE_PREFIX));
  return tag?.slice(ASSIGNEE_PREFIX.length);
}

function card(id: string, title: string, opts: { description?: string; status?: StatusTag; assignee?: string } = {}): KanbanCard {
  const tags: string[] = [];
  if (opts.status) tags.push(opts.status);
  if (opts.assignee) tags.push(`${ASSIGNEE_PREFIX}${opts.assignee}`);
  return { id, title, description: opts.description, tags: tags.length ? tags : undefined };
}

const initialCards: Record<string, KanbanCard> = Object.fromEntries(
  [
    card("c1", "Set up CI pipeline", { description: "Lint, typecheck, test on every PR", assignee: "A" }),
    card("c2", "Write onboarding docs", { assignee: "J" }),
    card("c3", "Refactor auth module", { description: "Blocked on upstream token service", status: "Blocked", assignee: "M" }),
    card("c4", "Design empty states", { status: "Review", assignee: "K" }),
    card("c5", "Update README", { assignee: "T" }),
  ].map((c) => [c.id, c]),
);

const initialColumns: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "todo-main", cardIds: ["c1", "c2"] }] },
  { id: "in-progress", title: "In Progress", limit: 4, sections: [{ id: "in-progress-main", cardIds: ["c3", "c4"] }] },
  { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["c5"] }] },
];

function columnTotal(column: KanbanColumn): number {
  return column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
}

// Kanban's own "+ Add card" always appends the new card to the *end* of the target section's
// cardIds (see insertCard's `beforeCardId: undefined` call in confirmAdd) — the spec wants new
// cards at the *top* of the column instead. Rather than reimplementing the add flow, this
// post-processes the `onChange` state Kanban already produced: whichever card id is new since the
// last render gets moved to the front of whatever section it landed in. Drag/drop, reorder, and
// edits are untouched — only a freshly-added id is ever moved.
function moveNewCardsToTop(prevCards: Record<string, KanbanCard>, next: KanbanState): KanbanState {
  const newIds = Object.keys(next.cards).filter((id) => !(id in prevCards));
  if (newIds.length === 0) return next;
  return {
    ...next,
    columns: next.columns.map((col) => ({
      ...col,
      sections: col.sections.map((sec) => {
        const fresh = sec.cardIds.filter((id) => newIds.includes(id));
        if (fresh.length === 0) return sec;
        const rest = sec.cardIds.filter((id) => !newIds.includes(id));
        return { ...sec, cardIds: [...fresh, ...rest] };
      }),
    })),
  };
}

function SprintCard(c: KanbanCard, ctx: KanbanCardRenderContext) {
  const status = getStatus(c);
  const assignee = getAssignee(c);
  return (
    <Card
      data-rebar-part="card"
      title={c.title}
      labels={status ? [{ label: status, tone: status === "Blocked" ? "error" : "info" }] : undefined}
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
      {c.description}
    </Card>
  );
}

export default function App() {
  const [state, setState] = useState<KanbanState>({ columns: initialColumns, cards: initialCards });
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <Text as="h1" size="md" style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
        Sprint Board
      </Text>
      <div style={{ maxWidth: 320, marginBottom: "1rem" }}>
        <Input
          aria-label="Search cards"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Kanban
        columns={state.columns}
        cards={state.cards}
        search={search}
        renderCard={SprintCard}
        renderColumnTitle={(column) => (
          <Text style={{ fontWeight: 600 }}>
            {column.title}
            {column.limit === undefined ? ` (${columnTotal(column)})` : ""}
          </Text>
        )}
        onChange={(next) => setState((prev) => moveNewCardsToTop(prev.cards, next))}
      />
    </div>
  );
}
