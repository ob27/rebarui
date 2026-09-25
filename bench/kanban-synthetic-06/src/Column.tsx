import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Card, Avatar, Input, Button } from "rebar-ui";
import type { CardData, ColumnId } from "./types";

interface ColumnProps {
  id: ColumnId;
  title: string;
  cards: CardData[];
  cap?: number;
  searchQuery: string;
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropOnCard: (targetId: string, columnId: ColumnId) => void;
  onDropOnColumn: (columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({
  id,
  title,
  cards,
  cap,
  searchQuery,
  draggedId,
  onDragStart,
  onDragEnd,
  onDropOnCard,
  onDropOnColumn,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [isColumnDragOver, setIsColumnDragOver] = useState(false);

  const atCap = cap !== undefined && cards.length >= cap;

  function commitAdd() {
    const value = draft.trim();
    if (!value) return;
    onAddCard(id, value);
    setDraft("");
    setAdding(false);
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <div className="board-column">
      <div className="board-column-header">
        <span>{title}</span>
        <span className="board-column-count" data-cap-reached={atCap}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </span>
      </div>

      <div
        className="board-column-list"
        data-drag-over={isColumnDragOver}
        onDragOver={(event) => {
          if (!draggedId) return;
          event.preventDefault();
          setIsColumnDragOver(true);
        }}
        onDragLeave={() => setIsColumnDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsColumnDragOver(false);
          onDropOnColumn(id);
        }}
      >
        {cards.map((card) => {
          const matchesSearch =
            searchQuery.trim().length === 0 ||
            card.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

          return (
            <Card
              key={card.id}
              className="board-card"
              data-hidden={!matchesSearch}
              data-dragging={draggedId === card.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                onDragStart(card.id);
              }}
              onDragEnd={onDragEnd}
              onDragOver={(event) => {
                if (!draggedId) return;
                event.preventDefault();
                event.stopPropagation();
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDropOnCard(card.id, id);
              }}
              title={card.title}
              subtitle={card.description}
              labels={card.tag ? [{ label: card.tag, tone: card.tag === "Blocked" ? "error" : "warning" }] : undefined}
              footer={
                <div className="board-card-footer">
                  <Avatar fallback={card.assignee} size="sm" />
                </div>
              }
            />
          );
        })}
      </div>

      <div className="board-add-card">
        {adding ? (
          <Input
            className="board-add-card-input"
            autoFocus
            value={draft}
            placeholder="Card title"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleDraftKeyDown}
            onBlur={() => {
              setAdding(false);
              setDraft("");
            }}
          />
        ) : (
          <Button
            variant="secondary"
            size="sm"
            disabled={atCap}
            onClick={() => setAdding(true)}
          >
            + Add card
          </Button>
        )}
      </div>
    </div>
  );
}
