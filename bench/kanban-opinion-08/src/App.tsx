import { useState } from "react";
import type { ReactNode } from "react";
import {
  Avatar,
  Card,
  Input,
  Kanban,
  Stack,
  Text,
} from "rebar-ui";
import type {
  KanbanCard,
  KanbanCardRenderContext,
  KanbanColumn,
  KanbanState,
  TagTone,
} from "rebar-ui";

// Seed data: 2 cards in "To Do", 2 in "In Progress" (one carrying a status tag), 1 in "Done" —
// per bench/KANBAN_BENCHMARK_SPEC.md.
const initialCards: Record<string, KanbanCard> = {
  t1: {
    id: "t1",
    title: "Design empty states",
    description: "Cover zero-card columns across the board",
  },
  t2: {
    id: "t2",
    title: "Write onboarding copy",
    description: "Draft copy for the signup flow",
  },
  p1: {
    id: "p1",
    title: "API auth integration",
    description: "Waiting on the backend token endpoint",
    tags: ["Blocked"],
  },
  p2: {
    id: "p2",
    title: "Kanban drag polish",
    description: "Smooth out the reorder animation",
    tags: ["Review"],
  },
  d1: {
    id: "d1",
    title: "Set up CI pipeline",
    description: "GitHub Actions build + test",
  },
};

// Assignee initials live outside the Kanban-owned card record — KanbanCard has no assignee field
// of its own, so this is a small parallel lookup keyed by card id instead of stretching the real
// card shape to fit. Cards added later via the built-in "+ Add card" flow get a default entry
// (see handleChange below) since that flow only ever collects a title.
const initialAssignees: Record<string, string> = {
  t1: "R",
  t2: "J",
  p1: "K",
  p2: "T",
  d1: "M",
};

const initialColumns: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "todo-section", cardIds: ["t1", "t2"] }] },
  {
    id: "in-progress",
    title: "In Progress",
    limit: 4,
    sections: [{ id: "in-progress-section", cardIds: ["p1", "p2"] }],
  },
  { id: "done", title: "Done", sections: [{ id: "done-section", cardIds: ["d1"] }] },
];

function statusTone(status: string | undefined): TagTone | undefined {
  if (status === "Blocked") return "error";
  if (status === "Review") return "warning";
  return undefined;
}

function columnTotal(column: KanbanColumn): number {
  return column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<Record<string, KanbanCard>>(initialCards);
  const [assignees, setAssignees] = useState<Record<string, string>>(initialAssignees);
  const [search, setSearch] = useState("");

  const handleChange = (next: KanbanState) => {
    setColumns(next.columns);
    setCards(next.cards);
    // A card created through Kanban's own "+ Add card" control only ever arrives here with a
    // title — backfill a placeholder assignee entry for any id we haven't seen before so the
    // avatar slot in renderCard always has something to show.
    setAssignees((prev) => {
      let changed = false;
      const merged = { ...prev };
      for (const id of Object.keys(next.cards)) {
        if (!(id in merged)) {
          merged[id] = "—";
          changed = true;
        }
      }
      return changed ? merged : prev;
    });
  };

  const renderCard = (card: KanbanCard, ctx: KanbanCardRenderContext): ReactNode => {
    const status = card.tags?.[0];
    const initial = assignees[card.id] ?? "—";
    return (
      <Card
        data-rebar-part="card"
        title={card.title}
        labels={status ? [{ label: status, tone: statusTone(status) }] : undefined}
        footer={<Avatar size="sm" fallback={initial} alt={`Assigned to ${initial}`} />}
        {...ctx.dragHandlers}
        {...ctx.touchHandlers}
      >
        {card.description}
      </Card>
    );
  };

  const renderColumnTitle = (column: KanbanColumn): ReactNode => (
    <Stack direction="row" gap="xs" align="center">
      <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{column.title}</Text>
      {column.limit === undefined ? (
        <Text size="xs" color="secondary">
          {columnTotal(column)}
        </Text>
      ) : null}
    </Stack>
  );

  return (
    <Stack gap="lg" style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Text as="h1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
        Sprint Board
      </Text>
      <Input
        aria-label="Search cards"
        placeholder="Search cards by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Kanban
        columns={columns}
        cards={cards}
        onChange={handleChange}
        search={search}
        renderCard={renderCard}
        renderColumnTitle={renderColumnTitle}
      />
    </Stack>
  );
}
