import { Avatar, Card, Tag, Typography } from "antd";
import type { DragEvent } from "react";
import type { KanbanCard } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

const AVATAR_COLORS = ["#f56a00", "#7265e6", "#00a2ae", "#1677ff", "#87d068", "#eb2f96"];

function colorForLetter(letter: string): string {
  const code = letter.toUpperCase().charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

interface CardItemProps {
  card: KanbanCard;
  hidden: boolean;
  isDragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

export function CardItem({ card, hidden, isDragging, onDragStart, onDragEnd, onDragOver }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      style={{
        display: hidden ? "none" : "block",
        marginBottom: 8,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
      }}
      data-card-id={card.id}
    >
      <Card size="small" styles={{ body: { padding: 10 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            {card.title}
          </Text>
          <Avatar size="small" style={{ backgroundColor: colorForLetter(card.assignee), flexShrink: 0 }}>
            {card.assignee.toUpperCase()}
          </Avatar>
        </div>
        {card.description ? (
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
            {card.description}
          </Text>
        ) : null}
        {card.status ? (
          <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6, marginBottom: 0 }}>
            {card.status}
          </Tag>
        ) : null}
      </Card>
    </div>
  );
}
