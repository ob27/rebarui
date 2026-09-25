import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { CardData } from "./types";

const STATUS_TONE = {
  Blocked: "error",
  Review: "warning",
} as const;

export interface CardItemProps {
  card: CardData;
  onDragStart: (event: DragEvent<HTMLDivElement>, cardId: string) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>, index: number) => void;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
}

export function CardItem({
  card,
  onDragStart,
  onDragEnd,
  onDragOver,
  index,
  isDragging,
  isDropTarget,
}: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, card.id)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => onDragOver(event, index)}
      style={{
        opacity: isDragging ? 0.4 : 1,
        borderTop: isDropTarget ? "2px solid var(--rebar-color-accent, #3366ff)" : "2px solid transparent",
        cursor: "grab",
      }}
      data-testid="kanban-card"
    >
      <Card
        title={card.title}
        extra={card.status ? <Tag tone={STATUS_TONE[card.status]}>{card.status}</Tag> : null}
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description}
      </Card>
    </div>
  );
}
