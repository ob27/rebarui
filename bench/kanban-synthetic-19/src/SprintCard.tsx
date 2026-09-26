import type { DragEvent } from "react";
import { Card, Avatar } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

interface SprintCardProps {
  card: CardData;
  columnId: ColumnId;
  /** Whether this card matches the current search query. When false the card is still rendered
   * (real, present DOM element) but hidden via `display: none` — never removed from the tree. */
  matchesSearch: boolean;
  isDragging: boolean;
  onDragStart: (e: DragEvent, card: CardData, columnId: ColumnId) => void;
  onDragEnd: (e: DragEvent) => void;
  onCardDragOver: (e: DragEvent) => void;
  onCardDrop: (e: DragEvent, card: CardData, columnId: ColumnId) => void;
}

export function SprintCard({
  card,
  columnId,
  matchesSearch,
  isDragging,
  onDragStart,
  onDragEnd,
  onCardDragOver,
  onCardDrop,
}: SprintCardProps) {
  return (
    <Card
      title={card.title}
      subtitle={card.description}
      labels={card.status ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }] : undefined}
      footer={<Avatar fallback={card.assignee} size="sm" />}
      draggable
      onDragStart={(e) => onDragStart(e, card, columnId)}
      onDragEnd={onDragEnd}
      onDragOver={onCardDragOver}
      onDrop={(e) => onCardDrop(e, card, columnId)}
      data-card-id={card.id}
      data-testid="sprint-card"
      style={{
        display: matchesSearch ? undefined : "none",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
}
