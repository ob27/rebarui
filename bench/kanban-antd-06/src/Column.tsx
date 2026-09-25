import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, Typography } from "antd";
import type { DragEvent } from "react";
import { CardItem } from "./CardItem";
import type { ColumnDef, KanbanCard } from "./types";

const { Text } = Typography;

interface DropIndicator {
  column: string;
  index: number;
}

interface ColumnProps {
  def: ColumnDef;
  cards: KanbanCard[];
  search: string;
  draggedCardId: string | null;
  dropIndicator: DropIndicator | null;
  atCap: boolean;
  isAdding: boolean;
  draftTitle: string;
  onOpenAdd: () => void;
  onDraftChange: (value: string) => void;
  onDraftSubmit: () => void;
  onDraftCancel: () => void;
  onCardDragStart: (e: DragEvent<HTMLDivElement>, cardId: string) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

export function Column({
  def,
  cards,
  search,
  draggedCardId,
  dropIndicator,
  atCap,
  isAdding,
  draftTitle,
  onOpenAdd,
  onDraftChange,
  onDraftSubmit,
  onDraftCancel,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
}: ColumnProps) {
  const countLabel = def.cap ? `${cards.length}/${def.cap}` : `${cards.length}`;
  const query = search.trim().toLowerCase();

  return (
    <Card
      size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{def.title}</span>
          <Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>
            {countLabel}
          </Text>
        </div>
      }
      style={{ width: 300, flexShrink: 0 }}
      styles={{ body: { padding: 8, minHeight: 200 } }}
      onDragOver={onColumnDragOver}
      onDrop={onDrop}
      data-column-id={def.id}
    >
      <div style={{ marginBottom: 8 }}>
        {isAdding ? (
          <Input
            autoFocus
            size="small"
            placeholder="Card title"
            value={draftTitle}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onDraftSubmit();
              } else if (e.key === "Escape") {
                onDraftCancel();
              }
            }}
            onBlur={onDraftCancel}
          />
        ) : (
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            block
            disabled={atCap}
            onClick={onOpenAdd}
          >
            Add card
          </Button>
        )}
      </div>

      {cards.map((card, index) => {
        const hidden = query.length > 0 && !card.title.toLowerCase().includes(query);
        return (
          <div key={card.id}>
            {dropIndicator && dropIndicator.column === def.id && dropIndicator.index === index ? (
              <div style={{ height: 2, background: "#1677ff", marginBottom: 6, borderRadius: 1 }} />
            ) : null}
            <CardItem
              card={card}
              hidden={hidden}
              isDragging={draggedCardId === card.id}
              onDragStart={(e) => onCardDragStart(e, card.id)}
              onDragEnd={onCardDragEnd}
              onDragOver={(e) => onCardDragOver(e, index)}
            />
          </div>
        );
      })}
      {dropIndicator && dropIndicator.column === def.id && dropIndicator.index === cards.length ? (
        <div style={{ height: 2, background: "#1677ff", marginBottom: 6, borderRadius: 1 }} />
      ) : null}
    </Card>
  );
}
