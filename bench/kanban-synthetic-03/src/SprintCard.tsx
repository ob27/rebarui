import { Card, Tag, Avatar } from "rebar-ui";
import type { CardData } from "./types";

interface SprintCardProps {
  card: CardData;
  dragging: boolean;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  hidden: boolean;
}

export function SprintCard({ card, dragging, onDragStart, onDragEnd, onDragOver, hidden }: SprintCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      data-card-id={card.id}
      style={{
        opacity: dragging ? 0.4 : 1,
        display: hidden ? "none" : "block",
        cursor: "grab",
      }}
    >
      <Card
        title={card.title}
        extra={card.status ? <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag> : null}
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description ?? null}
      </Card>
    </div>
  );
}
