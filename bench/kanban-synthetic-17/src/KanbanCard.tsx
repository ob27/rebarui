import { Card, Tag, Avatar } from "rebar-ui";
import type { DragEvent } from "react";
import type { CardData } from "./types";

interface KanbanCardProps {
  card: CardData;
  visible: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function KanbanCard({
  card,
  visible,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid="kanban-card"
      data-card-id={card.id}
      style={{
        display: visible ? "block" : "none",
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
      }}
    >
      <Card
        title={card.title}
        footer={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {card.status ? (
              <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag>
            ) : (
              <span />
            )}
            <Avatar fallback={card.assignee} size="sm" alt={card.assignee} />
          </div>
        }
      >
        {card.description ? card.description : null}
      </Card>
    </div>
  );
}
