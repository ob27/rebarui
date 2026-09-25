import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData } from "./types";

const { Text } = Typography;

function tagColor(status: CardData["status"]): string {
  if (status === "Blocked") return "red";
  if (status === "Review") return "gold";
  return "default";
}

export default function CardItem({
  card,
  matchesSearch,
}: {
  card: CardData;
  matchesSearch: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: matchesSearch ? "block" : "none",
    marginBottom: 8,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-testid="kanban-card">
      <Card size="small" hoverable>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <Text strong>{card.title}</Text>
            {card.description && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {card.description}
                </Text>
              </div>
            )}
            {card.status && (
              <div style={{ marginTop: 4 }}>
                <Tag color={tagColor(card.status)}>{card.status}</Tag>
              </div>
            )}
          </div>
          <Avatar size="small">{card.assignee}</Avatar>
        </div>
      </Card>
    </div>
  );
}
