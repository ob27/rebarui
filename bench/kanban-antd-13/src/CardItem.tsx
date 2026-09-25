import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData } from "./types";

const { Text } = Typography;

interface CardItemProps {
  card: CardData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

export default function CardItem({
  card,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  isDragging,
  isDropTarget,
}: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
      style={{
        opacity: isDragging ? 0.4 : 1,
        marginBottom: 8,
        borderTop: isDropTarget ? "2px solid #1677ff" : "2px solid transparent",
        cursor: "grab",
      }}
    >
      <Card size="small" styles={{ body: { padding: 10 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            {card.title}
          </Text>
          <Avatar size={22} style={{ flexShrink: 0, backgroundColor: "#87909e" }}>
            {card.assignee}
          </Avatar>
        </div>
        {card.description ? (
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
            {card.description}
          </Text>
        ) : null}
        {card.status ? (
          <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6 }}>
            {card.status}
          </Tag>
        ) : null}
      </Card>
    </div>
  );
}
