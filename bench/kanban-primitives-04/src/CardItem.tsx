import type { DragEvent } from "react";
import { Avatar, Card, Tag } from "rebar-ui";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

export function CardItem({ card, dragging, onDragStart, onDragEnd, onDragOver, onDrop }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.stopPropagation();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(e);
      }}
      data-rebar-component="kanban-card-wrapper"
      style={{ opacity: dragging ? 0.5 : 1, cursor: "grab" }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        avatar={<Avatar fallback={card.assignee} size="sm" />}
        extra={
          card.status ? (
            <Tag tone={card.status === "Blocked" ? "error" : "info"}>{card.status}</Tag>
          ) : null
        }
      />
    </div>
  );
}
