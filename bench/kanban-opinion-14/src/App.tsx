// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useState } from "react";
import { Box, Input, Kanban, Stack, Text } from "rebar-ui";
import type { KanbanColumn, KanbanState } from "rebar-ui";
import { renderBoardCard } from "./BoardCard";
import { initialBoard } from "./seed";
import type { SprintCard } from "./types";

// Kanban only renders its own "n/limit" badge next to a column's title when that column has a
// `limit` — exactly the "3/4" the spec wants for "In Progress", so that column is left alone here.
// The other two columns have no limit and so get no badge from Kanban at all, but the spec still
// wants a plain card count on every column header — this adds just that, for columns without a
// limit, via `renderColumnTitle` (which only ever replaces the title text itself; Kanban's own
// limit badge and sort button either side of it are unaffected either way).
function renderColumnTitle(column: KanbanColumn) {
  const count = column.sections.reduce((sum, section) => sum + section.cardIds.length, 0);
  return (
    <Stack direction="row" align="center" gap="xs">
      <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{column.title}</Text>
      {column.limit === undefined ? (
        <Text size="xs" color="secondary">
          ({count})
        </Text>
      ) : null}
    </Stack>
  );
}

export default function App() {
  const [board, setBoard] = useState<KanbanState>(initialBoard);
  const [search, setSearch] = useState("");

  // Kanban's own "+ Add card" flow (input, Enter/Escape, cap rejection) already does everything
  // the spec asks for except *where* the new card lands — it always appends to the end of the
  // section's cardIds. The spec wants a fresh card at the top of the column instead, which Kanban
  // has no prop for, so this is the one place we post-process its `onChange` output: detect a
  // card id that didn't exist a moment ago (i.e. one Kanban's add flow just created — a drag/
  // reorder only ever moves an *existing* id, so it never matches here) and move just that id to
  // the front of whichever section it landed in. The add flow's own input/validation/cap-check
  // logic is untouched; this only fixes up final ordering.
  const handleChange = (next: KanbanState) => {
    const addedId = Object.keys(next.cards).find((id) => !(id in board.cards));
    if (!addedId) {
      setBoard(next);
      return;
    }
    const columns: KanbanColumn[] = next.columns.map((col) => ({
      ...col,
      sections: col.sections.map((section) =>
        section.cardIds.includes(addedId)
          ? { ...section, cardIds: [addedId, ...section.cardIds.filter((id) => id !== addedId)] }
          : section,
      ),
    }));
    setBoard({ ...next, columns });
  };

  return (
    <Box style={{ padding: "var(--rebar-space-lg, 24px)" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text as="h1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Sprint Board
          </Text>
          <Input
            aria-label="Search cards"
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>
        <Kanban
          columns={board.columns}
          cards={board.cards}
          onChange={handleChange}
          filterCard={(card) => card.title.toLowerCase().includes(search.trim().toLowerCase())}
          renderCard={(card, ctx) => renderBoardCard(card as SprintCard, ctx)}
          renderColumnTitle={renderColumnTitle}
        />
      </Stack>
    </Box>
  );
}
