import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  dragging: boolean;
  hidden: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverCard: (e: DragEvent<HTMLDivElement>) => void;
  onDropOnCard: (e: DragEvent<HTMLDivElement>) => void;
}

/** A single Sprint Board card — the static shell is the real `Card`/`Avatar`/`Tag` components
 * (via `Card`'s `labels`/`footer` slots); the drag behavior wired onto it below is hand-written. */
export function CardItem({
  card,
  dragging,
  hidden,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDropOnCard,
}: CardItemProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        // Firefox requires data to be set for a drag to start at all.
        e.dataTransfer.setData("text/plain", card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      onDrop={onDropOnCard}
      title={card.title}
      subtitle={card.description}
      labels={
        card.status
          ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }]
          : undefined
      }
      footer={<Avatar fallback={card.assignee} size="sm" />}
      className="sprint-card"
      style={{
        display: hidden ? "none" : undefined,
        opacity: dragging ? 0.4 : 1,
        cursor: "grab",
      }}
      data-testid={`card-${card.id}`}
      aria-roledescription="Draggable card"
    />
  );
}
