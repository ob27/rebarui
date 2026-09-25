import type { DragEvent } from "react";
import { Card, Avatar } from "rebar-ui";
import type { CardData } from "./types";

export interface CardItemProps {
  card: CardData;
  index: number;
  isDragging: boolean;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  /** Called with the insertion index this card's own position implies — before it if the pointer
   * is in its top half, after it if in the bottom half. */
  onHoverIndex: (index: number) => void;
}

export function CardItem({ card, index, isDragging, onDragStart, onDragEnd, onHoverIndex }: CardItemProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const isBottomHalf = e.clientY > rect.top + rect.height / 2;
    onHoverIndex(isBottomHalf ? index + 1 : index);
  };

  return (
    <Card
      title={card.title}
      subtitle={card.description}
      labels={card.status ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "info" }] : undefined}
      footer={card.assignee ? <Avatar fallback={card.assignee} size="sm" /> : undefined}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(card.id);
      }}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
      data-card-id={card.id}
    />
  );
}
