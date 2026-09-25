import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CardItem from "./CardItem";
import type { CardData, ColumnId } from "./types";

interface ColumnProps {
  id: ColumnId;
  title: string;
  cap?: number;
  cards: CardData[];
  query: string;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

function matchesQuery(card: CardData, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return card.title.toLowerCase().includes(q);
}

export default function Column({ id, title, cap, cards, query, onAddCard }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = cap !== undefined && cards.length >= cap;

  function openAdd() {
    if (atCap) return;
    setAdding(true);
    setDraft("");
  }

  function closeAdd() {
    setAdding(false);
    setDraft("");
  }

  function submitAdd() {
    const trimmed = draft.trim();
    if (!trimmed || atCap) {
      closeAdd();
      return;
    }
    onAddCard(id, trimmed);
    closeAdd();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeAdd();
    }
  }

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography.Text strong>{title}</Typography.Text>
        <Typography.Text type="secondary" data-testid={`column-count-${id}`}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </Typography.Text>
      </div>

      <div ref={setNodeRef} style={{ minHeight: 40, display: "flex", flexDirection: "column" }}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} hidden={!matchesQuery(card, query)} />
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
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={openAdd}
          style={{ justifyContent: "flex-start" }}
        >
          Add card
        </Button>
      )}
    </div>
  );
}
