import { useRef, useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { COLUMNS, INITIAL_CARDS } from "./seedData";
import type { CardData, ColumnId } from "./types";
import { Column } from "./Column";

const CAPS: Partial<Record<ColumnId, number>> = { inprogress: 4 };

function makeCardId(): string {
  return `card-${Math.random().toString(36).slice(2, 10)}`;
}

interface DragCard {
  cardId: string;
  from: ColumnId;
}

interface DropTarget {
  column: ColumnId;
  /** Index in the target column's real (unfiltered) array to insert before. */
  index: number;
}

// Drag/drop, search-filter and add-card are hand-written state and event handling here — only
// the static per-card visual shell (Card/Tag/Avatar/Stack/etc, in Column.tsx and CardItem.tsx)
// is pre-built Synthetic-tier composition, per this benchmark condition's constraint.
export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(INITIAL_CARDS);
  const [search, setSearch] = useState("");
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

  // Drag state lives in refs, not React state: it changes on every pointermove-driven dragover
  // and never needs to trigger a re-render by itself — only the drop (or the dragOverColumn
  // highlight) does.
  const dragCardRef = useRef<DragCard | null>(null);
  const dropTargetRef = useRef<DropTarget | null>(null);

  function handleCardDragStart(column: ColumnId, cardId: string) {
    dragCardRef.current = { cardId, from: column };
  }

  function handleCardDragOver(column: ColumnId, index: number, before: boolean) {
    dropTargetRef.current = { column, index: before ? index : index + 1 };
    setDragOverColumn(column);
  }

  function handleColumnDragOver(column: ColumnId) {
    // Only fires for empty column space (below/around cards) — CardItem stops propagation so
    // this never overrides a more precise per-card target.
    dropTargetRef.current = { column, index: columns[column].length };
    setDragOverColumn(column);
  }

  function resetDrag() {
    dragCardRef.current = null;
    dropTargetRef.current = null;
    setDragOverColumn(null);
  }

  function handleDrop() {
    const drag = dragCardRef.current;
    const target = dropTargetRef.current;
    resetDrag();
    if (!drag || !target) return;

    setColumns((prev) => {
      const { cardId, from } = drag;
      const { column: to, index: rawIndex } = target;
      const sourceArr = prev[from];
      const sourceIndex = sourceArr.findIndex((c) => c.id === cardId);
      if (sourceIndex === -1) return prev;
      const card = sourceArr[sourceIndex];

      if (from === to) {
        let index = rawIndex;
        if (index > sourceIndex) index -= 1;
        if (index === sourceIndex) return prev; // dropped back where it started
        const next = [...sourceArr];
        next.splice(sourceIndex, 1);
        next.splice(index, 0, card);
        return { ...prev, [from]: next };
      }

      const destArr = prev[to];
      const cap = CAPS[to];
      if (cap != null && destArr.length >= cap) return prev; // reject: would exceed the cap

      const nextSource = [...sourceArr];
      nextSource.splice(sourceIndex, 1);
      const nextDest = [...destArr];
      nextDest.splice(Math.min(rawIndex, nextDest.length), 0, card);
      return { ...prev, [from]: nextSource, [to]: nextDest };
    });
  }

  function handleAddCard(column: ColumnId, title: string) {
    setColumns((prev) => {
      const cap = CAPS[column];
      if (cap != null && prev[column].length >= cap) return prev; // reject: would exceed the cap
      const card: CardData = { id: makeCardId(), title, assignee: "?" };
      return { ...prev, [column]: [card, ...prev[column]] };
    });
  }

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack gap="md">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          size="md"
          placeholder="Search cards by title..."
          aria-label="Search cards"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              cap={col.cap}
              cards={columns[col.id]}
              search={search}
              isDragOver={dragOverColumn === col.id}
              onAddCard={(title) => handleAddCard(col.id, title)}
              onCardDragStart={(cardId) => handleCardDragStart(col.id, cardId)}
              onCardDragOver={(index, before) => handleCardDragOver(col.id, index, before)}
              onColumnDragOver={() => handleColumnDragOver(col.id)}
              onDrop={handleDrop}
              onCardDragEnd={resetDrag}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
