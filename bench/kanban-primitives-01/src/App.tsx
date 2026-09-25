import { useState } from "react";
import type { DragEvent } from "react";
import { Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { COLUMNS, createInitialBoard, nextId } from "./seed";
import type { BoardState, ColumnId, DragInfo, DropIndicator } from "./types";
import "./App.css";

export default function App() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState<DragInfo | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

  /** Would dropping/moving the currently-dragged card into `targetColumn` exceed its soft cap?
   * Reordering within the same column never changes that column's count, so it's always allowed. */
  const isRejected = (targetColumn: ColumnId): boolean => {
    if (!dragging) return false;
    const column = COLUMNS.find((c) => c.id === targetColumn);
    if (!column?.cap) return false;
    if (dragging.fromColumn === targetColumn) return false;
    return board[targetColumn].length >= column.cap;
  };

  const handleDragStart = (cardId: string, fromColumn: ColumnId) => {
    setDragging({ cardId, fromColumn });
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDropIndicator(null);
  };

  const handleCardDragOver = (e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) return;
    if (isRejected(column)) {
      e.dataTransfer.dropEffect = "none";
      setDropIndicator(null);
      return;
    }
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const isBeforeMidpoint = e.clientY < rect.top + rect.height / 2;
    setDropIndicator({ column, index: isBeforeMidpoint ? index : index + 1 });
  };

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, column: ColumnId) => {
    e.preventDefault();
    if (!dragging) return;
    if (isRejected(column)) {
      e.dataTransfer.dropEffect = "none";
      return;
    }
    e.dataTransfer.dropEffect = "move";
    setDropIndicator((prev) => (prev?.column === column ? prev : { column, index: board[column].length }));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumn: ColumnId) => {
    e.preventDefault();
    if (!dragging) return;
    const { cardId, fromColumn } = dragging;

    if (isRejected(targetColumn)) {
      setDragging(null);
      setDropIndicator(null);
      return;
    }

    setBoard((prev) => {
      const sourceList = [...prev[fromColumn]];
      const cardIndex = sourceList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [card] = sourceList.splice(cardIndex, 1);

      let insertIndex = dropIndicator?.column === targetColumn ? dropIndicator.index : prev[targetColumn].length;

      if (fromColumn === targetColumn) {
        if (insertIndex > cardIndex) insertIndex -= 1;
        insertIndex = Math.max(0, Math.min(insertIndex, sourceList.length));
        sourceList.splice(insertIndex, 0, card);
        return { ...prev, [targetColumn]: sourceList };
      }

      const targetList = [...prev[targetColumn]];
      insertIndex = Math.max(0, Math.min(insertIndex, targetList.length));
      targetList.splice(insertIndex, 0, card);
      return { ...prev, [fromColumn]: sourceList, [targetColumn]: targetList };
    });

    setDragging(null);
    setDropIndicator(null);
  };

  const handleAddCard = (column: ColumnId, title: string) => {
    setBoard((prev) => {
      const columnDef = COLUMNS.find((c) => c.id === column);
      if (columnDef?.cap && prev[column].length >= columnDef.cap) return prev;
      return { ...prev, [column]: [{ id: nextId(), title }, ...prev[column]] };
    });
  };

  return (
    <div className="sprint-board-page">
      <Stack direction="column" gap="md" className="sprint-board-header">
        <h1 className="sprint-board-title">Sprint Board</h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards by title…"
          aria-label="Search cards"
          className="sprint-search-input"
        />
      </Stack>

      <div className="sprint-board-columns">
        {COLUMNS.map((def) => (
          <Column
            key={def.id}
            def={def}
            cards={board[def.id]}
            search={search}
            dragging={dragging}
            dropIndicator={dropIndicator}
            rejected={isRejected(def.id)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCardDragOver={handleCardDragOver}
            onColumnDragOver={handleColumnDragOver}
            onDrop={handleDrop}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
    </div>
  );
}
