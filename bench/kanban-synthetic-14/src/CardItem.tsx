import type { DragEvent } from "react";
import { Card, Avatar, type TagTone } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

const STATUS_TONE: Record<NonNullable<CardData["status"]>, TagTone> = {
  Blocked: "error",
  Review: "warning",
};

export interface CardItemProps {
  card: CardData;
  columnId: ColumnId;
  /** false for a card hidden by an active search filter — still rendered (kept in the DOM, kept
   * in state) but visually and interactively out of the way, per the spec's "hidden, not
   * removed" requirement. */
  visible: boolean;
  isDragging: boolean;
  onDragStart: (card: CardData, columnId: ColumnId) => void;
  onDragEnd: () => void;
}

export function CardItem({ card, columnId, visible, isDragging, onDragStart, onDragEnd }: CardItemProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.id);
    onDragStart(card, columnId);
  };

  return (
    <div
      data-card-id={card.id}
      draggable={visible}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      aria-hidden={!visible}
      style={{
        display: visible ? undefined : "none",
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
      }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        labels={card.status ? [{ label: card.status, tone: STATUS_TONE[card.status] }] : undefined}
        footer={card.assignee ? <Avatar fallback={card.assignee} size="sm" /> : undefined}
      />
    </div>
  );
}
