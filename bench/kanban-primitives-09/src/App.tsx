import { useMemo, useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { COLUMNS, initialBoard } from "./data";
import { BoardColumn } from "./BoardColumn";
import type { BoardState, CardData, ColumnId } from "./types";

function newCardId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface DragInfo {
  cardId: string;
  fromColumn: ColumnId;
}

interface DropTarget {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [query, setQuery] = useState("");
  const [drag, setDrag] = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const columnCap = useMemo(
    () => Object.fromEntries(COLUMNS.map((c) => [c.id, c.cap])) as Record<ColumnId, number | undefined>,
    [],
  );

  const filteredBoard = useMemo<BoardState>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return board;
    const entries = COLUMNS.map((col) => [
      col.id,
      board[col.id].filter((card) => card.title.toLowerCase().includes(q)),
    ] as const);
    return Object.fromEntries(entries) as BoardState;
  }, [board, query]);

  const handleAddCard = (column: ColumnId, title: string) => {
    setBoard((prev) => {
      const cap = columnCap[column];
      if (cap !== undefined && prev[column].length >= cap) return prev;
      const card: CardData = { id: newCardId(), title, status: null, assignee: "?" };
      return { ...prev, [column]: [card, ...prev[column]] };
    });
  };

  const moveCard = (cardId: string, fromColumn: ColumnId, toColumn: ColumnId, toIndex: number) => {
    setBoard((prev) => {
      if (fromColumn === toColumn) {
        const list = [...prev[fromColumn]];
        const fromIdx = list.findIndex((c) => c.id === cardId);
        if (fromIdx === -1) return prev;
        let target = toIndex;
        if (fromIdx < target) target -= 1;
        const [card] = list.splice(fromIdx, 1);
        target = Math.max(0, Math.min(target, list.length));
        list.splice(target, 0, card);
        return { ...prev, [fromColumn]: list };
      }

      const cap = columnCap[toColumn];
      if (cap !== undefined && prev[toColumn].length >= cap) return prev;

      const fromList = [...prev[fromColumn]];
      const fromIdx = fromList.findIndex((c) => c.id === cardId);
      if (fromIdx === -1) return prev;
      const [card] = fromList.splice(fromIdx, 1);

      const toList = [...prev[toColumn]];
      const target = Math.max(0, Math.min(toIndex, toList.length));
      toList.splice(target, 0, card);

      return { ...prev, [fromColumn]: fromList, [toColumn]: toList };
    });
  };

  const handleCardDragStart = (cardId: string, fromColumn: ColumnId) => {
    setDrag({ cardId, fromColumn });
  };

  const handleCardDragOver = (column: ColumnId, index: number) => {
    setDropTarget({ column, index });
  };

  const handleColumnDragOver = (column: ColumnId) => {
    setDropTarget((prev) => {
      if (prev && prev.column === column) return prev;
      return { column, index: board[column].length };
    });
  };

  const handleDrop = () => {
    if (drag && dropTarget) {
      moveCard(drag.cardId, drag.fromColumn, dropTarget.column, dropTarget.index);
    }
    setDrag(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDrag(null);
    setDropTarget(null);
  };

  return (
    <Box style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="lg">
        <strong style={{ fontSize: 20 }}>Sprint Board</strong>

        <Input
          placeholder="Search cards by title…"
          aria-label="Search cards"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              def={col}
              cards={board[col.id]}
              visibleCards={filteredBoard[col.id]}
              draggingCardId={drag?.cardId ?? null}
              onCardDragStart={handleCardDragStart}
              onCardDragOver={handleCardDragOver}
              onColumnDragOver={handleColumnDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onAddCard={handleAddCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
