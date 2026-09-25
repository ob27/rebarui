import { PlusOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Input, Typography } from "antd";
import { useState } from "react";
import type { ColumnId, KanbanCard } from "../types";
import { SortableCard } from "./SortableCard";

interface Props {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
  visibleIds: Set<string>;
  cap?: number;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({ id, title, cards, visibleIds, cap, onAddCard }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = cap !== undefined && cards.length >= cap;

  function openAdd() {
    if (atCap) return;
    setAdding(true);
  }

  function cancelAdd() {
    setAdding(false);
    setDraft("");
  }

  function commitAdd() {
    const trimmed = draft.trim();
    if (!trimmed || atCap) {
      cancelAdd();
      return;
    }
    onAddCard(id, trimmed);
    setDraft("");
    setAdding(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: "1 1 0",
        minWidth: 260,
        maxWidth: 340,
        background: isOver ? "#f0f5ff" : "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Text strong>{title}</Typography.Text>
        <Typography.Text type={cap !== undefined && atCap ? "danger" : "secondary"}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </Typography.Text>
      </div>

      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 40 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} hidden={!visibleIds.has(card.id)} />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <Input
          autoFocus
          placeholder="Card title"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onPressEnter={commitAdd}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              cancelAdd();
            }
          }}
          onBlur={() => {
            if (!draft.trim()) cancelAdd();
          }}
        />
      ) : (
        <Button type="dashed" icon={<PlusOutlined />} disabled={atCap} onClick={openAdd} block>
          Add card
        </Button>
      )}
    </div>
  );
}
