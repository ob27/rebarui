// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
//
// kanban-opinion condition: use the real `Kanban` component from `rebar-ui` directly. Everything
// board-shaped (columns, sections, drag-and-drop, reordering, search filtering, the "In Progress"
// cap, add-card) is `Kanban`'s own behavior, driven entirely via props — this file only supplies
// data, the two customization hooks (`renderCard`/`renderColumnTitle`) needed for the visual
// details Kanban doesn't already have an opinion on (an assignee avatar, a plain count next to an
// uncapped column's title), and the search box wired to `search`.
import { useState } from "react";
import { Avatar, Card, Heading, Input, Kanban, Stack, Text } from "rebar-ui";
import type { KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";

// `KanbanCard` (from rebar-ui) has no assignee field of its own — this board's own extension of
// it, carried alongside the fields Kanban already knows about. Structurally assignable to
// `KanbanCard` wherever Kanban's own props ask for one, so no casting is needed to hand this state
// to `Kanban` itself; only `renderCard` below (which gets a plain `KanbanCard` back) needs to read
// `assignee` off of it, via a narrow cast.
interface SprintCard extends KanbanCard {
  assignee?: string;
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [
      { id: "todo-main", cardIds: ["design-onboarding", "write-api-docs"] },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    // The spec's "soft cap of 4" — Kanban enforces this itself (rejects both a drag-drop and an
    // add-card submission past it, disables the add control at cap) and renders the "3/4" badge
    // next to the title whenever a column has a `limit`, so setting it here is the entire
    // implementation of that requirement.
    limit: 4,
    sections: [
      { id: "in-progress-main", cardIds: ["fix-payment-bug", "refactor-auth"] },
    ],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-main", cardIds: ["ci-pipeline"] }],
  },
];

const INITIAL_CARDS: Record<string, SprintCard> = {
  "design-onboarding": {
    id: "design-onboarding",
    title: "Design onboarding flow",
    description: "First-run wizard for new workspaces",
    assignee: "A",
  },
  "write-api-docs": {
    id: "write-api-docs",
    title: "Write API docs",
    description: "Cover the new webhooks endpoints",
    assignee: "J",
  },
  "fix-payment-bug": {
    id: "fix-payment-bug",
    title: "Fix payment bug",
    description: "Retries double-charge on timeout",
    tags: ["Blocked"],
    assignee: "M",
  },
  "refactor-auth": {
    id: "refactor-auth",
    title: "Refactor auth module",
    tags: ["Review"],
    assignee: "S",
  },
  "ci-pipeline": {
    id: "ci-pipeline",
    title: "Set up CI pipeline",
    description: "Runs lint + tests on every push",
    assignee: "T",
  },
};

// Tags on a card are a free-form string array in `KanbanCard`, but this board only ever puts the
// single lifecycle-status value in slot 0 (or leaves it empty) — this is just the tone lookup for
// that one tag, not a general tags-to-tones mapper.
function statusTone(status: string): "error" | "warning" | "default" {
  if (status === "Blocked") return "error";
  if (status === "Review") return "warning";
  return "default";
}

export default function App() {
  const [board, setBoard] = useState<KanbanState>({
    columns: INITIAL_COLUMNS,
    cards: INITIAL_CARDS,
  });
  const [search, setSearch] = useState("");

  return (
    <Stack gap="lg" style={{ padding: "var(--rebar-space-lg, 24px)", maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="xs">
        <Heading level={1}>Sprint Board</Heading>
        <Text color="secondary">Track this sprint's work across To Do, In Progress, and Done.</Text>
      </Stack>

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
        onChange={(next) => setBoard(next)}
        search={search}
        renderColumnTitle={(column) => {
          // Every column shows its title plus a card count (the spec's general requirement); a
          // column with its own `limit` (just "In Progress" here) already gets a "3/4"-style
          // count-vs-cap badge from Kanban itself next to the title, so this only adds a plain
          // count for the uncapped columns instead of doubling up on one that already has it.
          const count = column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
          return (
            <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>
              {column.title}
              {column.limit === undefined ? (
                <Text as="span" size="xs" color="secondary">
                  {" "}
                  ({count})
                </Text>
              ) : null}
            </Text>
          );
        }}
        renderCard={(card, ctx) => {
          const sprintCard = card as SprintCard;
          const status = card.tags?.[0];
          return (
            <Card
              data-rebar-part="card"
              title={card.title}
              avatar={<Avatar size="sm" fallback={sprintCard.assignee ?? card.title.charAt(0).toUpperCase()} />}
              labels={status ? [{ label: status, tone: statusTone(status) }] : undefined}
              style={{ cursor: "grab" }}
              {...ctx.dragHandlers}
              {...ctx.touchHandlers}
            >
              {card.description}
            </Card>
          );
        }}
      />
    </Stack>
  );
}
