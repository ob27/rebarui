import { useState } from "react";
import { Input, Kanban, Stack, Text } from "rebar-ui";
import type { KanbanColumn, KanbanState } from "rebar-ui";
import { renderSprintCard } from "./SprintCardView";
import { initialCards, initialColumns } from "./seedData";
import type { SprintCard } from "./types";

// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this
// condition's constraint: use the real `Kanban` component directly, customized via props —
// don't reimplement drag-and-drop, search, or cap enforcement, all of which Kanban already does).

function columnCardCount(column: KanbanColumn): number {
  return column.sections.reduce((sum, section) => sum + section.cardIds.length, 0);
}

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<Record<string, SprintCard>>(initialCards);
  const [query, setQuery] = useState("");

  const handleChange = (next: KanbanState) => {
    // Kanban's own "+ Add card" flow always inserts a freshly created card at the *end* of its
    // section (no prop controls insert position) — but the spec wants a new card at the *top* of
    // its column. Diff the incoming cards against what's already known here to find any genuinely
    // new id (present in `next.cards`, absent before — a drag/reorder/edit never introduces a new
    // id, only an add does), then move just that id to the front of whichever section it landed
    // in. This never touches drag-and-drop reordering, only the one-time placement of a new card.
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
    // The card objects Kanban hands back are still the same SprintCard-shaped references passed
    // in — except a brand-new card, which only ever carries the plain `{id, title}` KanbanCard
    // shape the add-form supplies (no assignee/status yet), so it simply renders without those.
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
        search={query}
        renderCard={renderSprintCard}
        renderColumnTitle={(column) => {
          // Kanban's own built-in "count/cap" badge already appears next to the title whenever a
          // column has a `limit` (exactly "In Progress" here, left as the default badge below) —
          // but the spec also wants a plain card count shown on the uncapped columns ("To Do",
          // "Done"). `renderColumnTitle` only swaps the title text itself (the limit badge lives
          // in its own always-rendered slot beside it), so the uncapped count is folded into this
          // custom title instead, to avoid a second, redundant badge on "In Progress".
          if (column.limit !== undefined) {
            return <Text style={{ fontWeight: 600 }}>{column.title}</Text>;
          }
          return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: 600 }}>{column.title}</Text>
              <Text size="xs" color="secondary">
                {columnCardCount(column)}
              </Text>
            </span>
          );
        }}
      />
    </Stack>
  );
}
