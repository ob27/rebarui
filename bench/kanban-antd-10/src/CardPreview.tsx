import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData } from "./types";

const { Text } = Typography;

const TAG_COLOR: Record<NonNullable<CardData["tag"]>, string> = {
  Blocked: "red",
  Review: "gold",
};

/** Static (non-sortable) rendering of a card, used inside the DragOverlay. */
export function CardPreview({ card }: { card: CardData }) {
  return (
    <Card
      size="small"
      styles={{ body: { padding: 10 } }}
      style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.25)", cursor: "grabbing", width: 260 }}
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
        <Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 4 }}>
          {card.description}
        </Text>
      ) : null}
      {card.tag ? (
        <Tag color={TAG_COLOR[card.tag]} style={{ marginTop: 6, marginRight: 0 }}>
          {card.tag}
        </Tag>
      ) : null}
    </Card>
  );
}
