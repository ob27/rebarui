import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Stack, Input, Button } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { CardData, ColumnDef, ColumnId } from "./types";

interface ColumnProps {
  column: ColumnDef;
  cards: CardData[];
  visibleCards: CardData[];
  draggingCardId: string | null;
  dropTarget: { column: ColumnId; index: number } | null;
  atCap: boolean;
  onDragStart: (e: DragEvent, cardId: string, columnId: ColumnId) => void;
  onDragEnd: () => void;
  onCardDragOver: (e: DragEvent, columnId: ColumnId, index: number) => void;
  onContainerDragOver: (e: DragEvent, columnId: ColumnId) => void;
  onDrop: (e: DragEvent, columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({
  column,
  cards,
  visibleCards,
  draggingCardId,
  dropTarget,
  atCap,
  onDragStart,
  onDragEnd,
  onCardDragOver,
  onContainerDragOver,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const badge = column.cap !== undefined ? `${cards.length}/${column.cap}` : `${cards.length}`;

  function commitAdd() {
    const title = draft.trim();
    if (!title || atCap) return;
    onAddCard(column.id, title);
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAdding(false);
      setDraft("");
    }
  }

  return (
    <Stack
      direction="column"
      gap="sm"
      className="sprint-column"
      onDragOver={(e) => onContainerDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
      data-column-id={column.id}
    >
      <Stack direction="row" justify="between" align="center" className="sprint-column-header">
        <strong>{column.title}</strong>
        <span className="sprint-column-badge" data-at-cap={atCap || undefined}>
          {badge}
        </span>
      </Stack>

      <Stack direction="column" gap="xs" className="sprint-column-list">
        {visibleCards.map((card) => {
          const index = cards.findIndex((c) => c.id === card.id);
          return (
            <div key={card.id}>
              {dropTarget?.column === column.id && dropTarget.index === index && draggingCardId ? (
                <div className="sprint-drop-line" />
              ) : null}
              <SprintCard
                card={card}
                columnId={column.id}
                index={index}
                isDragging={draggingCardId === card.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onCardDragOver={onCardDragOver}
              />
            </div>
          );
        })}
        {dropTarget?.column === column.id && dropTarget.index === cards.length && draggingCardId ? (
          <div className="sprint-drop-line" />
        ) : null}
      </Stack>

      {adding ? (
        <Input
          autoFocus
          value={draft}
          placeholder="Card title"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
          + Add card
        </Button>
      )}
    </Stack>
  );
}
