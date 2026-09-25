import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { isColumnFull, moveCard } from "./board";
import { createSeedBoard } from "./data";
import { COLUMN_ORDER } from "./types";
import type { BoardState, CardData, ColumnId, DropTarget } from "./types";

interface DragState {
  cardId: string;
  from: ColumnId;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(createSeedBoard);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const query = search.trim().toLowerCase();
  const visibleCardsFor = (cards: CardData[]): CardData[] =>
    query === "" ? cards : cards.filter((card) => card.title.toLowerCase().includes(query));

  const handleDragStartCard = (event: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) => {
    setDrag({ cardId, from });
    event.dataTransfer.effectAllowed = "move";
    // Firefox requires data actually be set for the drag to proceed; the value itself is unused
    // since all state lives in React (`drag`/`dropTarget`), not the dataTransfer payload.
    event.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOverCard = (event: DragEvent<HTMLDivElement>, cardId: string, column: ColumnId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!drag || drag.cardId === cardId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const position: DropTarget["position"] = offset < rect.height / 2 ? "before" : "after";
    setDropTarget({ column, cardId, position });
  };

  const handleDragOverColumn = (event: DragEvent<HTMLDivElement>, column: ColumnId) => {
    event.preventDefault();
    if (!drag) return;
    setDropTarget({ column, cardId: null, position: "after" });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, column: ColumnId) => {
    event.preventDefault();
    if (!drag) return;
    const target: DropTarget =
      dropTarget && dropTarget.column === column ? dropTarget : { column, cardId: null, position: "after" };
    setBoard((prev) => moveCard(prev, drag.cardId, drag.from, target));
    setDrag(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDrag(null);
    setDropTarget(null);
  };

  const handleAddCard = (column: ColumnId, title: string) => {
    setBoard((prev) => {
      if (isColumnFull(prev, column)) return prev;
      const newCard: CardData = {
        id: `card-${crypto.randomUUID()}`,
        title,
        assignee: "U",
      };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  };

  return (
    <Box as="main" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100 }}>
      <Box as="h1" style={{ margin: 0, fontSize: 22 }}>
        Sprint Board
      </Box>

      <Input
        aria-label="Search cards"
        data-testid="search-input"
        placeholder="Search cards by title..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{ maxWidth: 320 }}
      />

      <Stack direction="row" gap="md" align="start">
        {COLUMN_ORDER.map((columnId) => (
          <Column
            key={columnId}
            id={columnId}
            cards={board[columnId]}
            visibleCards={visibleCardsFor(board[columnId])}
            draggingCardId={drag?.cardId ?? null}
            dropTarget={dropTarget}
            onDragStartCard={(event, cardId) => handleDragStartCard(event, cardId, columnId)}
            onDragOverCard={(event, cardId) => handleDragOverCard(event, cardId, columnId)}
            onDragOverColumn={(event) => handleDragOverColumn(event, columnId)}
            onDrop={(event) => handleDrop(event, columnId)}
            onDragEnd={handleDragEnd}
            onAddCard={(title) => handleAddCard(columnId, title)}
          />
        ))}
      </Stack>
    </Box>
  );
}
