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

/** The spec's card shape is a superset of `KanbanCard` — an assignee initial and an optional
 * lifecycle-status tag, on top of everything `KanbanCard` already provides (title/description/
 * id). `Record<string, SprintCard>` is still assignable to `Kanban`'s `cards` prop
 * (`Record<string, KanbanCard>`) since every `SprintCard` is-a `KanbanCard`. */
interface SprintCard extends KanbanCard {
  /** A single letter, rendered in a small round `Avatar`. */
  assignee: string;
  /** The one status tag a card may carry — omit for "no tag at all". */
  status?: "Blocked" | "Review";
}

const IN_PROGRESS_CAP = 4;

const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-main", cardIds: ["t1", "t2"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    limit: IN_PROGRESS_CAP,
    sections: [{ id: "in-progress-main", cardIds: ["p1", "p2"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-main", cardIds: ["d1"] }],
  },
];

const initialCards: Record<string, SprintCard> = {
  t1: { id: "t1", title: "Set up CI pipeline", description: "GitHub Actions, lint + test", assignee: "M" },
  t2: { id: "t2", title: "Draft onboarding copy", assignee: "R" },
  p1: {
    id: "p1",
    title: "Fix drag-and-drop on touch",
    description: "Regressed on Android Chrome",
    assignee: "J",
    status: "Blocked",
  },
  p2: { id: "p2", title: "Sprint board search", assignee: "A", status: "Review" },
  d1: { id: "d1", title: "Migrate to pnpm workspaces", assignee: "M" },
};

function renderSprintCard(card: KanbanCard, ctx: KanbanCardRenderContext) {
  const sprintCard = card as SprintCard;
  const labels = sprintCard.status
    ? [{ label: sprintCard.status, tone: sprintCard.status === "Blocked" ? ("error" as const) : ("info" as const) }]
    : undefined;

  return (
    <Card
      data-rebar-part="card"
      title={sprintCard.title}
      labels={labels}
      avatar={<Avatar fallback={sprintCard.assignee} size="sm" />}
      {...ctx.dragHandlers}
      {...ctx.touchHandlers}
    >
      {sprintCard.description}
    </Card>
  );
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<Record<string, SprintCard>>(initialCards);
  const [query, setQuery] = useState("");

  const handleChange = (next: KanbanState) => {
    // Kanban's own add-card flow (`confirmAdd`) always appends a newly created card to the *end*
    // of its section (`insertCard`'s `beforeCardId` is undefined for a plain add) — but the spec
    // wants a new card at the *top* of its column. Kanban has no prop for controlling insert
        // position on add, so this is done as a post-processing reorder here: diff the incoming
    // `cards` against what this component already knows about to find any genuinely *new* id
    // (present in `next.cards`, absent from the current `cards` state — a drag/reorder/edit never
    // introduces a new id, only an add does), then move just that id to the front of whichever
    // section it landed in before committing to state. This never touches drag-and-drop reordering
    // or search/filter — only the one-time placement of a brand new card.
    const addedIds = Object.keys(next.cards).filter((id) => !(id in cards));
    const nextColumns =
      addedIds.length === 0
        ? next.columns
        : next.columns.map((column) => ({
            ...column,
            sections: column.sections.map((section) => {
              const added = section.cardIds.filter((id) => addedIds.includes(id));
              if (added.length === 0) return section;
              const rest = section.cardIds.filter((id) => !addedIds.includes(id));
              return { ...section, cardIds: [...added, ...rest] };
            }),
          }));

    setColumns(nextColumns);
    // The objects Kanban hands back are still the same `SprintCard`-shaped references this
    // component passed in (or, for a newly added card, a plain `{id, title}` `KanbanCard` — an
    // add-card only ever supplies a title, so a freshly created card simply renders with no
    // assignee/status yet, same as any other optional field).
    setCards(next.cards as Record<string, SprintCard>);
  };

  return (
    <Stack gap="md" style={{ padding: "var(--rebar-space-lg, 24px)", maxWidth: 1100, margin: "0 auto" }}>
      <Text as="h1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
        Sprint Board
      </Text>
      <Input
        aria-label="Search cards"
        placeholder="Search cards by title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 320 }}
      />
      <Kanban
        columns={columns}
        cards={cards}
        onChange={handleChange}
        filterCard={(card) => card.title.toLowerCase().includes(query.trim().toLowerCase())}
        renderCard={renderSprintCard}
        renderColumnTitle={(column) => {
          // Kanban only shows its own built-in count-vs-cap badge ("3/4") next to the title when
          // the column has a `limit` — which is exactly right for "In Progress" (left alone below,
          // default rendering) but the spec also wants a plain card count on "To Do"/"Done", which
          // have no cap. `renderColumnTitle` only replaces the title text itself (the limit badge
          // lives in a separate, always-rendered slot beside it), so a plain-count column gets its
          // count folded into this custom title instead.
          if (column.limit !== undefined) {
            return <Text style={{ fontWeight: 600 }}>{column.title}</Text>;
          }
          const total = column.sections.reduce((sum, s) => sum + s.cardIds.length, 0);
          return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: 600 }}>{column.title}</Text>
              <Text size="xs" color="secondary">
                {total}
              </Text>
            </span>
          );
        }}
      />
    </Stack>
  );
}
