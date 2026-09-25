import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { COLUMNS, SEED_CARDS } from "./seed";
import type { CardData, ColumnId } from "./types";

type Board = Record<ColumnId, CardData[]>;

interface DragState {
  cardId: string;
  fromColumn: ColumnId;
}

interface DropTarget {
  columnId: ColumnId;
  index: number;
}

function makeId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [board, setBoard] = useState<Board>(SEED_CARDS);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const visibleIds = useMemo(() => {
    const query = search.trim().toLowerCase();
    const ids = new Set<string>();
    if (!query) {
      for (const list of Object.values(board)) {
        for (const card of list) ids.add(card.id);
      }
      return ids;
    }
    for (const list of Object.values(board)) {
      for (const card of list) {
        if (card.title.toLowerCase().includes(query)) ids.add(card.id);
      }
    }
    return ids;
  }, [board, search]);

  const handleDragStartCard = (event: DragEvent<HTMLDivElement>, cardId: string, fromColumn: ColumnId) => {
    setDrag({ cardId, fromColumn });
    event.dataTransfer.effectAllowed = "move";
    // Firefox requires data to be set for drag to start.
    event.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragEnd = () => {
    setDrag(null);
    setDropTarget(null);
  };

  const handleDragOverCard = (event: DragEvent<HTMLDivElement>, columnId: ColumnId, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    if (!drag) return;
    setDropTarget({ columnId, index });
  };

  const handleDragOverColumn = (event: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    event.preventDefault();
    if (!drag) return;
    setDropTarget({ columnId, index: board[columnId].length });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    event.preventDefault();
    const activeDrag = drag;
    const target = dropTarget ?? { columnId, index: board[columnId].length };
    setDrag(null);
    setDropTarget(null);
    if (!activeDrag) return;

    const { cardId, fromColumn } = activeDrag;

    setBoard((prev) => {
      const sourceList = [...prev[fromColumn]];
      const sourceIndex = sourceList.findIndex((c) => c.id === cardId);
      if (sourceIndex === -1) return prev;
      const [movingCard] = sourceList.splice(sourceIndex, 1);

      if (fromColumn === target.columnId) {
        let insertIndex = target.index;
        if (sourceIndex < insertIndex) insertIndex -= 1;
        insertIndex = Math.max(0, Math.min(insertIndex, sourceList.length));
        sourceList.splice(insertIndex, 0, movingCard);
        return { ...prev, [fromColumn]: sourceList };
      }

      const destColumnMeta = COLUMNS.find((c) => c.id === target.columnId);
      const destList = [...prev[target.columnId]];
      if (destColumnMeta?.cap !== undefined && destList.length >= destColumnMeta.cap) {
        // Reject the drop: column is at its soft cap.
        return prev;
      }
      const insertIndex = Math.max(0, Math.min(target.index, destList.length));
      destList.splice(insertIndex, 0, movingCard);
      return { ...prev, [fromColumn]: sourceList, [target.columnId]: destList };
    });
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setBoard((prev) => {
      const columnMeta = COLUMNS.find((c) => c.id === columnId);
      const list = prev[columnId];
      if (columnMeta?.cap !== undefined && list.length >= columnMeta.cap) {
        return prev;
      }
      const newCard: CardData = {
        id: makeId(),
        title,
        status: null,
        assignee: "?",
      };
      return { ...prev, [columnId]: [newCard, ...list] };
    });
  };

  return (
    <Stack direction="column" gap="lg" style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Sprint Board</h1>
      <Input
        placeholder="Search cards by title..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Search cards"
      />
      <Stack direction="row" gap="md" align="start">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={board[column.id]}
            visibleIds={visibleIds}
            draggingCardId={drag?.cardId ?? null}
            onDragStartCard={(event, cardId) => handleDragStartCard(event, cardId, column.id)}
            onDragEndCard={handleDragEnd}
            onDragOverCard={(event, index) => handleDragOverCard(event, column.id, index)}
            onDragOverColumn={(event) => handleDragOverColumn(event, column.id)}
            onDrop={(event) => handleDrop(event, column.id)}
            onAddCard={handleAddCard}
          />
        ))}
      </Stack>
    </Stack>
  );
}
