import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { SprintCard } from "./board";

interface SprintCardViewProps {
  card: SprintCard;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  hidden: boolean;
}

export function SprintCardView({ card, onDragStart, onDragEnd, isDragging, hidden }: SprintCardViewProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
      data-dragging={isDragging ? "true" : undefined}
      data-hidden={hidden ? "true" : undefined}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        display: hidden ? "none" : undefined,
      }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        extra={card.status ? <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag> : null}
        footer={
          <Avatar fallback={card.assignee} size="sm" />
        }
      />
    </div>
  );
}
