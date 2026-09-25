import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import type { DragEvent, KeyboardEvent } from "react";
import CardItem from "./CardItem";
import type { CardData, ColumnId, ColumnMeta } from "./types";

const { Text } = Typography;

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface OverInfo {
  column: ColumnId;
  index: number;
}

interface ColumnProps {
  meta: ColumnMeta;
  cards: CardData[];
  search: string;
  dragState: DragState | null;
  overInfo: OverInfo | null;
  isAdding: boolean;
  draftTitle: string;
  onDraftTitleChange: (value: string) => void;
  onStartAdd: () => void;
  onSubmitAdd: () => void;
  onCancelAdd: () => void;
  onCardDragStart: (card: CardData, columnId: ColumnId) => (e: DragEvent<HTMLDivElement>) => void;
  onCardDragOver: (columnId: ColumnId, card: CardData) => (e: DragEvent<HTMLDivElement>) => void;
  onColumnDragOver: (columnId: ColumnId) => (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (columnId: ColumnId) => (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
}

export default function Column({
  meta,
  cards,
  search,
  dragState,
  overInfo,
  isAdding,
  draftTitle,
  onDraftTitleChange,
  onStartAdd,
  onSubmitAdd,
  onCancelAdd,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onDragEnd,
}: ColumnProps) {
  const atCap = meta.cap !== undefined && cards.length >= meta.cap;
  const query = search.trim().toLowerCase();
  const visibleCards = query
    ? cards.filter((c) => c.title.toLowerCase().includes(query))
    : cards;

  function handleDraftKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onCancelAdd();
    }
  }

  return (
    <div
      onDragOver={onColumnDragOver(meta.id)}
      onDrop={onDrop(meta.id)}
      style={{
        flex: 1,
        minWidth: 260,
        background: "#f5f6f8",
        borderRadius: 8,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        minHeight: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          padding: "0 2px",
        }}
      >
        <Text strong>{meta.title}</Text>
        <Text
          type={atCap ? "danger" : "secondary"}
          style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}
        >
          {meta.cap !== undefined ? `${cards.length}/${meta.cap}` : cards.length}
        </Text>
      </div>

      <div style={{ marginBottom: 8 }}>
        {isAdding ? (
          <Input
            autoFocus
            size="small"
            placeholder="Card title"
            value={draftTitle}
            onChange={(e) => onDraftTitleChange(e.target.value)}
            onPressEnter={onSubmitAdd}
            onKeyDown={handleDraftKeyDown}
            onBlur={onCancelAdd}
          />
        ) : (
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onStartAdd}
            disabled={atCap}
            style={{ width: "100%", textAlign: "left", color: "#555" }}
          >
            Add card
          </Button>
        )}
      </div>

      <div style={{ flex: 1 }}>
        {visibleCards.map((card) => {
          const trueIndex = cards.findIndex((c) => c.id === card.id);
          const isDragging = dragState?.cardId === card.id;
          const isOverThis = overInfo?.column === meta.id;
          return (
            <CardItem
              key={card.id}
              card={card}
              columnId={meta.id}
              isDragging={isDragging}
              isDropTargetBefore={isOverThis && overInfo?.index === trueIndex}
              isDropTargetAfter={
                isOverThis &&
                overInfo?.index === trueIndex + 1 &&
                trueIndex === cards.length - 1
              }
              onDragStart={onCardDragStart(card, meta.id)}
              onDragOver={onCardDragOver(meta.id, card)}
              onDragEnd={onDragEnd}
            />
          );
        })}
        {visibleCards.length === 0 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {query ? "No matching cards" : "No cards"}
          </Text>
        )}
      </div>
    </div>
  );
}
