import { useState, type DragEvent, type KeyboardEvent } from "react";
import { Button, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { KanbanCard } from "./KanbanCard";
import { COLUMN_TITLES, IN_PROGRESS_CAP } from "./data";
import type { ColumnId, DropTarget, KanbanCardData } from "./types";

const { Text } = Typography;

const dropIndicatorStyle = {
  height: 3,
  borderRadius: 2,
  background: "#1677ff",
  marginBottom: 8,
};

interface ColumnProps {
  colId: ColumnId;
  cards: KanbanCardData[];
  searchTerm: string;
  dropTarget: DropTarget | null;
  onDragStartCard: (cardId: string, fromCol: ColumnId) => void;
  onDragOverSlot: (col: ColumnId, index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onAddCard: (col: ColumnId, title: string) => void;
}

export function Column({
  colId,
  cards,
  searchTerm,
  dropTarget,
  onDragStartCard,
  onDragOverSlot,
  onDrop,
  onDragEnd,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const isInProgress = colId === "inProgress";
  const atCap = isInProgress && cards.length >= IN_PROGRESS_CAP;
  const term = searchTerm.trim().toLowerCase();

  const submit = () => {
    const title = draft.trim();
    if (!title || atCap) return;
    onAddCard(colId, title);
    setDraft("");
    setAdding(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "Escape") {
      setAdding(false);
      setDraft("");
    }
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
        gap: 8,
      }}
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDragOverSlot(colId, cards.length);
      }}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text strong>{COLUMN_TITLES[colId]}</Text>
        <Text type={atCap ? "danger" : "secondary"}>
          {isInProgress ? `${cards.length}/${IN_PROGRESS_CAP}` : cards.length}
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {cards.map((card, index) => {
          const visible = !term || card.title.toLowerCase().includes(term);
          const showIndicatorBefore = dropTarget?.col === colId && dropTarget.index === index;
          return (
            <div key={card.id} style={{ display: visible ? "block" : "none" }}>
              {showIndicatorBefore && <div style={dropIndicatorStyle} />}
              <KanbanCard
                card={card}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  onDragStartCard(card.id, colId);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isAfter = e.clientY > rect.top + rect.height / 2;
                  onDragOverSlot(colId, isAfter ? index + 1 : index);
                }}
                onDragEnd={onDragEnd}
              />
            </div>
          );
        })}
        {dropTarget?.col === colId && dropTarget.index === cards.length && (
          <div style={dropIndicatorStyle} />
        )}
      </div>

      {adding ? (
        <Input
          autoFocus
          size="small"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!draft.trim()) setAdding(false);
          }}
        />
      ) : (
        <Button type="dashed" size="small" icon={<PlusOutlined />} disabled={atCap} onClick={() => setAdding(true)} block>
          Add card
        </Button>
      )}
    </div>
  );
}
