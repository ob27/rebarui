import { useState } from "react";
import {
  Kanban,
  Card,
  Avatar,
  Input,
} from "rebar-ui";
import type {
  KanbanColumn,
  KanbanCard,
  KanbanCardRenderContext,
  KanbanState,
  TagTone,
} from "rebar-ui";

// Extends the base KanbanCard shape with an assignee initial — Kanban itself has no notion of
// "assignee," it just carries whatever card data the caller passes through `cards`/`onChange`.
interface SprintCard extends KanbanCard {
  assignee?: string;
}

const STATUS_TONE: Record<string, TagTone> = {
  Blocked: "error",
  Review: "warning",
};

const initialCards: Record<string, SprintCard> = {
  "card-1": {
    id: "card-1",
    title: "Design login flow",
    description: "Wireframes for auth screens",
    assignee: "A",
  },
  "card-2": {
    id: "card-2",
    title: "Write onboarding docs",
    assignee: "S",
  },
  "card-3": {
    id: "card-3",
    title: "Implement search API",
    description: "Elasticsearch integration",
    tags: ["Blocked"],
    assignee: "M",
  },
  "card-4": {
    id: "card-4",
    title: "Fix pagination bug",
    tags: ["Review"],
    assignee: "J",
  },
  "card-5": {
    id: "card-5",
    title: "Ship release notes",
    description: "Summarize sprint 14 changes",
    assignee: "R",
  },
};

const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-cards", cardIds: ["card-1", "card-2"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    limit: 4,
    sections: [{ id: "in-progress-cards", cardIds: ["card-3", "card-4"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-cards", cardIds: ["card-5"] }],
  },
];

/** Kanban's own built-in "+ Add card" control always appends a new card to the end of its
 * section (see `insertCard` in Kanban.tsx, called with `beforeCardId: undefined`). The spec here
 * wants new cards at the *top* instead, and Kanban doesn't expose an option for that — so rather
 * than reimplementing the add-card input/Enter/Escape/capacity-check flow ourselves, we let
 * Kanban do all of that and simply re-sort a freshly-added card to the front of its section
 * afterward, detected by an id that didn't exist before this change. */
function moveNewCardsToTop(next: KanbanState, previousCardIds: ReadonlySet<string>): KanbanState {
  const newIds = Object.keys(next.cards).filter((id) => !previousCardIds.has(id));
  if (newIds.length === 0) return next;
  const newIdSet = new Set(newIds);
  return {
    ...next,
    columns: next.columns.map((column) => ({
      ...column,
      sections: column.sections.map((section) => {
        const added = section.cardIds.filter((id) => newIdSet.has(id));
        if (added.length === 0) return section;
        const rest = section.cardIds.filter((id) => !newIdSet.has(id));
        return { ...section, cardIds: [...added, ...rest] };
      }),
    })),
  };
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<Record<string, SprintCard>>(initialCards);
  const [query, setQuery] = useState("");

  const handleChange = (next: KanbanState) => {
    const adjusted = moveNewCardsToTop(next, new Set(Object.keys(cards)));
    setColumns(adjusted.columns);
    setCards(adjusted.cards as Record<string, SprintCard>);
  };

  const renderCard = (card: KanbanCard, ctx: KanbanCardRenderContext) => {
    const sprintCard = cards[card.id];
    const status = card.tags?.[0];
    return (
      <Card
        data-rebar-part="card"
        title={card.title}
        labels={status ? [{ label: status, tone: STATUS_TONE[status] ?? "default" }] : undefined}
        footer={<Avatar size="sm" fallback={sprintCard?.assignee ?? "?"} />}
        {...ctx.dragHandlers}
        {...ctx.touchHandlers}
      >
        {card.description}
      </Card>
    );
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Sprint Board</h1>
      <div style={{ marginBottom: "1rem", maxWidth: 320 }}>
        <Input
          aria-label="Search cards"
          placeholder="Search cards by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Kanban
        columns={columns}
        cards={cards}
        onChange={handleChange}
        filterCard={(card) =>
          query.trim().length === 0 || card.title.toLowerCase().includes(query.trim().toLowerCase())
        }
        renderCard={renderCard}
      />
    </div>
  );
}
