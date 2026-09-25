import { useRef, useState } from "react";
import { Button, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "./CardItem";
import type { CardData, ColumnDef } from "./types";

const { Text } = Typography;

export function Column({
  column,
  cards,
  visibleCards,
  isFiltering,
  onAddCard,
}: {
  column: ColumnDef;
  /** All cards truly in this column (used for the count/cap badge — unaffected by search). */
  cards: CardData[];
  /** Cards to actually render (post search-filter). */
  visibleCards: CardData[];
  isFiltering: boolean;
  onAddCard: (columnId: ColumnDef["id"], title: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const atCap = column.cap !== undefined && cards.length >= column.cap;

  const countLabel = column.cap !== undefined ? `${cards.length}/${column.cap}` : `${cards.length}`;

  function startAdding() {
    if (atCap) return;
    setAdding(true);
    setValue("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function commit() {
    const title = value.trim();
    if (!title) {
      cancel();
      return;
    }
    if (atCap) {
      cancel();
      return;
    }
    onAddCard(column.id, title);
    setValue("");
    setAdding(false);
  }

  function cancel() {
    setAdding(false);
    setValue("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        flexShrink: 0,
        background: isOver ? "#f0f5ff" : "#f5f5f5",
        borderRadius: 8,
        padding: 10,
        minHeight: 200,
        transition: "background-color 120ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          padding: "0 2px",
        }}
      >
        <Text strong>{column.title}</Text>
        <Text
          type={atCap ? "danger" : "secondary"}
          data-testid={`column-count-${column.id}`}
          style={{ fontSize: 12 }}
        >
          {countLabel}
        </Text>
      </div>

      <div ref={setNodeRef} style={{ flex: 1, minHeight: 40 }}>
        <SortableContext items={visibleCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {visibleCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </SortableContext>
        {visibleCards.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "#999",
              padding: "8px 4px",
              textAlign: "center",
            }}
          >
            {isFiltering ? "No matching cards" : "No cards"}
          </div>
        ) : null}
      </div>

      {adding ? (
        <div style={{ marginTop: 4 }}>
          <Input
            ref={inputRef}
            size="small"
            placeholder="Card title"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            onBlur={() => {
              // Keep it simple: losing focus without a value cancels; a typed value is
              // preserved so an accidental blur doesn't discard input, but Escape/Enter
              // are the documented ways to resolve the form.
              if (!value.trim()) cancel();
            }}
          />
        </div>
      ) : (
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={startAdding}
          style={{ marginTop: 4, textAlign: "left", color: atCap ? undefined : "#555" }}
          block
        >
          Add card
        </Button>
      )}
    </div>
  );
}
