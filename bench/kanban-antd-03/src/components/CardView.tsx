import { Avatar, Card as AntCard, Tag } from "antd";
import type { KanbanCard } from "../types";

const STATUS_COLOR: Record<string, string> = {
  Blocked: "red",
  Review: "gold",
};

interface Props {
  card: KanbanCard;
}

export function CardView({ card }: Props) {
  return (
    <div data-testid="kanban-card" data-card-id={card.id}>
      <AntCard size="small" styles={{ body: { padding: 12 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>{card.title}</div>
            {card.description && (
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(0,0,0,0.45)",
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {card.description}
              </div>
            )}
            {card.status && (
              <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 6 }}>
                {card.status}
              </Tag>
            )}
          </div>
          <Avatar size="small">{card.assignee}</Avatar>
        </div>
      </AntCard>
    </div>
  );
}
