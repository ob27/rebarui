import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Stack, Button, Input } from "rebar-ui";
import { CardItem } from "./CardItem";
import type { CardData, ColumnId } from "./types";
import { INPROGRESS_CAP } from "./seed";

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  cards: CardData[];
  visibleCards: CardData[];
  draggingCardId: string | null;
  onCardDragStart: (cardId: string, column: ColumnId) => void;
  onCardDragEnd: () => void;
  onDragOverCard: (column: ColumnId, index: number, event: DragEvent<HTMLDivElement>) => void;
  onDragOverColumn: (column: ColumnId, event: DragEvent<HTMLDivElement>) => void;
  onDrop: (column: ColumnId, event: DragEvent<HTMLDivElement>) => void;
  onAddCard: (column: ColumnId, title: string) => void;
  isOver: boolean;
}

export function Column({
  columnId,
  title,
  cards,
  visibleCards,
  draggingCardId,
  onCardDragStart,
  onCardDragEnd,
  onDragOverCard,
  onDragOverColumn,
  onDrop,
  onAddCard,
  isOver,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const atCap = columnId === "inprogress" && cards.length >= INPROGRESS_CAP;

  function openAdd() {
    if (atCap) return;
    setIsAdding(true);
    setDraft("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelAdd() {
    setIsAdding(false);
    setDraft("");
  }

  function commitAdd() {
    const trimmed = draft.trim();
    if (!trimmed || atCap) {
      cancelAdd();
      return;
    }
    onAddCard(columnId, trimmed);
    cancelAdd();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelAdd();
    }
  }

  return (
    <Box
      as="section"
      style={{
        flex: "1 1 0",
        minWidth: 260,
        background: isOver ? "var(--rebar-surface-hover, rgba(0,0,0,0.04))" : undefined,
        border: "1px solid var(--rebar-border-color, #ddd)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
      }}
      onDragOver={(event) => onDragOverColumn(columnId, event)}
      onDrop={(event) => onDrop(columnId, event)}
      data-column-id={columnId}
    >
      <Stack direction="row" justify="between" align="center" style={{ marginBottom: 8 }}>
        <strong>{title}</strong>
        <span data-testid={`count-${columnId}`}>
          {columnId === "inprogress" ? `${cards.length}/${INPROGRESS_CAP}` : cards.length}
        </span>
      </Stack>

      <Stack direction="column" gap="sm">
        {visibleCards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            isDragging={draggingCardId === card.id}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", card.id);
              onCardDragStart(card.id, columnId);
            }}
            onDragEnd={onCardDragEnd}
            onDragOverCard={(event) => onDragOverCard(columnId, index, event)}
          />
        ))}
      </Stack>

      <Box style={{ marginTop: 8 }}>
        {isAdding ? (
          <Input
            ref={inputRef}
            value={draft}
            placeholder="Card title"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitAdd}
          />
        ) : (
          <Button variant="tertiary" size="sm" onClick={openAdd} disabled={atCap}>
            + Add card
          </Button>
        )}
      </Box>
    </Box>
  );
}
