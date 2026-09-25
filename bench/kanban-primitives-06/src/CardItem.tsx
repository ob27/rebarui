import type { DragEvent } from "react";
import { Card, Avatar } from "rebar-ui";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  onDragOverCard: (event: DragEvent<HTMLDivElement>) => void;
}

export function CardItem({ card, isDragging, onDragStart, onDragEnd, onDragOverCard }: CardItemProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      title={card.title}
      subtitle={card.description}
      labels={card.status ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }] : []}
      footer={<Avatar fallback={card.assignee} size="sm" />}
      data-card-id={card.id}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
    />
  );
}
