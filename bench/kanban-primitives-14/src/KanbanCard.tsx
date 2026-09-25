import { Card, Stack, Tag, Avatar } from "rebar-ui";
import type { CardData } from "./types";

const STATUS_TONE: Record<NonNullable<CardData["status"]>, "error" | "warning"> = {
  Blocked: "error",
  Review: "warning",
};

interface KanbanCardProps {
  card: CardData;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropBefore: (id: string) => void;
  isDragging: boolean;
}

export default function KanbanCard({
  card,
  onDragStart,
  onDragEnd,
  onDropBefore,
  isDragging,
}: KanbanCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", card.id);
        onDragStart(card.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropBefore(card.id);
      }}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      <Stack direction="column" gap="sm">
        <Stack direction="row" justify="between" align="start" gap="sm">
          <span style={{ fontWeight: 600 }}>{card.title}</span>
          <Avatar fallback={card.assignee} size="sm" />
        </Stack>
        {card.description ? (
          <span style={{ fontSize: "0.85em", color: "var(--rebar-color-text-secondary)" }}>
            {card.description}
          </span>
        ) : null}
        {card.status ? <Tag tone={STATUS_TONE[card.status]}>{card.status}</Tag> : null}
      </Stack>
    </Card>
  );
}
