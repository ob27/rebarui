import type { DragEvent } from "react";
import { Avatar, Card } from "rebar-ui";
import type { CardData } from "./types";

interface CardItemProps {
  card: CardData;
  /**
   * Whether this card currently matches the search filter. The card is ALWAYS rendered
   * regardless — this only toggles a `display: none` on it. It must stay a real, mounted DOM
   * node while non-matching so a search never actually removes anything from the page.
   */
  visible: boolean;
  dragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, card: CardData) => void;
  onDragEnd: () => void;
}

export function CardItem({ card, visible, dragging, onDragStart, onDragEnd }: CardItemProps) {
  return (
    <div
      data-card-id={card.id}
      data-testid="kanban-card"
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onDragEnd={onDragEnd}
      style={{
        display: visible ? "block" : "none",
        opacity: dragging ? 0.4 : 1,
        cursor: "grab",
      }}
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
