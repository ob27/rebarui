import type { DragEvent } from "react";
import { Box, Stack } from "rebar-ui";
import { AddCardInline } from "./AddCardInline";
import { CardItem } from "./CardItem";
import type { CardData, ColumnMeta } from "./types";

export interface ColumnProps {
  column: ColumnMeta;
  cards: CardData[];
  visibleCards: CardData[];
  isAtCap: boolean;
  dragCardId: string | null;
  dropTarget: { columnId: string; index: number } | null;
  onAddCard: (title: string) => void;
  onCardDragStart: (event: DragEvent<HTMLDivElement>, cardId: string) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onColumnDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function Column({
  column,
  cards,
  visibleCards,
  isAtCap,
  dragCardId,
  dropTarget,
  onAddCard,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
}: ColumnProps) {
  const visibleIds = new Set(visibleCards.map((c) => c.id));

  return (
    <Box
      style={{
        flex: 1,
        minWidth: 0,
        background: "var(--rebar-color-surface-subtle, #f5f5f5)",
        borderRadius: 8,
        padding: 12,
      }}
      onDragOver={onColumnDragOver}
      onDrop={onDrop}
      data-testid={`column-${column.id}`}
    >
      <Stack direction="row" justify="between" align="center" style={{ marginBottom: 8 }}>
        <strong>{column.title}</strong>
        <span data-testid={`column-count-${column.id}`}>
          {column.cap ? `${cards.length}/${column.cap}` : cards.length}
        </span>
      </Stack>

      <div style={{ marginBottom: 8 }}>
        <AddCardInline onAdd={onAddCard} disabled={isAtCap} />
      </div>

      <Stack gap="sm">
        {cards.map((card, index) =>
          visibleIds.has(card.id) ? (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              isDragging={dragCardId === card.id}
              isDropTarget={dropTarget?.columnId === column.id && dropTarget?.index === index}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              onDragOver={onCardDragOver}
            />
          ) : null,
        )}
      </Stack>
    </Box>
  );
}
