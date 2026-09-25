import { Card, Avatar } from "rebar-ui";
import type { DragEvent } from "react";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  onDragStart: () => void;
  /** `before` is true when the pointer is over the top half of this card. */
  onDragOver: (before: boolean) => void;
  onDragEnd: () => void;
}

/** A single sprint-board card: hand-wired as a plain draggable element (the drag/drop *behavior*
 * is this benchmark's job), visually composed from the pre-built Synthetic-tier `Card` shell. */
export function CardItem({ card, onDragStart, onDragOver, onDragEnd }: CardItemProps) {
  return (
    <Card
      draggable
      onDragStart={(e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Stop here so the column container's own onDragOver (which assumes "empty space,
        // append at the end") doesn't also fire for a point that's actually over a card.
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        onDragOver(before);
      }}
      onDragEnd={onDragEnd}
      style={{ cursor: "grab" }}
      title={card.title}
      subtitle={card.description}
      labels={
        card.status
          ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "info" }]
          : undefined
      }
      footer={<Avatar fallback={card.assignee} size="sm" />}
    />
  );
}
