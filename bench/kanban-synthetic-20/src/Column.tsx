import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Button, Input, Stack } from "rebar-ui";
import { KanbanCard } from "./KanbanCard";
import type { CardData, ColumnId } from "./types";

export interface DropTarget {
  column: ColumnId;
  index: number;
}

export interface ColumnProps {
  columnId: ColumnId;
  title: string;
  cards: CardData[];
  /** Undefined for uncapped columns; set only for "In Progress". */
  cap?: number;
  query: string;
  draggingCardId: string | null;
  dropTarget: DropTarget | null;
  onCardDragStart: (column: ColumnId, card: CardData) => (event: DragEvent<HTMLDivElement>) => void;
  onCardDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  onCardDragOver: (column: ColumnId, index: number) => (event: DragEvent<HTMLDivElement>) => void;
  onColumnDragOver: (column: ColumnId) => (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (column: ColumnId) => (event: DragEvent<HTMLDivElement>) => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

/** A single Sprint Board column: header (title + true count/cap), the card list (every card
 * always mounted — search hides via CSS, never via array filtering), and the "+ Add card" inline
 * form. All behavior (drag targets, add-card) is hand-wired here; only `Card`/`Input`/`Button`/
 * `Stack` are pre-built Synthetic-tier shells. */
export function Column({
  columnId,
  title,
  cards,
  cap,
  query,
  draggingCardId,
  dropTarget,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = cap !== undefined && cards.length >= cap;
  const normalizedQuery = query.trim().toLowerCase();

  function commitAdd() {
    const value = draft.trim();
    if (!value || atCap) return;
    onAddCard(columnId, value);
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft("");
      setAdding(false);
    }
  }

  const showEndIndicator = dropTarget?.column === columnId && dropTarget.index >= cards.length;

  return (
    <div
      className="sprint-column"
      data-column={columnId}
      onDragOver={onColumnDragOver(columnId)}
      onDrop={onDrop(columnId)}
    >
      <div className="sprint-column-header">
        <span className="sprint-column-title">{title}</span>
        <span className="sprint-column-count" data-at-cap={atCap ? "true" : undefined}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </span>
      </div>

      <Stack direction="column" gap="sm" className="sprint-column-body">
        {cards.map((card, index) => {
          const visible = !normalizedQuery || card.title.toLowerCase().includes(normalizedQuery);
          return (
            <KanbanCard
              key={card.id}
              card={card}
              visible={visible}
              dragging={draggingCardId === card.id}
              dropBefore={dropTarget?.column === columnId && dropTarget.index === index}
              onDragStart={onCardDragStart(columnId, card)}
              onDragEnd={onCardDragEnd}
              onDragOverCard={onCardDragOver(columnId, index)}
            />
          );
        })}
        {showEndIndicator ? <div className="sprint-drop-end-indicator" /> : null}
      </Stack>

      <div className="sprint-add-card">
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!draft.trim()) setAdding(false);
            }}
            aria-label={`New card title for ${title}`}
          />
        ) : (
          <Button
            variant="tertiary"
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
