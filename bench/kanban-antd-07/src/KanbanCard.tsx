import type { DragEvent } from "react";
import { Avatar, Card, Tag, Typography } from "antd";
import type { KanbanCardData } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

interface KanbanCardProps {
  card: KanbanCardData;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export function KanbanCard({ card, onDragStart, onDragOver, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{ cursor: "grab" }}
      data-card-id={card.id}
    >
      <Card size="small" styles={{ body: { padding: 10 } }} style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Text strong style={{ fontSize: 13, lineHeight: 1.3 }}>
            {card.title}
          </Text>
          <Avatar size={20} style={{ backgroundColor: "#1677ff", fontSize: 11, flexShrink: 0 }}>
            {card.assignee}
          </Avatar>
        </div>
        {card.description && (
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
            {card.description}
          </Text>
        )}
        {card.status && (
          <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6 }}>
            {card.status}
          </Tag>
        )}
      </Card>
    </div>
  );
}
