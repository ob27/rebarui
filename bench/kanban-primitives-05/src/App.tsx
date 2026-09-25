import { useState, type DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { COLUMNS, SEED_CARDS } from "./seedData";
import type { ColumnId, SprintCard } from "./types";

interface DragInfo {
  cardId: string;
  fromColumn: ColumnId;
}

interface DropTarget {
  column: string;
  index: number;
}

let nextCardId = 100;

export default function App() {
  const [cardsByColumn, setCardsByColumn] = useState<Record<ColumnId, SprintCard[]>>(
    SEED_CARDS as Record<ColumnId, SprintCard[]>,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  function handleCardDragStart(cardId: string, fromColumn: string) {
    setDragInfo({ cardId, fromColumn: fromColumn as ColumnId });
  }

  function handleCardDragEnd() {
    setDragInfo(null);
    setDropTarget(null);
  }

  function handleCardDragOver(e: DragEvent<HTMLDivElement>, column: string, index: number) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const newIndex = e.clientY < midpoint ? index : index + 1;
    setDropTarget((prev) =>
      prev && prev.column === column && prev.index === newIndex ? prev : { column, index: newIndex },
    );
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, column: string) {
    e.preventDefault();
    const cards = cardsByColumn[column as ColumnId];
    setDropTarget((prev) =>
      prev && prev.column === column && prev.index === cards.length ? prev : { column, index: cards.length },
    );
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, targetColumn: string) {
    e.preventDefault();
    if (!dragInfo || !dropTarget || dropTarget.column !== targetColumn) {
      setDragInfo(null);
      setDropTarget(null);
      return;
    }
    const { cardId, fromColumn } = dragInfo;
    const target = targetColumn as ColumnId;

    setCardsByColumn((prev) => {
      const sourceList = [...prev[fromColumn]];
      const sourceIndex = sourceList.findIndex((c) => c.id === cardId);
      if (sourceIndex === -1) return prev;

      const isSameColumn = fromColumn === target;
      const [movedCard] = sourceList.splice(sourceIndex, 1);
      const targetList = isSameColumn ? sourceList : [...prev[target]];

      const targetColDef = COLUMNS.find((c) => c.id === target);
      if (!isSameColumn && targetColDef?.cap !== undefined && targetList.length >= targetColDef.cap) {
        // Reject: would exceed the column's soft cap.
        return prev;
      }

      let insertIndex = dropTarget.index;
      if (isSameColumn && sourceIndex < insertIndex) {
        insertIndex -= 1;
      }
      insertIndex = Math.max(0, Math.min(insertIndex, targetList.length));
      targetList.splice(insertIndex, 0, movedCard);

      if (isSameColumn) {
        return { ...prev, [fromColumn]: targetList };
      }
      return { ...prev, [fromColumn]: sourceList, [target]: targetList };
    });

    setDragInfo(null);
    setDropTarget(null);
  }

  function handleAddCard(column: string, title: string): boolean {
    const colId = column as ColumnId;
    const colDef = COLUMNS.find((c) => c.id === colId);
    const current = cardsByColumn[colId];
    if (colDef?.cap !== undefined && current.length >= colDef.cap) {
      return false;
    }
    const newCard: SprintCard = {
      id: `card-${nextCardId++}`,
      title,
      status: null,
      assignee: "?",
    };
    setCardsByColumn((prev) => ({ ...prev, [colId]: [newCard, ...prev[colId]] }));
    return true;
  }

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack direction="column" gap="lg">
        <h1>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search cards"
        />
        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={cardsByColumn[column.id]}
              searchQuery={searchQuery}
              draggedCardId={dragInfo?.cardId ?? null}
              dropTarget={dropTarget}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onCardDragOver={handleCardDragOver}
              onColumnDragOver={handleColumnDragOver}
              onDrop={handleDrop}
              onAddCard={handleAddCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
