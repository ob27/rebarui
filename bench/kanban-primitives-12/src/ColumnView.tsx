import { useRef } from "react";
import type { DragEvent } from "react";
import { Box, Stack } from "rebar-ui";
import { AddCardControl } from "./AddCardControl";
import { getDropIndex } from "./board";
import { SprintCardView } from "./SprintCardView";
import type { ColumnDef, ColumnId, SprintCard } from "./types";

interface ColumnViewProps {
  column: ColumnDef;
  allCards: SprintCard[];
  visibleCards: SprintCard[];
  draggingId: string | null;
  onDragStartCard: (id: string) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (columnId: ColumnId, index: number) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function ColumnView({
  column,
  allCards,
  visibleCards,
  draggingId,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onAddCard,
}: ColumnViewProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const atCap = column.cap !== undefined && allCards.length >= column.cap;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingId || !bodyRef.current) return;
    const index = getDropIndex(bodyRef.current, e.clientY, draggingId);
    onDragOverColumn(column.id, index);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      as="section"
      style={{
        flex: "1 1 0",
        minWidth: 240,
        display: "flex",
        flexDirection: "column",
        gap: "var(--rebar-space-sm, 8px)",
      }}
      aria-label={column.title}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{column.title}</strong>
        <span data-testid={`count-${column.id}`}>
          {column.cap !== undefined ? `${allCards.length}/${column.cap}` : allCards.length}
        </span>
      </Stack>

      <div
        ref={bodyRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--rebar-space-sm, 8px)",
          minHeight: 80,
          flex: "1 1 auto",
        }}
      >
        {visibleCards.map((card) => (
          <SprintCardView
            key={card.id}
            card={card}
            isDragging={draggingId === card.id}
            onDragStart={() => onDragStartCard(card.id)}
            onDragEnd={onDragEndCard}
          />
        ))}
      </div>

      <AddCardControl disabled={atCap} onAdd={(title) => onAddCard(column.id, title)} />
    </Box>
  );
}
