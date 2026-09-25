import { useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { COLUMNS } from "./types";
import type { CardData, ColumnId } from "./types";
import { SEED_CARDS } from "./seedData";
import Column from "./Column";

export default function App() {
  const [cards, setCards] = useState<CardData[]>(SEED_CARDS);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const columnCap = (columnId: ColumnId) => COLUMNS.find((c) => c.id === columnId)?.cap;

  const moveCard = (cardId: string, targetColumnId: ColumnId, beforeCardId: string | null) => {
    setCards((prev) => {
      const dragged = prev.find((c) => c.id === cardId);
      if (!dragged) return prev;

      const changingColumn = dragged.columnId !== targetColumnId;
      const cap = columnCap(targetColumnId);
      if (changingColumn && cap !== undefined) {
        const currentCount = prev.filter((c) => c.columnId === targetColumnId).length;
        if (currentCount >= cap) return prev; // reject: would exceed the cap
      }

      const without = prev.filter((c) => c.id !== cardId);
      const updated: CardData = { ...dragged, columnId: targetColumnId };

      if (beforeCardId === null) {
        return [...without, updated];
      }
      const idx = without.findIndex((c) => c.id === beforeCardId);
      if (idx === -1) return [...without, updated];
      return [...without.slice(0, idx), updated, ...without.slice(idx)];
    });
    setDraggedId(null);
  };

  const addCard = (columnId: ColumnId, title: string) => {
    setCards((prev) => {
      const cap = columnCap(columnId);
      if (cap !== undefined) {
        const currentCount = prev.filter((c) => c.columnId === columnId).length;
        if (currentCount >= cap) return prev; // reject: would exceed the cap
      }
      const newCard: CardData = {
        id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        columnId,
        title,
        assignee: "?",
      };
      const idx = prev.findIndex((c) => c.columnId === columnId);
      if (idx === -1) return [...prev, newCard];
      return [...prev.slice(0, idx), newCard, ...prev.slice(idx)];
    });
  };

  const matchesSearch = (card: CardData) =>
    card.title.toLowerCase().includes(search.trim().toLowerCase());

  return (
    <Box style={{ padding: "var(--rebar-space-xl, 32px)", maxWidth: 1100, margin: "0 auto" }}>
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="sm">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search cards"
          />
        </Stack>

        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((column) => {
            const allCards = cards.filter((c) => c.columnId === column.id);
            const visibleCards = allCards.filter(matchesSearch);
            return (
              <Column
                key={column.id}
                column={column}
                allCards={allCards}
                visibleCards={visibleCards}
                draggedId={draggedId}
                onDragStart={setDraggedId}
                onDragEnd={() => setDraggedId(null)}
                onDropBefore={moveCard}
                onAddCard={addCard}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
