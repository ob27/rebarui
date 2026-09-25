import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack, Tag } from "rebar-ui";
import { BoardCard } from "./BoardCard";
import type { CardData, ColumnDef, ColumnId } from "./types";

interface BoardColumnProps {
  def: ColumnDef;
  /** Full, unfiltered card list for this column — drives the count/cap badge and index math. */
  cards: CardData[];
  /** Search-filtered subset actually rendered. */
  visibleCards: CardData[];
  draggingCardId: string | null;
  onCardDragStart: (cardId: string, column: ColumnId) => void;
  onCardDragOver: (column: ColumnId, index: number) => void;
  onColumnDragOver: (column: ColumnId) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

export function BoardColumn({
  def,
  cards,
  visibleCards,
  draggingCardId,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onDragEnd,
  onAddCard,
}: BoardColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = def.cap !== undefined && cards.length >= def.cap;

  const commitAdd = () => {
    const title = draft.trim();
    if (!title || atCap) return;
    onAddCard(def.id, title);
    setDraft("");
    setAdding(false);
  };

  const cancelAdd = () => {
    setDraft("");
    setAdding(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelAdd();
    }
  };

  return (
    <Box
      as="section"
      aria-label={def.title}
      data-column={def.id}
      style={{
        flex: 1,
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        border: "1px solid var(--rebar-border-color, #d0d0d0)",
        borderRadius: 8,
        padding: 12,
        background: "var(--rebar-surface-color, transparent)",
      }}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onColumnDragOver(def.id);
      }}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDrop();
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{def.title}</strong>
        <Tag tone={atCap ? "warning" : "default"}>
          {def.cap !== undefined ? `${cards.length}/${def.cap}` : `${cards.length}`}
        </Tag>
      </Stack>

      {adding ? (
        <Input
          autoFocus
          value={draft}
          placeholder="Card title"
          aria-label={`New card title for ${def.title}`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button variant="secondary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
          + Add card
        </Button>
      )}

      <Stack gap="sm" data-drop-zone={def.id} style={{ minHeight: 40 }}>
        {visibleCards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            column={def.id}
            index={cards.findIndex((c) => c.id === card.id)}
            isDragging={draggingCardId === card.id}
            onDragStart={onCardDragStart}
            onDragOverCard={onCardDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        ))}
      </Stack>
    </Box>
  );
}
