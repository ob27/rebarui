import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { CardData } from "./types";

export interface SprintCardProps {
  card: CardData;
  hidden: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
}

/** One Sprint Board card — a thin drag-handle wrapper around the real `Card` primitive, using
 * its `labels` slot for the lifecycle-status tag and its `footer` slot for the assignee avatar
 * (both called out in `Card`'s own doc comments as the kanban-card shape). Hidden (not removed)
 * from the DOM via `display: none` when it doesn't match an active search, so column card counts
 * and drag/drop indices stay stable regardless of the filter. */
export function SprintCard({ card, hidden, onDragStart, onDragOver, onDragEnd }: SprintCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{ display: hidden ? "none" : undefined, cursor: "grab" }}
      data-testid="sprint-card"
      data-card-id={card.id}
    >
      <Card
        title={card.title}
        labels={
          card.status
            ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }]
            : undefined
        }
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description}
      </Card>
    </div>
  );
}
