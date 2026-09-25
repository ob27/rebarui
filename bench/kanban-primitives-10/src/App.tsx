import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { createSeedBoard } from "./seedData";
import { COLUMNS } from "./types";
import type { BoardState, CardData, ColumnId } from "./types";

function genId() {
  return `card-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function findColumnOfCard(board: BoardState, cardId: string): ColumnId | null {
  for (const column of COLUMNS) {
    if (board[column.id].some((c) => c.id === cardId)) return column.id;
  }
  return null;
}

interface DropTarget {
  columnId: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(createSeedBoard);
  const [search, setSearch] = useState("");
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const query = search.trim().toLowerCase();

  const resetDrag = () => {
    setDragCardId(null);
    setDropTarget(null);
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setBoard((prev) => {
      const column = COLUMNS.find((c) => c.id === columnId)!;
      if (column.cap && prev[columnId].length >= column.cap) return prev;
      const newCard: CardData = { id: genId(), title, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  };

  const handleCardDragStart = (event: DragEvent<HTMLDivElement>, cardId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
    setDragCardId(cardId);
  };

  const handleCardDragEnd = () => {
    resetDrag();
  };

  const handleCardDragOver = (
    event: DragEvent<HTMLDivElement>,
    columnId: ColumnId,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setDropTarget({ columnId, index: isAfter ? index + 1 : index });
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    event.preventDefault();
    setDropTarget({ columnId, index: board[columnId].length });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    event.preventDefault();
    const cardId = dragCardId ?? event.dataTransfer.getData("text/plain");
    const target = dropTarget;
    resetDrag();
    if (!cardId) return;

    setBoard((prev) => {
      const sourceColumnId = findColumnOfCard(prev, cardId);
      if (!sourceColumnId) return prev;

      const movingAcrossColumns = sourceColumnId !== columnId;
      const destColumnMeta = COLUMNS.find((c) => c.id === columnId)!;
      if (
        movingAcrossColumns &&
        destColumnMeta.cap &&
        prev[columnId].length >= destColumnMeta.cap
      ) {
        // Reject: dropping into a capped column that's already full.
        return prev;
      }

      const sourceList = [...prev[sourceColumnId]];
      const cardIndex = sourceList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [card] = sourceList.splice(cardIndex, 1);

      let insertAt = target?.index ?? (movingAcrossColumns ? prev[columnId].length : sourceList.length);
      const destList = movingAcrossColumns ? [...prev[columnId]] : sourceList;

      if (!movingAcrossColumns && cardIndex < insertAt) {
        insertAt -= 1;
      }
      insertAt = Math.max(0, Math.min(insertAt, destList.length));
      destList.splice(insertAt, 0, card);

      return {
        ...prev,
        [sourceColumnId]: movingAcrossColumns ? sourceList : destList,
        [columnId]: destList,
      };
    });
  };

  return (
    <Box style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Stack gap="lg">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search cards"
          style={{ maxWidth: 320 }}
        />
        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((column) => {
            const cards = board[column.id];
            const visibleCards = query
              ? cards.filter((c) => c.title.toLowerCase().includes(query))
              : cards;
            const isAtCap = !!column.cap && cards.length >= column.cap;
            return (
              <Column
                key={column.id}
                column={column}
                cards={cards}
                visibleCards={visibleCards}
                isAtCap={isAtCap}
                dragCardId={dragCardId}
                dropTarget={dropTarget}
                onAddCard={(title) => handleAddCard(column.id, title)}
                onCardDragStart={handleCardDragStart}
                onCardDragEnd={handleCardDragEnd}
                onCardDragOver={(event, index) => handleCardDragOver(event, column.id, index)}
                onColumnDragOver={(event) => handleColumnDragOver(event, column.id)}
                onDrop={(event) => handleDrop(event, column.id)}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
