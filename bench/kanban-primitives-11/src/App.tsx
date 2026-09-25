// Sprint Board — built from Imitation/Synthetic-tier primitives only (Box, Stack, Card, Tag,
// Input, Button, Avatar). Drag-and-drop, search-filter, and add-card behavior are all hand-rolled
// here — see bench/KANBAN_BENCHMARK_SPEC.md.
import { useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { initialBoard, nextId } from "./data";
import { COLUMNS } from "./types";
import type { BoardState, ColumnId } from "./types";

export default function App() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [search, setSearch] = useState("");

  function moveCard(cardId: string, fromColumn: ColumnId, toColumn: ColumnId, beforeId: string | null) {
    setBoard((prev) => {
      const destCap = COLUMNS.find((c) => c.id === toColumn)?.cap;
      const isCrossColumn = fromColumn !== toColumn;

      // Reject a drop that would push a capped column over its limit. Reordering within the same
      // column never changes that column's count, so it's exempt from this check.
      if (isCrossColumn && destCap !== undefined && prev[toColumn].length >= destCap) {
        return prev;
      }

      const sourceList = [...prev[fromColumn]];
      const cardIndex = sourceList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [moved] = sourceList.splice(cardIndex, 1);

      const destList = isCrossColumn ? [...prev[toColumn]] : sourceList;
      let insertAt = destList.length;
      if (beforeId) {
        const beforeIndex = destList.findIndex((c) => c.id === beforeId);
        if (beforeIndex !== -1) insertAt = beforeIndex;
      }
      destList.splice(insertAt, 0, moved);

      if (!isCrossColumn) {
        return { ...prev, [fromColumn]: destList };
      }
      return { ...prev, [fromColumn]: sourceList, [toColumn]: destList };
    });
  }

  function addCard(columnId: ColumnId, title: string) {
    setBoard((prev) => {
      const cap = COLUMNS.find((c) => c.id === columnId)?.cap;
      if (cap !== undefined && prev[columnId].length >= cap) return prev;
      const newCard = {
        id: nextId(),
        title,
        description: undefined,
        status: null,
        assignee: "?",
      };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  const query = search.trim().toLowerCase();

  return (
    <Box style={{ padding: 24, maxWidth: 1120, margin: "0 auto" }}>
      <Stack gap="lg">
        <Stack gap="sm">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            placeholder="Search cards by title…"
            aria-label="Search cards"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
          {COLUMNS.map((meta) => {
            const fullCards = board[meta.id];
            const visibleCards = query
              ? fullCards.filter((c) => c.title.toLowerCase().includes(query))
              : fullCards;
            return (
              <Column
                key={meta.id}
                meta={meta}
                fullCards={fullCards}
                visibleCards={visibleCards}
                onDropCard={moveCard}
                onAddCard={addCard}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
