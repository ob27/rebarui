import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import KanbanCard from "./KanbanCard";
import type { CardData, ColumnMeta } from "./types";

interface Props {
  meta: ColumnMeta;
  /** True count in this column, unaffected by search filtering. */
  totalCount: number;
  /** Cards to render, already filtered by the active search query. */
  cards: CardData[];
  atCap: boolean;
  onAddCard: (title: string) => void;
  onCardDragStart: (cardId: string) => void;
  onCardDragOver: (index: number, e: DragEvent<HTMLDivElement>) => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onCardDragEnd: () => void;
}

export default function KanbanColumn({
  meta,
  totalCount,
  cards,
  atCap,
  onAddCard,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onCardDragEnd,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddCard(trimmed);
    setDraft("");
    setAdding(false);
  }

  function cancel() {
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") cancel();
  }

  return (
    <div className="board-column">
      <div className="board-column__header">
        <span className="board-column__title">{meta.title}</span>
        <span className="board-column__count">
          {meta.cap !== undefined ? `${totalCount}/${meta.cap}` : totalCount}
        </span>
      </div>

      {adding ? (
        <Input
          autoFocus
          size="small"
          placeholder="Card title…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={cancel}
          className="board-column__add-input"
        />
      ) : (
        <Button
          type="dashed"
          size="small"
          block
          icon={<PlusOutlined />}
          disabled={atCap}
          onClick={() => setAdding(true)}
          className="board-column__add-button"
        >
          Add card
        </Button>
      )}

      <div
        className="board-column__list"
        onDragOver={onColumnDragOver}
        onDrop={(e) => {
          e.preventDefault();
          onDrop();
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="board-column__item"
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDrop();
            }}
          >
            <KanbanCard
              card={card}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                onCardDragStart(card.id);
              }}
              onDragOver={(e) => onCardDragOver(index, e)}
              onDragEnd={onCardDragEnd}
            />
          </div>
        ))}
        {cards.length === 0 && <div className="board-column__empty">No cards</div>}
      </div>
    </div>
  );
}
