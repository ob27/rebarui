import type { DragEvent } from "react";
import { Avatar, Card, Tag } from "rebar-ui";
import type { CardData } from "./types";

export interface CardItemProps {
  card: CardData;
  /** True while this exact card is the one currently being dragged. */
  isDragging: boolean;
  /** Which edge of this card the currently-dragged card would land on, if any. */
  dropIndicator: "before" | "after" | null;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

const INDICATOR_COLOR = "var(--rebar-color-accent, #2563eb)";

export function CardItem({ card, isDragging, dropIndicator, onDragStart, onDragOver, onDragEnd }: CardItemProps) {
  return (
    <Card
      data-testid="kanban-card"
      data-card-id={card.id}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      title={card.title}
      subtitle={card.description}
      avatar={<Avatar fallback={card.assignee} size="sm" alt={card.assignee} />}
      extra={
        card.status ? (
          <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag>
        ) : undefined
      }
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        borderTop: dropIndicator === "before" ? `2px solid ${INDICATOR_COLOR}` : undefined,
        borderBottom: dropIndicator === "after" ? `2px solid ${INDICATOR_COLOR}` : undefined,
      }}
    />
  );
}
