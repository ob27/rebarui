import type { CSSProperties } from "react";
import { Card as AntCard, Tag, Avatar, Typography } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardData } from "./types";

const STATUS_COLOR: Record<NonNullable<CardData["status"]>, string> = {
  Blocked: "red",
  Review: "gold",
};

export function SprintCardBody({ card }: { card: CardData }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <Typography.Text strong style={{ flex: 1 }}>
          {card.title}
        </Typography.Text>
        <Avatar size="small">{card.assignee}</Avatar>
      </div>
      {card.description && (
        <Typography.Text
          type="secondary"
          style={{ display: "block", marginTop: 4, fontSize: 12 }}
        >
          {card.description}
        </Typography.Text>
      )}
      {card.status && (
        <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 8 }}>
          {card.status}
        </Tag>
      )}
    </div>
  );
}

export function SortableSprintCard({
  card,
  hidden,
}: {
  card: CardData;
  hidden: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    opacity: isDragging ? 0.4 : 1,
    display: hidden ? "none" : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AntCard size="small" hoverable styles={{ body: { padding: 12 } }}>
        <SprintCardBody card={card} />
      </AntCard>
    </div>
  );
}
