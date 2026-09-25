import { useState } from "react";
import { Button, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CardItem from "./CardItem";
import type { CardData, ColumnDef } from "./types";

const { Text } = Typography;

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  visibleCards: CardData[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onDropOnCard: (cardId: string, targetCardId: string) => void;
  onDropAtEnd: (cardId: string) => void;
  onAddCard: (title: string) => void;
}

export default function Column({
  def,
  cards,
  visibleCards,
  onDragStart,
  onDropOnCard,
  onDropAtEnd,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = def.cap != null && cards.length >= def.cap;

  const commitAdd = () => {
    const title = draft.trim();
    if (!title || atCap) return;
    onAddCard(title);
    setDraft("");
    setAdding(false);
  };

  const cancelAdd = () => {
    setDraft("");
    setAdding(false);
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        background: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        if (cardId) onDropAtEnd(cardId);
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <Text strong>{def.title}</Text>
        <Text type="secondary">
          {def.cap != null ? `${cards.length}/${def.cap}` : cards.length}
        </Text>
      </div>

      <div style={{ flex: 1 }}>
        {visibleCards.map((card) => (
          <CardItem key={card.id} card={card} onDragStart={onDragStart} onDropOnCard={onDropOnCard} />
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
        />
      ) : (
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={() => setAdding(true)}
          style={{ alignSelf: "flex-start" }}
        >
          Add card
        </Button>
      )}
    </div>
  );
}
