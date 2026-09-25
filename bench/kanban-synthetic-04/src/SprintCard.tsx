import type { DragEvent } from "react";
import { Card, Avatar } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

interface SprintCardProps {
  card: CardData;
  columnId: ColumnId;
  index: number;
  isDragging: boolean;
  onDragStart: (e: DragEvent, cardId: string, columnId: ColumnId) => void;
  onDragEnd: () => void;
  onCardDragOver: (e: DragEvent, columnId: ColumnId, index: number) => void;
}

export function SprintCard({
  card,
  columnId,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  onCardDragOver,
}: SprintCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onCardDragOver(e, columnId, index)}
      title={card.title}
      labels={card.status ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }] : undefined}
      footer={<Avatar fallback={card.assignee} size="sm" />}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
      data-card-id={card.id}
    >
      {card.description}
    </Card>
  );
}
