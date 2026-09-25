import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  visible: boolean;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
}

export function CardItem({ card, visible, isDragging, onDragStart, onDragEnd, onDragOver }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      data-testid="kanban-card"
      data-card-id={card.id}
      data-card-title={card.title}
      style={{
        display: visible ? undefined : "none",
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
      }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        extra={
          card.status ? (
            <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag>
          ) : undefined
        }
        footer={<Avatar fallback={card.assignee} size="sm" />}
      />
    </div>
  );
}
