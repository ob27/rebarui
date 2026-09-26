import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import type { CardData } from "./types";

const STATUS_TONE: Record<NonNullable<CardData["status"]>, TagTone> = {
  Blocked: "warning",
  Review: "info",
};

export interface SprintCardProps {
  card: CardData;
  /** Whether this card matches the current search term. Non-matching cards are still rendered
   * (mounted, real DOM elements) — just visually hidden via `display: none` — so the true
   * per-column card count never changes while searching. */
  visible: boolean;
  dragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export function SprintCard({ card, visible, dragging, onDragStart, onDragEnd }: SprintCardProps) {
  const statusTag = card.status ? [{ label: card.status, tone: STATUS_TONE[card.status] }] : undefined;

  return (
    <Card
      data-card-id={card.id}
      title={card.title}
      labels={statusTag}
      footer={<Avatar fallback={card.assignee} size="sm" />}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        display: visible ? undefined : "none",
        opacity: dragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {card.description}
    </Card>
  );
}
