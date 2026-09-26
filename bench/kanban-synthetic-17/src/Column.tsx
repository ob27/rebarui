import type { DragEvent } from "react";
import { Stack } from "rebar-ui";
import { KanbanCard } from "./KanbanCard";
import { AddCardControl } from "./AddCardControl";
import type { CardData, ColumnData } from "./types";

interface ColumnProps {
  column: ColumnData;
  cards: CardData[];
  search: string;
  draggingCardId: string | null;
  onAddCard: (title: string) => void;
  onDragStartCard: (cardId: string) => void;
  onDragEndCard: () => void;
  onDropAt: (index: number) => void;
}

export function Column({
  column,
  cards,
  search,
  draggingCardId,
  onAddCard,
  onDragStartCard,
  onDragEndCard,
  onDropAt,
}: ColumnProps) {
  const atCap = column.cap !== undefined && cards.length >= column.cap;
  const normalizedSearch = search.trim().toLowerCase();

  const handleDragOverIndex = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropIndex = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    onDropAt(index);
  };

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "var(--rebar-color-surface-sunken, #f4f4f5)",
        borderRadius: 8,
        padding: 12,
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropAt(cards.length);
      }}
      data-column-id={column.id}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong>{column.title}</strong>
        <span data-testid="column-count" style={{ fontSize: 12, opacity: 0.7 }}>
          {column.cap !== undefined ? `${cards.length}/${column.cap}` : cards.length}
        </span>
      </div>

      <AddCardControl disabled={atCap} onAdd={onAddCard} />

      <Stack gap="sm">
        {cards.map((card, index) => {
          const visible =
            normalizedSearch.length === 0 || card.title.toLowerCase().includes(normalizedSearch);
          return (
            <KanbanCard
              key={card.id}
              card={card}
              visible={visible}
              isDragging={draggingCardId === card.id}
              onDragStart={() => onDragStartCard(card.id)}
              onDragEnd={onDragEndCard}
              onDragOver={handleDragOverIndex}
              onDrop={(event) => handleDropIndex(event, index)}
            />
          );
        })}
      </Stack>
    </div>
  );
}
