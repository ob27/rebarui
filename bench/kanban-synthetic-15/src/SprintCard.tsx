import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { CardData } from "./types";

interface SprintCardProps {
  card: CardData;
  dragging: boolean;
  activeBorder: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

export function SprintCard({
  card,
  dragging,
  activeBorder,
  onDragStart,
  onDragEnd,
  onDragOver,
}: SprintCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      style={{ opacity: dragging ? 0.4 : 1, cursor: "grab" }}
      data-testid="sprint-card"
      data-card-id={card.id}
    >
      <Card
        title={card.title}
        activeBorder={activeBorder}
        extra={card.status ? <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag> : null}
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description ?? null}
      </Card>
    </div>
  );
}
