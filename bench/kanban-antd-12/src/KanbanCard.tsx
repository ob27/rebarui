import type { DragEvent } from "react";
import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData, CardStatus } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<CardStatus, string> = {
  Blocked: "red",
  Review: "gold",
};

interface Props {
  card: CardData;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export default function KanbanCard({ card, onDragStart, onDragOver, onDragEnd }: Props) {
  return (
    <Card
      size="small"
      draggable
      data-card-id={card.id}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className="board-card"
      styles={{ body: { padding: 10 } }}
    >
      <div className="board-card__row">
        <div className="board-card__body">
          <Text strong className="board-card__title">
            {card.title}
          </Text>
          {card.description && (
            <Text type="secondary" className="board-card__description">
              {card.description}
            </Text>
          )}
          {card.status && (
            <div className="board-card__tag">
              <Tag color={STATUS_COLOR[card.status]}>{card.status}</Tag>
            </div>
          )}
        </div>
        <Avatar size="small">{card.assignee}</Avatar>
      </div>
    </Card>
  );
}
