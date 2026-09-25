import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { BoardColumn } from "./BoardColumn";
import type { DropTarget } from "./BoardColumn";
import { initialColumns } from "./seedData";
import type { ColumnData, ColumnId } from "./types";
import { generateId } from "./utils";

interface DragState {
  cardId: string;
  fromColumnId: ColumnId;
}

/** Sprint Board built entirely from Imitation/Synthetic-tier primitives (`Box`, `Stack`, `Card`
 * via `SprintCard`, `Tag`, `Input`, `Button`, `Avatar`) — no `Kanban` import, no DSL. All
 * drag-and-drop, search-filter, and add-card behavior is hand-rolled React state below. */
export default function App() {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const handleCardDragStart = (event: DragEvent<HTMLDivElement>, cardId: string, fromColumnId: ColumnId) => {
    event.dataTransfer.effectAllowed = "move";
    setDragState({ cardId, fromColumnId });
  };

  const handleCardDragOver = (event: DragEvent<HTMLDivElement>, columnId: ColumnId, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const isBeforeHalf = event.clientY < rect.top + rect.height / 2;
    setDropTarget({ columnId, index: isBeforeHalf ? index : index + 1 });
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    event.preventDefault();
    setDropTarget((prev) => {
      if (prev && prev.columnId === columnId) return prev;
      const column = columns.find((c) => c.id === columnId);
      return { columnId, index: column ? column.cards.length : 0 };
    });
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDropTarget(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetColumnId: ColumnId) => {
    event.preventDefault();
    const drag = dragState;
    const target = dropTarget?.columnId === targetColumnId ? dropTarget : null;
    setDragState(null);
    setDropTarget(null);
    if (!drag) return;

    setColumns((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === drag.fromColumnId);
      const toIndex = prev.findIndex((c) => c.id === targetColumnId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const cardIndex = prev[fromIndex].cards.findIndex((c) => c.id === drag.cardId);
      if (cardIndex === -1) return prev;

      // Same-column reorder: no net card count change, so the cap never blocks this.
      if (fromIndex === toIndex) {
        const cards = [...prev[fromIndex].cards];
        const [moved] = cards.splice(cardIndex, 1);
        let insertAt = target ? target.index : cards.length;
        if (insertAt > cardIndex) insertAt -= 1;
        insertAt = Math.max(0, Math.min(insertAt, cards.length));
        cards.splice(insertAt, 0, moved);
        const next = [...prev];
        next[fromIndex] = { ...prev[fromIndex], cards };
        return next;
      }

      const toColumn = prev[toIndex];
      // Reject a cross-column drop that would exceed the target's soft cap.
      if (toColumn.cap != null && toColumn.cards.length >= toColumn.cap) {
        return prev;
      }

      const fromCards = [...prev[fromIndex].cards];
      const [moved] = fromCards.splice(cardIndex, 1);
      const toCards = [...toColumn.cards];
      const insertAt = Math.max(0, Math.min(target ? target.index : toCards.length, toCards.length));
      toCards.splice(insertAt, 0, moved);

      const next = [...prev];
      next[fromIndex] = { ...prev[fromIndex], cards: fromCards };
      next[toIndex] = { ...toColumn, cards: toCards };
      return next;
    });
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) return column;
        if (column.cap != null && column.cards.length >= column.cap) return column;
        return {
          ...column,
          cards: [
            { id: generateId(), title, status: null, assignee: "?" },
            ...column.cards,
          ],
        };
      }),
    );
  };

  return (
    <Box style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stack direction="column" gap="xs">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 320 }}
          aria-label="Search cards"
        />
      </Stack>

      <Stack direction="row" gap="lg" align="start" style={{ overflowX: "auto" }}>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            search={search}
            draggedCardId={dragState?.cardId ?? null}
            dropTarget={dropTarget}
            onCardDragStart={handleCardDragStart}
            onCardDragOver={handleCardDragOver}
            onColumnDragOver={handleColumnDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onAddCard={handleAddCard}
          />
        ))}
      </Stack>
    </Box>
  );
}
