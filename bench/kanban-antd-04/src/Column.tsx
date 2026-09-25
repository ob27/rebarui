import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CardData, ColumnId } from "./types";
import { COLUMN_META } from "./types";
import { SortableSprintCard } from "./SprintCard";

interface ColumnProps {
  columnId: ColumnId;
  cards: CardData[];
  visibleIds: Set<string>;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({ columnId, cards, visibleIds, onAddCard }: ColumnProps) {
  const meta = COLUMN_META[columnId];
  const atCap = meta.cap !== undefined && cards.length >= meta.cap;
  const { setNodeRef } = useDroppable({ id: `column:${columnId}` });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function commit() {
    const title = draft.trim();
    if (title && !atCap) {
      onAddCard(columnId, title);
    }
    setDraft("");
    setAdding(false);
  }

  function cancel() {
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  }

  const countLabel = meta.cap !== undefined ? `${cards.length}/${meta.cap}` : `${cards.length}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        minWidth: 280,
        background: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        height: "100%",
        boxSizing: "border-box",
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
        <Typography.Text strong>{meta.title}</Typography.Text>
        <Typography.Text type={atCap ? "warning" : "secondary"}>{countLabel}</Typography.Text>
      </div>
      <div ref={setNodeRef} style={{ flex: 1, overflowY: "auto", minHeight: 40 }}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableSprintCard key={card.id} card={card} hidden={!visibleIds.has(card.id)} />
          ))}
        </SortableContext>
      </div>
      <div style={{ marginTop: 8 }}>
        {adding ? (
          <Input
            ref={inputRef}
            size="small"
            placeholder="Card title"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={cancel}
          />
        ) : (
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            disabled={atCap}
            onClick={() => setAdding(true)}
            block
          >
            Add card
          </Button>
        )}
      </div>
    </div>
  );
}
