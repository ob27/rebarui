import type { DragEvent } from "react";
import { Avatar, Card, Tag } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

interface CardItemProps {
  card: CardData;
  columnId: ColumnId;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) => void;
  onDropOnCard: (e: DragEvent<HTMLDivElement>, targetCardId: string, columnId: ColumnId) => void;
}

export function CardItem({ card, columnId, onDragStart, onDropOnCard }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropOnCard(e, card.id, columnId)}
      style={{ cursor: "grab" }}
      data-card-id={card.id}
    >
      <Card
        title={card.title}
        extra={
          card.status ? (
            <Tag tone={card.status === "Blocked" ? "error" : "warning"}>{card.status}</Tag>
          ) : undefined
        }
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description}
      </Card>
    </div>
  );
}
