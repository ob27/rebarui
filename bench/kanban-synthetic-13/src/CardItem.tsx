import type { DragEvent } from "react";
import { Avatar, Card, Tag } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import type { ColumnId, SprintCard } from "./types";

const STATUS_TONE: Record<string, TagTone> = {
  Blocked: "error",
  Review: "warning",
};

export interface CardItemProps {
  card: SprintCard;
  column: ColumnId;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => void;
  onDragEnd: () => void;
  onCardDragOver: (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => void;
}

export function CardItem({
  card,
  column,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onCardDragOver,
}: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, card, column)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => onCardDragOver(event, card, column)}
      style={{
        opacity: isDragging ? 0.4 : 1,
        borderTop: isDropTarget ? "2px solid var(--rebar-color-accent, #4a6cf7)" : "2px solid transparent",
        cursor: "grab",
      }}
      data-card-id={card.id}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        avatar={<Avatar fallback={card.assignee} size="sm" />}
        labels={card.status ? [{ label: card.status, tone: STATUS_TONE[card.status] }] : undefined}
      />
    </div>
  );
}
