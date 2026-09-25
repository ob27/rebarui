// Sprint Board — built on the real `Kanban` component from `rebar-ui` (see
// bench/KANBAN_BENCHMARK_SPEC.md, "kanban-opinion-*" condition). Drag-and-drop, search
// filtering, add-card, and column-cap enforcement are all Kanban's own behavior; this file only
// supplies props (seed data, `search`, column `limit`, `renderCard`, `renderColumnTitle`) and a
// thin `onChange` wrapper that repositions a freshly-added card to the top of its column, since
// Kanban's own "+ Add card" appends to the bottom.

import { useState } from "react";
import { Avatar, Box, Card, Heading, Input, Kanban, Stack, Tag, Text } from "rebar-ui";
import type { KanbanCard, KanbanCardRenderContext, KanbanColumn, KanbanState } from "rebar-ui";

/** A Sprint Board card — `KanbanCard` plus a single-letter assignee initial. A card added via
 * Kanban's own built-in "+ Add card" flow won't carry one (that flow only knows about `title`),
 * which is fine: `AssigneeAvatar` below just falls back to "?" when it's missing. */
interface SprintCard extends KanbanCard {
  assignee?: string;
}

interface Board {
  columns: KanbanColumn[];
  cards: Record<string, SprintCard>;
}

const INITIAL_CARDS: Record<string, SprintCard> = {
  "design-nav": { id: "design-nav", title: "Design new nav layout", description: "Explore 3 directions", assignee: "R" },
  "spec-api": { id: "spec-api", title: "Write API spec for billing", assignee: "T" },
  "fix-oauth": {
    id: "fix-oauth",
    title: "Fix OAuth redirect loop",
    description: "Repros only on Safari",
    tags: ["Blocked"],
    assignee: "M",
  },
  "review-pr": { id: "review-pr", title: "Review PR #482", tags: ["Review"], assignee: "J" },
  "ship-onboarding": { id: "ship-onboarding", title: "Ship new onboarding flow", assignee: "R" },
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "todo-main", cardIds: ["design-nav", "spec-api"] }] },
  {
    id: "in-progress",
    title: "In Progress",
    sections: [{ id: "in-progress-main", cardIds: ["fix-oauth", "review-pr"] }],
    limit: 4,
  },
  { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["ship-onboarding"] }] },
];

function totalCount(column: KanbanColumn): number {
  return column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
}

/** Column header title — Kanban's own limit badge already renders the "3/4" count-vs-cap next to
 * the title for a column with a `limit` (In Progress); for an uncapped column (To Do, Done) we
 * add a plain "(n)" count ourselves here so every column shows title + count, per spec. Reads off
 * `column.sections[].cardIds` directly (the board's real, unfiltered data), so it never reflects
 * what search happens to be hiding. */
function ColumnTitle({ column }: { column: KanbanColumn }) {
  return (
    <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>
      {column.title}
      {column.limit === undefined ? ` (${totalCount(column)})` : ""}
    </Text>
  );
}

function SprintCardFace({ card, ctx }: { card: SprintCard; ctx: KanbanCardRenderContext }) {
  const tag = card.tags?.[0];
  return (
    <Card
      data-rebar-part="card"
      title={card.title}
      labels={tag ? [{ label: tag, tone: tag === "Blocked" ? "error" : tag === "Review" ? "warning" : "default" }] : undefined}
      footer={<Avatar size="sm" fallback={card.assignee ?? "?"} />}
      draggable={ctx.dragHandlers.draggable}
      onDragStart={ctx.dragHandlers.onDragStart}
      onDragEnd={ctx.dragHandlers.onDragEnd}
      onDragOver={ctx.dragHandlers.onDragOver}
      onDrop={ctx.dragHandlers.onDrop}
      onTouchStart={ctx.touchHandlers.onTouchStart}
      onTouchEnd={ctx.touchHandlers.onTouchEnd}
      onTouchMove={ctx.touchHandlers.onTouchMove}
      onTouchCancel={ctx.touchHandlers.onTouchCancel}
      style={{ cursor: "grab" }}
    >
      {card.description}
    </Card>
  );
}

export default function App() {
  const [board, setBoard] = useState<Board>({ columns: INITIAL_COLUMNS, cards: INITIAL_CARDS });
  const [search, setSearch] = useState("");

  // Kanban's own "+ Add card" appends the new card to the *end* of the section's cardIds (see
  // Kanban.tsx's `confirmAdd` -> `insertCard(..., beforeCardId: undefined)`), but the spec wants
  // it at the *top*. Rather than reimplementing add-card (not allowed for this condition), detect
  // which card id(s) are new (present in `next.cards` but not in the previous committed state —
  // the only way a brand-new id enters `cards` at all, since drag/reorder only ever rearranges
  // existing ids) and move just those to the front of whichever section they landed in.
  const handleChange = (next: KanbanState) => {
    setBoard((prev) => {
      const addedIds = Object.keys(next.cards).filter((id) => !(id in prev.cards));
      if (addedIds.length === 0) {
        return { columns: next.columns, cards: prev.cards };
      }
      const columns = next.columns.map((col) => ({
        ...col,
        sections: col.sections.map((s) => {
          const added = s.cardIds.filter((id) => addedIds.includes(id));
          if (added.length === 0) return s;
          const rest = s.cardIds.filter((id) => !addedIds.includes(id));
          return { ...s, cardIds: [...added, ...rest] };
        }),
      }));
      const cards: Record<string, SprintCard> = { ...prev.cards };
      for (const id of addedIds) cards[id] = next.cards[id] as SprintCard;
      return { columns, cards };
    });
  };

  return (
    <Stack gap="lg" style={{ padding: "var(--rebar-space-lg)" }}>
      <Stack gap="xs">
        <Heading level={1}>Sprint Board</Heading>
        <Text color="secondary">Drag cards between columns, search across the board, and add new work to any column.</Text>
      </Stack>

      <Input
        aria-label="Search cards"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320 }}
      />

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
          overflowX: "auto",
        }}
      >
        <Kanban
          columns={board.columns}
          cards={board.cards}
          onChange={handleChange}
          search={search}
          renderCard={(card, ctx) => <SprintCardFace card={card as SprintCard} ctx={ctx} />}
          renderColumnTitle={(column) => <ColumnTitle column={column} />}
        />
      </Box>
    </Stack>
  );
}
