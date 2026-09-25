import type { CSSProperties } from "react";
import { Card as AntCard, Tag, Avatar } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardData, CardStatus } from "./types";

const STATUS_COLOR: Record<CardStatus, string> = {
  Blocked: "red",
  Review: "gold",
};

function CardBody({ card }: { card: CardData }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 500 }}>{card.title}</div>
        <Avatar size="small">{card.assignee}</Avatar>
      </div>
      {card.description ? (
        <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, marginTop: 4 }}>
          {card.description}
        </div>
      ) : null}
      {card.status ? (
        <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 8 }}>
          {card.status}
        </Tag>
      ) : null}
    </>
  );
}

export function CardItem({ card, hidden }: { card: CardData; hidden?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    display: hidden ? "none" : undefined,
    marginBottom: 8,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AntCard size="small">
        <CardBody card={card} />
      </AntCard>
    </div>
  );
}

/** Static (non-sortable) rendering used inside DragOverlay while a card is being dragged. */
export function CardPreview({ card }: { card: CardData }) {
  return (
    <AntCard size="small" style={{ width: 260, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
      <CardBody card={card} />
    </AntCard>
  );
}
