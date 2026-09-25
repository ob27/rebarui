import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { Avatar, Card, Tag, Typography } from "antd";
import type { CardData } from "./types";

const { Text } = Typography;

const STATUS_COLOR: Record<Exclude<CardData["status"], undefined>, string> = {
  Blocked: "red",
  Review: "gold",
};

export interface CardItemProps extends HTMLAttributes<HTMLDivElement> {
  card: CardData;
  dragHandleProps?: Record<string, unknown>;
  isOverlay?: boolean;
  style?: CSSProperties;
}

/** The visual shell for a single Sprint Board card: title, optional description,
 * status tag, and a single-letter assignee avatar. Pure presentation — no drag
 * logic lives here so it can be reused inside the sortable wrapper and the
 * drag overlay alike. */
export const CardItem = forwardRef<HTMLDivElement, CardItemProps>(
  ({ card, dragHandleProps, isOverlay, style, ...rest }, ref) => {
    return (
      <div ref={ref} style={style} {...dragHandleProps} {...rest}>
        <Card
          size="small"
          hoverable
          styles={{ body: { padding: 12 } }}
          style={{
            marginBottom: 8,
            cursor: "grab",
            boxShadow: isOverlay ? "0 8px 20px rgba(0,0,0,0.18)" : undefined,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <Text strong style={{ fontSize: 13 }}>
              {card.title}
            </Text>
            {card.assignee && (
              <Avatar size="small" style={{ flexShrink: 0, backgroundColor: "#6b7fd7" }}>
                {card.assignee}
              </Avatar>
            )}
          </div>
          {card.description && (
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
              {card.description}
            </Text>
          )}
          {card.status && (
            <Tag color={STATUS_COLOR[card.status]} style={{ marginTop: 8, marginRight: 0 }}>
              {card.status}
            </Tag>
          )}
        </Card>
      </div>
    );
  },
);
CardItem.displayName = "CardItem";
