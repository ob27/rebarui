import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Card, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { CardData } from "./types";

/** Pure presentational card body — reused by the sortable card and the DragOverlay preview. */
export function CardVisual({ card }: { card: CardData }) {
  return (
    <Card size="small" hoverable styles={{ body: { padding: 10 } }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Text strong>{card.title}</Typography.Text>
          {card.description && (
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {card.description}
              </Typography.Text>
            </div>
          )}
          {card.status && (
            <div style={{ marginTop: 6 }}>
              <Tag color={card.status === "Blocked" ? "error" : "processing"}>{card.status}</Tag>
            </div>
          )}
        </div>
        <Avatar size="small" icon={card.assignee ? undefined : <UserOutlined />}>
          {card.assignee ? card.assignee.charAt(0).toUpperCase() : undefined}
        </Avatar>
      </div>
    </Card>
  );
}

export default function CardItem({ card, hidden }: { card: CardData; hidden?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    display: hidden ? "none" : undefined,
    marginBottom: 8,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-testid="kanban-card" data-card-id={card.id}>
      <CardVisual card={card} />
    </div>
  );
}
