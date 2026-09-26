import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { COLUMN_DEFS, INITIAL_COLUMNS } from "./seedData";
import type { CardData, ColumnId, ColumnsState } from "./types";
import { Column } from "./Column";

const COLUMN_CAPS: Partial<Record<ColumnId, number>> = Object.fromEntries(
  COLUMN_DEFS.filter((def) => def.cap !== undefined).map((def) => [def.id, def.cap as number]),
);

interface DragState {
  cardId: string;
  sourceColumnId: ColumnId;
}

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(INITIAL_COLUMNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const nextId = useRef(1);

  const makeCardId = useCallback(() => {
    const id = `card-${nextId.current}`;
    nextId.current += 1;
    return id;
  }, []);

  /** The one place that actually mutates board state on a drop — used by both card-level drops
   * (reorder / insert-before) and column-level drops (append to end of an empty area). Rejects
   * (no state change at all) rather than clamping, when a cross-column move would exceed a
   * column's cap. */
  const moveCard = useCallback(
    (cardId: string, sourceColumnId: ColumnId, targetColumnId: ColumnId, beforeCardId: string | null) => {
      setColumns((prev) => {
        const source = [...prev[sourceColumnId]];
        const cardIndex = source.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;
        const [card] = source.splice(cardIndex, 1);

        const isSameColumn = sourceColumnId === targetColumnId;
        const targetBase = isSameColumn ? source : [...prev[targetColumnId]];

        if (!isSameColumn) {
          const cap = COLUMN_CAPS[targetColumnId];
          if (cap !== undefined && targetBase.length >= cap) {
            // Reject the drop entirely: don't move the card anywhere.
            return prev;
          }
        }

        let insertAt = targetBase.length;
        if (beforeCardId) {
          const beforeIndex = targetBase.findIndex((c) => c.id === beforeCardId);
          if (beforeIndex !== -1) insertAt = beforeIndex;
        }
        targetBase.splice(insertAt, 0, card);

        if (isSameColumn) {
          return { ...prev, [sourceColumnId]: targetBase };
        }
        return { ...prev, [sourceColumnId]: source, [targetColumnId]: targetBase };
      });
    },
    [],
  );

  const handleCardDragStart = useCallback((e: DragEvent, card: CardData, columnId: ColumnId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id);
    setDragState({ cardId: card.id, sourceColumnId: columnId });
  }, []);

  const handleCardDragEnd = useCallback((_e: DragEvent) => {
    setDragState(null);
  }, []);

  const handleCardDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleCardDrop = useCallback(
    (e: DragEvent, targetCard: CardData, targetColumnId: ColumnId) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragState) return;
      moveCard(dragState.cardId, dragState.sourceColumnId, targetColumnId, targetCard.id);
      setDragState(null);
    },
    [dragState, moveCard],
  );

  const handleColumnDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleColumnDrop = useCallback(
    (e: DragEvent, targetColumnId: ColumnId) => {
      e.preventDefault();
      if (!dragState) return;
      moveCard(dragState.cardId, dragState.sourceColumnId, targetColumnId, null);
      setDragState(null);
    },
    [dragState, moveCard],
  );

  const handleAddCard = useCallback(
    (columnId: ColumnId, title: string) => {
      setColumns((prev) => {
        const cap = COLUMN_CAPS[columnId];
        if (cap !== undefined && prev[columnId].length >= cap) return prev;
        const newCard: CardData = {
          id: makeCardId(),
          title,
          assignee: "?",
        };
        return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
      });
    },
    [makeCardId],
  );

  return (
    <Box style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="sm">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            placeholder="Search cards by title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search cards"
            data-testid="search-input"
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="md" align="start" style={{ overflowX: "auto" }}>
          {COLUMN_DEFS.map((def) => (
            <Column
              key={def.id}
              def={def}
              cards={columns[def.id]}
              searchQuery={searchQuery}
              draggedCardId={dragState?.cardId ?? null}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onCardDragOver={handleCardDragOver}
              onCardDrop={handleCardDrop}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onAddCard={handleAddCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
