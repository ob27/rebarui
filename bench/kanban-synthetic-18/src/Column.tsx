import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { CardData, ColumnData, ColumnId } from "./types";

export interface ColumnProps {
  column: ColumnData;
  cards: CardData[];
  draggingCardId: string | null;
  isMatch: (card: CardData) => boolean;
  onCardDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, columnId: ColumnId) => void;
  onCardDragEnd: () => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
  onColumnDrop: (e: DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({
  column,
  cards,
  draggingCardId,
  isMatch,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  // The badge always reflects the column's true card count (`cards.length`), never a
  // search-filtered count — per spec, the cap badge must stay accurate during an active search.
  const atCap = column.cap !== undefined && cards.length >= column.cap;
  const countLabel = column.cap !== undefined ? `${cards.length}/${column.cap}` : `${cards.length}`;

  function commit() {
    const trimmed = value.trim();
    if (!trimmed || atCap) return;
    onAddCard(column.id, trimmed);
    setValue("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setValue("");
      setAdding(false);
    }
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        flexShrink: 0,
      }}
    >
      <Stack direction="row" justify="between" align="center" gap="sm" style={{ marginBottom: 8 }}>
        <strong>{column.title}</strong>
        <span data-testid={`column-count-${column.id}`}>{countLabel}</span>
      </Stack>

      {adding ? (
        <div style={{ marginBottom: 8 }}>
          <Input
            autoFocus
            size="sm"
            placeholder="Card title"
            aria-label={`New card title for ${column.title}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!value.trim()) setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant="tertiary"
          size="sm"
          disabled={atCap}
          onClick={() => setAdding(true)}
          style={{ marginBottom: 8, alignSelf: "flex-start" }}
        >
          + Add card
        </Button>
      )}

      <div
        data-column-list={column.id}
        onDragOver={(e) => onColumnDragOver(e, column.id)}
        onDrop={(e) => onColumnDrop(e, column.id)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 48,
          flex: 1,
        }}
      >
        {/* Every card in the column renders unconditionally, always — search only toggles each
           card's `visible` prop (which SprintCard turns into `display: none`), it never filters
           the array before mapping. A non-matching card stays a real, mounted DOM element. */}
        {cards.map((card) => (
          <SprintCard
            key={card.id}
            card={card}
            visible={isMatch(card)}
            dragging={draggingCardId === card.id}
            onDragStart={(e) => onCardDragStart(e, card.id, column.id)}
            onDragEnd={onCardDragEnd}
          />
        ))}
      </div>
    </Box>
  );
}
