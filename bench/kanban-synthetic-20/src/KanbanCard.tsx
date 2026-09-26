import { Avatar, Card } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import type { DragEvent } from "react";
import type { CardData } from "./types";

const STATUS_TONE: Record<NonNullable<CardData["status"]>, TagTone> = {
  Blocked: "error",
  Review: "info",
};

export interface KanbanCardProps {
  card: CardData;
  visible: boolean;
  dragging: boolean;
  dropBefore: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  onDragOverCard: (event: DragEvent<HTMLDivElement>) => void;
}

/**
 * A single Sprint Board card, rendered via the real `Card` component (labels/footer slots) —
 * the Synthetic-tier visual shell. Drag-and-drop wiring (draggable/onDragStart/onDragOver) and
 * the "hidden, not removed" search behavior (a `display: none` style, never a `.filter()` before
 * this renders) are hand-written here, layered on top via plain DOM props `Card` already forwards.
 */
export function KanbanCard({
  card,
  visible,
  dragging,
  dropBefore,
  onDragStart,
  onDragEnd,
  onDragOverCard,
}: KanbanCardProps) {
  return (
    <div
      className="sprint-card-slot"
      data-drop-before={dropBefore ? "true" : undefined}
      style={{ display: visible ? undefined : "none" }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        labels={card.status ? [{ label: card.status, tone: STATUS_TONE[card.status] }] : undefined}
        footer={
          <Avatar size="sm" fallback={card.assignee} alt={card.assignee} />
        }
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOverCard}
        data-card-id={card.id}
        data-testid={`card-${card.id}`}
        className="sprint-card"
        data-dragging={dragging ? "true" : undefined}
      />
    </div>
  );
}
