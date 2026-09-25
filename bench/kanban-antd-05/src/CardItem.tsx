import { Avatar, Card, Tag, Typography } from "antd";
import type { DragEvent } from "react";
import type { CardData, ColumnId } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<NonNullable<CardData["status"]>, string> = {
  Blocked: "red",
  Review: "gold",
};

interface CardItemProps {
  card: CardData;
  columnId: ColumnId;
  isDragging: boolean;
  isDropTargetBefore: boolean;
  isDropTargetAfter: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
}

export default function CardItem({
  card,
  isDragging,
  isDropTargetBefore,
  isDropTargetAfter,
  onDragStart,
  onDragOver,
  onDragEnd,
}: CardItemProps) {
  return (
    <div
      style={{
        borderTop: isDropTargetBefore ? "2px solid #1677ff" : "2px solid transparent",
        borderBottom: isDropTargetAfter ? "2px solid #1677ff" : "2px solid transparent",
      }}
    >
      <Card
        size="small"
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        style={{
          marginBottom: 4,
          cursor: "grab",
          opacity: isDragging ? 0.4 : 1,
        }}
        styles={{ body: { padding: 10 } }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ display: "block" }}>
              {card.title}
            </Text>
            {card.description && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {card.description}
              </Text>
            )}
          </div>
          <Avatar size="small" style={{ backgroundColor: "#87909e", flexShrink: 0 }}>
            {card.assignee}
          </Avatar>
        </div>
        {card.status && (
          <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6 }}>
            {card.status}
          </Tag>
        )}
      </Card>
    </div>
  );
}
