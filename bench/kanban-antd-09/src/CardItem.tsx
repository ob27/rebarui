import type { CSSProperties } from "react";
import { Avatar, Card, Tag } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardData } from "./types";

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

interface CardItemProps {
  card: CardData;
  hidden: boolean;
}

export default function CardItem({ card, hidden }: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: hidden ? "none" : undefined,
    marginBottom: 8,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ fontWeight: 500 }}>{card.title}</div>
          <Avatar size="small" style={{ flexShrink: 0, backgroundColor: "#87afc7" }}>
            {card.assignee}
          </Avatar>
        </div>
        {card.description ? (
          <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, marginTop: 4 }}>{card.description}</div>
        ) : null}
        {card.status ? (
          <div style={{ marginTop: 8 }}>
            <Tag color={STATUS_COLOR[card.status]}>{card.status}</Tag>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
