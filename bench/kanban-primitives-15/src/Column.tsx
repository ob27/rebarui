import type { DragEvent } from "react";
import { Box, Stack } from "rebar-ui";
import { AddCardForm } from "./AddCardForm";
import { CardItem } from "./CardItem";
import { COLUMN_CAPS, COLUMN_TITLES } from "./types";
import type { CardData, ColumnId, DropTarget } from "./types";

export interface ColumnProps {
  id: ColumnId;
  /** The column's true, unfiltered cards — drives the count/cap badge and drop-target math. */
  cards: CardData[];
  /** The subset of `cards` that survive the active search filter — what actually renders. */
  visibleCards: CardData[];
  draggingCardId: string | null;
  dropTarget: DropTarget | null;
  onDragStartCard: (event: DragEvent<HTMLDivElement>, cardId: string) => void;
  onDragOverCard: (event: DragEvent<HTMLDivElement>, cardId: string) => void;
  onDragOverColumn: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onAddCard: (title: string) => void;
}

export function Column({
  id,
  cards,
  visibleCards,
  draggingCardId,
  dropTarget,
  onDragStartCard,
  onDragOverCard,
  onDragOverColumn,
  onDrop,
  onDragEnd,
  onAddCard,
}: ColumnProps) {
  const cap = COLUMN_CAPS[id];
  const atCap = cap !== undefined && cards.length >= cap;
  const countLabel = cap !== undefined ? `${cards.length}/${cap}` : `${cards.length}`;
  const showEndIndicator = dropTarget !== null && dropTarget.column === id && dropTarget.cardId === null;

  return (
    <Box
      as="section"
      aria-label={COLUMN_TITLES[id]}
      style={{
        flex: "1 1 0",
        minWidth: 240,
        display: "flex",
        flexDirection: "column",
        background: "var(--rebar-color-surface-sunken, #f4f4f5)",
        borderRadius: 8,
        padding: 12,
        gap: 12,
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <Box as="h3" style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
          {COLUMN_TITLES[id]}
        </Box>
        <Box
          as="span"
          data-testid={`column-count-${id}`}
          style={{ fontSize: 12, color: atCap ? "var(--rebar-color-danger, #b91c1c)" : undefined }}
        >
          {countLabel}
        </Box>
      </Stack>

      <Stack
        direction="column"
        gap="sm"
        data-testid={`column-body-${id}`}
        onDragOver={onDragOverColumn}
        onDrop={onDrop}
        style={{ flex: 1, minHeight: 40 }}
      >
        {visibleCards.length === 0 ? (
          <Box as="p" style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
            {cards.length === 0 ? "No cards yet." : "No cards match your search."}
          </Box>
        ) : (
          visibleCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              isDragging={draggingCardId === card.id}
              dropIndicator={
                dropTarget !== null && dropTarget.column === id && dropTarget.cardId === card.id
                  ? dropTarget.position
                  : null
              }
              onDragStart={(event) => onDragStartCard(event, card.id)}
              onDragOver={(event) => onDragOverCard(event, card.id)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
        {showEndIndicator ? (
          <Box
            data-testid={`column-end-indicator-${id}`}
            style={{ height: 2, background: "var(--rebar-color-accent, #2563eb)", borderRadius: 1 }}
          />
        ) : null}
      </Stack>

      <AddCardForm disabled={atCap} onAdd={onAddCard} />
    </Box>
  );
}
