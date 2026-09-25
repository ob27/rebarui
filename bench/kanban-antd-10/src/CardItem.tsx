import type { CSSProperties } from "react";
import { Avatar, Card, Tag, Typography } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardData } from "./types";

const { Text } = Typography;

const TAG_COLOR: Record<NonNullable<CardData["tag"]>, string> = {
  Blocked: "red",
  Review: "gold",
};

export function CardItem({
  card,
  dragging = false,
}: {
  card: CardData;
  dragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
    marginBottom: 8,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid="kanban-card"
      data-card-id={card.id}
    >
      <Card
        size="small"
        styles={{ body: { padding: 10 } }}
        hoverable
        style={dragging ? { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" } : undefined}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            {card.title}
          </Text>
          <Avatar size="small" style={{ flexShrink: 0, backgroundColor: "#87919e" }}>
            {card.assignee}
          </Avatar>
        </div>
        {card.description ? (
          <Text
            type="secondary"
            style={{ display: "block", fontSize: 12, marginTop: 4 }}
          >
            {card.description}
          </Text>
        ) : null}
        {card.tag ? (
          <Tag color={TAG_COLOR[card.tag]} style={{ marginTop: 6, marginRight: 0 }}>
            {card.tag}
          </Tag>
        ) : null}
      </Card>
    </div>
  );
}
