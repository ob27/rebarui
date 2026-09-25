import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { SprintCard } from "./types";

interface CardItemProps {
  card: SprintCard;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOverCard: (e: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

export function CardItem({ card, onDragStart, onDragEnd, onDragOverCard, isDragging }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      data-card-id={card.id}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        extra={card.status ? <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag> : null}
        footer={<Avatar fallback={card.assignee} size="sm" />}
      />
    </div>
  );
}
