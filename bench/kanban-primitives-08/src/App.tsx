import { useMemo, useRef, useState } from "react";
import { Box, Stack, Input } from "rebar-ui";
import { Column } from "./Column";
import { SEED_BOARD } from "./data";
import { COLUMNS, COLUMN_CAP } from "./types";
import type { Board, CardData, ColumnId } from "./types";

interface DragOverInfo {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<Board>(SEED_BOARD);
  const [search, setSearch] = useState("");
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [overInfo, setOverInfo] = useState<DragOverInfo | null>(null);
  const nextId = useRef(6);

  const visibleIds = useMemo(() => {
    const query = search.trim().toLowerCase();
    const ids = new Set<string>();
    for (const column of COLUMNS) {
      for (const card of board[column.id]) {
        if (!query || card.title.toLowerCase().includes(query)) {
          ids.add(card.id);
        }
      }
    }
    return ids;
  }, [search, board]);

  const moveCard = (cardId: string, toColumn: ColumnId, toIndex: number) => {
    setBoard((prev) => {
      let fromColumn: ColumnId | null = null;
      let card: CardData | null = null;
      for (const column of COLUMNS) {
        const idx = prev[column.id].findIndex((c) => c.id === cardId);
        if (idx !== -1) {
          fromColumn = column.id;
          card = prev[column.id][idx];
          break;
        }
      }
      if (!fromColumn || !card) return prev;

      const isSameColumn = fromColumn === toColumn;
      const cap = COLUMN_CAP[toColumn];
      // Only a cross-column move actually grows the destination column's count — a same-column
      // reorder can't push it over its own cap.
      if (!isSameColumn && cap !== undefined && prev[toColumn].length >= cap) {
        return prev;
      }

      const sourceList = prev[fromColumn].filter((c) => c.id !== cardId);
      let insertIndex = toIndex;

      if (isSameColumn) {
        const originalIndex = prev[fromColumn].findIndex((c) => c.id === cardId);
        if (originalIndex < toIndex) insertIndex = toIndex - 1;
        const destList = [...sourceList];
        insertIndex = Math.max(0, Math.min(insertIndex, destList.length));
        destList.splice(insertIndex, 0, card);
        return { ...prev, [toColumn]: destList };
      }

      const destList = [...prev[toColumn]];
      insertIndex = Math.max(0, Math.min(insertIndex, destList.length));
      destList.splice(insertIndex, 0, card);
      return { ...prev, [fromColumn]: sourceList, [toColumn]: destList };
    });
  };

  const addCard = (column: ColumnId, title: string) => {
    setBoard((prev) => {
      const cap = COLUMN_CAP[column];
      if (cap !== undefined && prev[column].length >= cap) return prev;
      const newCard: CardData = {
        id: `c${nextId.current++}`,
        title,
        status: null,
        assignee: "?",
      };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  };

  const handleCardDragStart = (cardId: string) => {
    setDragCardId(cardId);
  };

  const handleCardDragEnd = () => {
    setDragCardId(null);
    setOverInfo(null);
  };

  const handleCardDragOver = (column: ColumnId, index: number) => {
    setOverInfo({ column, index });
  };

  const handleColumnDragOver = (column: ColumnId) => {
    setOverInfo((prev) => {
      if (prev && prev.column === column) return prev;
      return { column, index: board[column].length };
    });
  };

  const handleDrop = (column: ColumnId) => {
    if (!dragCardId) return;
    const targetIndex = overInfo && overInfo.column === column ? overInfo.index : board[column].length;
    moveCard(dragCardId, column, targetIndex);
    setDragCardId(null);
    setOverInfo(null);
  };

  return (
    <Box style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Stack gap="md">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          size="md"
          placeholder="Search cards…"
          aria-label="Search cards"
          data-testid="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Stack direction="row" gap="lg" style={{ alignItems: "flex-start" }}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              columnId={column.id}
              title={column.title}
              cards={board[column.id]}
              visibleIds={visibleIds}
              cap={COLUMN_CAP[column.id]}
              dragCardId={dragCardId}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onCardDragOver={handleCardDragOver}
              onColumnDragOver={handleColumnDragOver}
              onDrop={handleDrop}
              onAddCard={addCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
