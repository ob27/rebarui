import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

interface CardItemProps {
  card: CardData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onDropOnCard: (draggedCardId: string, targetCardId: string) => void;
}

export default function CardItem({ card, onDragStart, onDropOnCard }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId) onDropOnCard(draggedId, card.id);
      }}
      style={{ cursor: "grab" }}
    >
      <Card size="small" style={{ marginBottom: 8 }} styles={{ body: { padding: 10 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ display: "block", overflowWrap: "anywhere" }}>
              {card.title}
            </Text>
            {card.description ? (
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 2 }}>
                {card.description}
              </Text>
            ) : null}
            {card.status ? (
              <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6 }}>
                {card.status}
              </Tag>
            ) : null}
          </div>
          <Avatar size="small" style={{ flexShrink: 0, backgroundColor: "#1677ff" }}>
            {card.assignee}
          </Avatar>
        </div>
      </Card>
    </div>
  );
}
