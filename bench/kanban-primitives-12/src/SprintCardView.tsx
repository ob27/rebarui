import { Avatar, Card, Tag } from "rebar-ui";
import type { SprintCard } from "./types";

interface SprintCardViewProps {
  card: SprintCard;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export function SprintCardView({ card, isDragging, onDragStart, onDragEnd }: SprintCardViewProps) {
  return (
    <div
      data-card-id={card.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
    >
      <Card
        title={card.title}
        extra={
          card.status ? (
            <Tag tone={card.status === "Blocked" ? "warning" : "info"}>{card.status}</Tag>
          ) : undefined
        }
        footer={
          <Avatar fallback={card.assignee} size="sm" aria-label={`Assigned to ${card.assignee}`} />
        }
      >
        {card.description ? (
          <span
            style={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {card.description}
          </span>
        ) : null}
      </Card>
    </div>
  );
}
