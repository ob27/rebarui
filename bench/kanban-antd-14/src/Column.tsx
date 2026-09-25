import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CardItem from "./CardItem";
import type { CardData, ColumnId } from "./types";

const { Text } = Typography;

export default function Column({
  id,
  title,
  cards,
  cap,
  searchQuery,
  onAddCard,
}: {
  id: ColumnId;
  title: string;
  cards: CardData[];
  cap?: number;
  searchQuery: string;
  onAddCard: (title: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = cap !== undefined && cards.length >= cap;
  const query = searchQuery.trim().toLowerCase();

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !atCap) {
      onAddCard(trimmed);
    }
    setDraft("");
    setAdding(false);
  }

  function cancel() {
    setDraft("");
    setAdding(false);
  }

  return (
    <div
      style={{
        background: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        width: 300,
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 140px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <Text strong>{title}</Text>
        <Text type="secondary">
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </Text>
      </div>

      <div ref={setNodeRef} style={{ flex: 1, overflowY: "auto", minHeight: 40 }}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              matchesSearch={query === "" || card.title.toLowerCase().includes(query)}
            />
          ))}
        </SortableContext>
      </div>

      {adding ? (
        <Input
          autoFocus
          size="small"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            else if (e.key === "Escape") cancel();
          }}
        />
      ) : (
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={() => setAdding(true)}
          style={{ textAlign: "left", justifyContent: "flex-start" }}
        >
          Add card
        </Button>
      )}
    </div>
  );
}
