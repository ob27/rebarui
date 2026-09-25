import { useEffect, useRef, useState } from "react";
import { Button, Input, Typography, type InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "./CardItem";
import type { CardData, ColumnId } from "./types";

const { Text } = Typography;

export function Column({
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
  const { setNodeRef, isOver } = useDroppable({ id });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const atCap = cap !== undefined && cards.length >= cap;

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed || atCap) return;
    onAddCard(trimmed);
    setDraft("");
    setAdding(false);
  };

  const cancel = () => {
    setDraft("");
    setAdding(false);
  };

  const query = searchQuery.trim().toLowerCase();

  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        maxWidth: 340,
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text strong>{title}</Text>
        <Text type="secondary">{cap !== undefined ? `${cards.length}/${cap}` : cards.length}</Text>
      </div>

      {adding ? (
        <Input
          ref={inputRef}
          size="small"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          style={{ marginBottom: 12 }}
        />
      ) : (
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={() => setAdding(true)}
          style={{ marginBottom: 12 }}
        >
          Add card
        </Button>
      )}

      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          minHeight: 80,
          borderRadius: 6,
          background: isOver ? "#f0f5ff" : "transparent",
          transition: "background 0.1s ease",
        }}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              hidden={query.length > 0 && !card.title.toLowerCase().includes(query)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
