import { useState } from "react";
import {
  Avatar,
  Card,
  Input,
  Kanban,
  Stack,
  Text,
  type KanbanCard,
  type KanbanCardRenderContext,
  type KanbanColumn,
  type KanbanState,
} from "rebar-ui";

// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.

/** A sprint card is a `KanbanCard` plus the two fields the spec asks for that `Kanban` itself has
 * no opinion on: a single-letter assignee (rendered in a round `Avatar`) and an optional
 * lifecycle-status tag. `Record<string, SprintCard>` still satisfies `Kanban`'s
 * `cards: Record<string, KanbanCard>` prop since every `SprintCard` is a `KanbanCard`. */
interface SprintCard extends KanbanCard {
  assignee: string;
  status?: "Blocked" | "Review";
}

const IN_PROGRESS_LIMIT = 4;

const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", sections: [{ id: "todo-section", cardIds: ["c1", "c2"] }] },
  {
    id: "in-progress",
    title: "In Progress",
    limit: IN_PROGRESS_LIMIT,
    sections: [{ id: "in-progress-section", cardIds: ["c3", "c4"] }],
  },
  { id: "done", title: "Done", sections: [{ id: "done-section", cardIds: ["c5"] }] },
];

const CARDS: Record<string, SprintCard> = {
  c1: { id: "c1", title: "Wire up auth callback", description: "Handle the OAuth redirect", assignee: "K" },
  c2: { id: "c2", title: "Write onboarding checklist", assignee: "D" },
  c3: {
    id: "c3",
    title: "Investigate flaky upload test",
    description: "Fails intermittently on CI only",
    assignee: "P",
    status: "Blocked",
  },
  c4: { id: "c4", title: "Board search UI", assignee: "S", status: "Review" },
  c5: { id: "c5", title: "Upgrade build tooling", assignee: "K" },
};

function statusTone(status: SprintCard["status"]) {
  return status === "Blocked" ? ("error" as const) : ("info" as const);
}

function renderSprintCard(card: KanbanCard, ctx: KanbanCardRenderContext) {
  const { title, description, assignee, status } = card as SprintCard;
  return (
    <Card
      data-rebar-part="card"
      title={title}
      labels={status ? [{ label: status, tone: statusTone(status) }] : undefined}
      avatar={<Avatar fallback={assignee} size="sm" />}
      {...ctx.dragHandlers}
      {...ctx.touchHandlers}
    >
      {description}
    </Card>
  );
}

/** Plain "N cards" count for a column with no cap of its own — "In Progress" already gets its
 * "n/limit" badge for free from `Kanban` (it renders that badge whenever `column.limit` is set,
 * in a slot beside whatever `renderColumnTitle` returns), so this is only reached for the two
 * uncapped columns. */
function renderColumnTitle(column: KanbanColumn) {
  if (column.limit !== undefined) {
    return <Text style={{ fontWeight: 600 }}>{column.title}</Text>;
  }
  const count = column.sections.reduce((sum, section) => sum + section.cardIds.length, 0);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Text style={{ fontWeight: 600 }}>{column.title}</Text>
      <Text size="xs" color="secondary">
        {count}
      </Text>
    </span>
  );
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(COLUMNS);
  const [cards, setCards] = useState<Record<string, SprintCard>>(CARDS);
  const [search, setSearch] = useState("");

  const handleChange = (next: KanbanState) => {
    // `Kanban`'s own add-card flow always appends the new card to the *end* of its section, but
    // the spec wants a freshly added card at the *top* of its column. There's no prop for
    // controlling insert position, so it's fixed up here: whichever id in `next.cards` wasn't in
    // `cards` a moment ago is a brand-new card (a drag, reorder, or edit never mints a new id —
    // only "+ Add card" does), so move just that id to the front of whatever section it landed in
    // before this component commits the new state.
    const newIds = Object.keys(next.cards).filter((id) => !(id in cards));
    const columnsWithNewCardsAtTop =
      newIds.length === 0
        ? next.columns
        : next.columns.map((column) => ({
            ...column,
            sections: column.sections.map((section) => {
              const added = section.cardIds.filter((id) => newIds.includes(id));
              if (added.length === 0) return section;
              const rest = section.cardIds.filter((id) => !newIds.includes(id));
              return { ...section, cardIds: [...added, ...rest] };
            }),
          }));

    setColumns(columnsWithNewCardsAtTop);
    setCards(next.cards as Record<string, SprintCard>);
  };

  return (
    <Stack gap="md" style={{ padding: "var(--rebar-space-lg, 24px)", maxWidth: 1080, margin: "0 auto" }}>
      <Text as="h1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
        Sprint Board
      </Text>
      <Input
        aria-label="Search cards"
        placeholder="Search cards by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320 }}
      />
      <Kanban
        columns={columns}
        cards={cards}
        onChange={handleChange}
        filterCard={(card) => card.title.toLowerCase().includes(search.trim().toLowerCase())}
        renderCard={renderSprintCard}
        renderColumnTitle={renderColumnTitle}
      />
    </Stack>
  );
}
