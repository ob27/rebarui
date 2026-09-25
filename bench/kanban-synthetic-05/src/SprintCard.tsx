import type { DragEvent } from "react";
import { Card, Tag, Avatar } from "rebar-ui";
import type { CardData, ColumnId, DragPayload } from "./types";

const STATUS_TONE: Record<NonNullable<CardData["status"]>, "error" | "warning"> = {
  Blocked: "error",
  Review: "warning",
};

interface SprintCardProps {
  card: CardData;
  column: ColumnId;
  index: number;
  draggingId: string | null;
  onDragStartCard: (payload: DragPayload) => void;
  onDragEndCard: () => void;
  onDropOnCard: (e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) => void;
}

export function SprintCard({
  card,
  column,
  index,
  draggingId,
  onDragStartCard,
  onDragEndCard,
  onDropOnCard,
}: SprintCardProps) {
  return (
    <Card
      title={card.title}
      subtitle={card.description}
      extra={card.status ? <Tag tone={STATUS_TONE[card.status]}>{card.status}</Tag> : null}
      footer={
        <Avatar fallback={card.assignee} size="sm" aria-label={`Assigned to ${card.assignee}`} />
      }
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ cardId: card.id, from: column } satisfies DragPayload),
        );
        onDragStartCard({ cardId: card.id, from: column });
      }}
      onDragEnd={onDragEndCard}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const before = e.clientY < rect.top + rect.height / 2;
        onDropOnCard(e, column, before ? index : index + 1);
      }}
      style={{ opacity: draggingId === card.id ? 0.4 : 1, cursor: "grab" }}
      data-card-id={card.id}
    />
  );
}
