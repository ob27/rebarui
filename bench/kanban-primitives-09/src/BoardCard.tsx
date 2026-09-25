import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

interface BoardCardProps {
  card: CardData;
  column: ColumnId;
  /** Index of this card within the FULL (unfiltered) column list — used to compute drop position. */
  index: number;
  isDragging: boolean;
  onDragStart: (cardId: string, column: ColumnId) => void;
  onDragOverCard: (column: ColumnId, index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const STATUS_TONE: Record<"Blocked" | "Review", TagTone> = {
  Blocked: "warning",
  Review: "info",
};

export function BoardCard({
  card,
  column,
  index,
  isDragging,
  onDragStart,
  onDragOverCard,
  onDrop,
  onDragEnd,
}: BoardCardProps) {
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const targetIndex = event.clientY < midpoint ? index : index + 1;
    onDragOverCard(column, targetIndex);
  };

  return (
    <Card
      title={card.title}
      labels={card.status ? [{ label: card.status, tone: STATUS_TONE[card.status] }] : undefined}
      footer={<Avatar size="sm" fallback={card.assignee} />}
      draggable
      data-card-id={card.id}
      onDragStart={(event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", card.id);
        onDragStart(card.id, column);
      }}
      onDragOver={handleDragOver}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      {card.description ? <p style={{ margin: 0 }}>{card.description}</p> : null}
    </Card>
  );
}
