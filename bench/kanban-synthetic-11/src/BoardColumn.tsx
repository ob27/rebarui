import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Button, Input, Stack } from "rebar-ui";
import { BoardCard } from "./BoardCard";
import type { CardData, ColumnData } from "./types";

interface BoardColumnProps {
  column: ColumnData;
  /** Full (unfiltered) card list — used for the count/cap badge, which must always reflect true
   * column state even while a search filter is hiding some of these cards. */
  cards: CardData[];
  /** Same list, minus anything the active search term filters out. */
  visibleCards: CardData[];
  atCap: boolean;
  draggingCardId: string | null;
  isDragOverColumn: boolean;
  onDragStartCard: (e: DragEvent, card: CardData) => void;
  onDragOverCard: (e: DragEvent, index: number) => void;
  onDragOverColumn: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: () => void;
  onAddCard: (title: string) => boolean;
}

export function BoardColumn({
  column,
  cards,
  visibleCards,
  atCap,
  draggingCardId,
  isDragOverColumn,
  onDragStartCard,
  onDragOverCard,
  onDragOverColumn,
  onDrop,
  onDragEnd,
  onAddCard,
}: BoardColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commitAdd = () => {
    if (onAddCard(draft)) {
      setDraft("");
      setAdding(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAdding(false);
      setDraft("");
    }
  };

  return (
    <div
      data-column-id={column.id}
      data-rebar-dragover={isDragOverColumn ? "true" : undefined}
      onDragOver={onDragOverColumn}
      onDrop={onDrop}
      style={{
        flex: "1 1 0",
        minWidth: 260,
        maxWidth: 340,
        background: isDragOverColumn ? "#eef2ff" : "#f4f4f5",
        border: "1px solid #e2e2e5",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{column.title}</strong>
        <span data-testid={`count-${column.id}`}>{column.cap ? `${cards.length}/${column.cap}` : cards.length}</span>
      </Stack>

      <Stack gap="sm">
        {visibleCards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            index={cards.indexOf(card)}
            isDragging={draggingCardId === card.id}
            onDragStart={onDragStartCard}
            onDragOverCard={onDragOverCard}
            onDragEnd={onDragEnd}
          />
        ))}
      </Stack>

      {adding ? (
        <Input
          autoFocus
          value={draft}
          placeholder="Card title"
          aria-label={`New card title for ${column.title}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!draft.trim()) setAdding(false);
          }}
        />
      ) : (
        <Button variant="secondary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
          + Add card
        </Button>
      )}
    </div>
  );
}
