import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import type { DropPosition } from "./Column";
import { addCard, matchesSearch, moveCard } from "./board";
import { SEED_COLUMNS } from "./seed";
import type { CardData, ColumnId } from "./types";

export default function App() {
  const [columns, setColumns] = useState(SEED_COLUMNS);
  const [search, setSearch] = useState("");

  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingSourceColumn, setDraggingSourceColumn] = useState<ColumnId | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<ColumnId | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<DropPosition | null>(null);

  const resetDragState = () => {
    setDraggingCardId(null);
    setDraggingSourceColumn(null);
    setDragOverColumnId(null);
    setDragOverCardId(null);
    setDragOverPosition(null);
  };

  const handleCardDragStart = (card: CardData, columnId: ColumnId) => {
    setDraggingCardId(card.id);
    setDraggingSourceColumn(columnId);
  };

  const handleCardDragOver = (
    e: DragEvent<HTMLDivElement>,
    columnId: ColumnId,
    cardId: string,
  ) => {
    if (!draggingCardId) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position: DropPosition = e.clientY < midpoint ? "before" : "after";
    setDragOverColumnId(columnId);
    setDragOverCardId(cardId);
    setDragOverPosition(position);
  };

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    if (!draggingCardId) return;
    e.preventDefault();
    // Only bubbles here when not already claimed by a more specific card-level dragover
    // (that handler calls stopPropagation), so this means "hovering empty column space" —
    // treat it as "append at the end."
    setDragOverColumnId(columnId);
    setDragOverCardId(null);
    setDragOverPosition(null);
  };

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    e.preventDefault();
    if (draggingCardId && draggingSourceColumn) {
      setColumns((prev) =>
        moveCard(
          prev,
          draggingCardId,
          draggingSourceColumn,
          columnId,
          dragOverCardId,
          dragOverPosition ?? "after",
        ),
      );
    }
    resetDragState();
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setColumns((prev) => addCard(prev, columnId, title));
  };

  return (
    <Box style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Stack gap="lg">
        <Stack direction="row" align="center" justify="between">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
        </Stack>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards by title…"
          aria-label="Search cards"
          style={{ maxWidth: 360 }}
        />
        <Stack direction="row" gap="lg" align="start">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              visibleCards={column.cards.filter((card) => matchesSearch(card, search))}
              draggingCardId={draggingCardId}
              dragOverColumnId={dragOverColumnId}
              dragOverCardId={dragOverCardId}
              dragOverPosition={dragOverPosition}
              atCap={Boolean(column.cap && column.cards.length >= column.cap)}
              onAddCard={handleAddCard}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={resetDragState}
              onCardDragOver={handleCardDragOver}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
