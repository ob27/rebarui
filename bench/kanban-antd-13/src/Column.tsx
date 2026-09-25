import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import { useState } from "react";
import CardItem from "./CardItem";
import type { CardData, ColumnDef } from "./types";

const { Text } = Typography;

interface ColumnProps {
  columnDef: ColumnDef;
  cards: CardData[];
  visibleCards: CardData[];
  atCap: boolean;
  draggingCardId: string | null;
  dragOverCardId: string | null;
  onCardDragStart: (cardId: string) => void;
  onCardDragEnd: () => void;
  onCardDragEnter: (cardId: string) => void;
  onDropBeforeCard: (cardId: string) => void;
  onDropAtEnd: () => void;
  onAddCard: (title: string) => void;
}

export default function Column({
  columnDef,
  cards,
  visibleCards,
  atCap,
  draggingCardId,
  dragOverCardId,
  onCardDragStart,
  onCardDragEnd,
  onCardDragEnter,
  onDropBeforeCard,
  onDropAtEnd,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commitAdd() {
    const title = draft.trim();
    if (!title || atCap) {
      setAdding(false);
      setDraft("");
      return;
    }
    onAddCard(title);
    setDraft("");
    setAdding(false);
  }

  function cancelAdd() {
    setDraft("");
    setAdding(false);
  }

  return (
    <div
      style={{
        background: "#f0f2f5",
        borderRadius: 8,
        padding: 10,
        width: 300,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 160px)",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropAtEnd();
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <Text strong>{columnDef.title}</Text>
        <Text type={atCap ? "danger" : "secondary"} style={{ fontSize: 12 }}>
          {columnDef.cap ? `${cards.length}/${columnDef.cap}` : cards.length}
        </Text>
      </div>

      <div style={{ overflowY: "auto", flex: 1, minHeight: 20 }}>
        {visibleCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isDragging={draggingCardId === card.id}
            isDropTarget={dragOverCardId === card.id && draggingCardId !== card.id}
            onDragStart={() => onCardDragStart(card.id)}
            onDragEnd={onCardDragEnd}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={() => onCardDragEnter(card.id)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDropBeforeCard(card.id);
            }}
          />
        ))}
      </div>

      {adding ? (
        <Input
          autoFocus
          size="small"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitAdd();
            if (e.key === "Escape") cancelAdd();
          }}
          onBlur={cancelAdd}
          style={{ marginTop: 4 }}
        />
      ) : (
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={() => setAdding(true)}
          style={{ marginTop: 4, textAlign: "left" }}
        >
          Add card
        </Button>
      )}
    </div>
  );
}
