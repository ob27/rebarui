import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { BoardColumn } from "./BoardColumn";
import { COLUMNS } from "./types";
import type { CardData, ColumnId } from "./types";
import { useBoardState } from "./useBoardState";

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface DragOverState {
  columnId: ColumnId;
  index: number;
}

// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this
// condition's constraint: Synthetic-tier shell components are fine, but no `Kanban` import — all
// drag-and-drop/search/add-card *behavior* below is hand-written).
export default function App() {
  const { columns, addCard, moveCard, isAtCap } = useBoardState();
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOver, setDragOver] = useState<DragOverState | null>(null);

  const canAcceptInto = (columnId: ColumnId): boolean => {
    if (!dragState) return false;
    // Reordering within the source column is always fine; a cross-column move is only fine if
    // the target isn't already at its soft cap.
    return dragState.from === columnId || !isAtCap(columnId);
  };

  const handleDragStartCard = (e: DragEvent, card: CardData, from: ColumnId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id);
    setDragState({ cardId: card.id, from });
  };

  const handleDragOverCard = (e: DragEvent, columnId: ColumnId, index: number) => {
    if (!canAcceptInto(columnId)) return; // no preventDefault -> browser shows "not allowed", drop won't fire
    e.preventDefault();
    e.stopPropagation(); // keep the column-level handler below from overwriting this with "append at end"
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    setDragOver({ columnId, index: before ? index : index + 1 });
  };

  const handleDragOverColumn = (e: DragEvent, columnId: ColumnId, length: number) => {
    if (!canAcceptInto(columnId)) return;
    e.preventDefault();
    setDragOver({ columnId, index: length });
  };

  const handleDrop = (e: DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    if (dragState && dragOver && dragOver.columnId === columnId) {
      moveCard(dragState.cardId, dragState.from, columnId, dragOver.index);
    }
    setDragState(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDragOver(null);
  };

  const query = search.trim().toLowerCase();

  return (
    <Box style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="xs">
        <h1 style={{ margin: 0, fontSize: 20 }}>Sprint Board</h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards by title..."
          aria-label="Search cards"
        />
      </Stack>

      <Stack direction="row" gap="lg" align="start" style={{ alignItems: "flex-start" }}>
        {COLUMNS.map((column) => {
          const full = columns[column.id];
          const visible = query ? full.filter((c) => c.title.toLowerCase().includes(query)) : full;
          return (
            <BoardColumn
              key={column.id}
              column={column}
              cards={full}
              visibleCards={visible}
              atCap={isAtCap(column.id)}
              draggingCardId={dragState?.cardId ?? null}
              isDragOverColumn={dragOver?.columnId === column.id}
              onDragStartCard={(e, card) => handleDragStartCard(e, card, column.id)}
              onDragOverCard={(e, index) => handleDragOverCard(e, column.id, index)}
              onDragOverColumn={(e) => handleDragOverColumn(e, column.id, full.length)}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragEnd={handleDragEnd}
              onAddCard={(title) => addCard(column.id, title)}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
