import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { CardData } from "./types";

interface BoardCardProps {
  card: CardData;
  /** This card's index within its column's *full* (unfiltered) list — the coordinate space the
   * drag/reorder math in `useBoardState.moveCard` operates in. */
  index: number;
  isDragging: boolean;
  onDragStart: (e: DragEvent, card: CardData) => void;
  onDragOverCard: (e: DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export function BoardCard({ card, index, isDragging, onDragStart, onDragOverCard, onDragEnd }: BoardCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onDragOver={(e) => onDragOverCard(e, index)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
    >
      <Card
        title={card.title}
        subtitle={card.description}
        labels={
          card.status
            ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "info" }]
            : undefined
        }
        footer={<Avatar fallback={card.assignee} size="sm" />}
      />
    </div>
  );
}
