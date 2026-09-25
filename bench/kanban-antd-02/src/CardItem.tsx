import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Card, Tag, Typography } from "antd";
import type { CSSProperties } from "react";
import type { KanbanCard } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  Blocked: "error",
  Review: "warning",
};

// A small set of stable, non-garish colors to pick an avatar background from,
// keyed off the assignee initial so the same person always renders the same color.
const AVATAR_PALETTE = ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E86452", "#6DC8EC", "#945FB9"];

function avatarColorFor(letter: string): string {
  const code = letter.toUpperCase().charCodeAt(0) || 0;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

interface CardItemProps {
  card: KanbanCard;
  hidden?: boolean;
  /** Rendered inside the DragOverlay — no sortable wiring, just the visual. */
  overlay?: boolean;
}

function CardBody({ card }: { card: KanbanCard }) {
  return (
    <Card size="small" hoverable style={{ cursor: "grab" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <Text strong style={{ flex: 1 }}>
          {card.title}
        </Text>
        <Avatar size="small" style={{ backgroundColor: avatarColorFor(card.assignee), flexShrink: 0 }}>
          {card.assignee.slice(0, 1).toUpperCase()}
        </Avatar>
      </div>
      {card.description ? (
        <Text type="secondary" style={{ display: "block", marginTop: 4, fontSize: 12 }}>
          {card.description}
        </Text>
      ) : null}
      {card.status ? (
        <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 8, marginInlineEnd: 0 }}>
          {card.status}
        </Tag>
      ) : null}
    </Card>
  );
}

export default function CardItem({ card, hidden, overlay }: CardItemProps) {
  if (overlay) {
    return (
      <div style={{ width: 260 }}>
        <CardBody card={card} />
      </div>
    );
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    display: hidden ? "none" : undefined,
    marginBottom: 8,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-testid={`card-${card.id}`}>
      <CardBody card={card} />
    </div>
  );
}
