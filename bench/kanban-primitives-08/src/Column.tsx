import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Stack, Button, Input } from "rebar-ui";
import { CardItem } from "./CardItem";
import type { CardData, ColumnId } from "./types";

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  cards: CardData[];
  visibleIds: Set<string>;
  cap?: number;
  dragCardId: string | null;
  onCardDragStart: (cardId: string, column: ColumnId) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (column: ColumnId, index: number) => void;
  onColumnDragOver: (column: ColumnId) => void;
  onDrop: (column: ColumnId) => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

export function Column({
  columnId,
  title,
  cards,
  visibleIds,
  cap,
  dragCardId,
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

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && !atCap) {
      onAddCard(columnId, trimmed);
    }
    setDraft("");
    setAdding(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commit();
    } else if (event.key === "Escape") {
      setDraft("");
      setAdding(false);
    }
  };

  return (
    <Box
      className="rebar-kanban-column"
      data-testid={`column-${columnId}`}
      data-card-count={cards.length}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onColumnDragOver(columnId);
      }}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDrop(columnId);
      }}
      style={{
        flex: "1 1 260px",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--rebar-border, #ccc)",
        borderRadius: 8,
        padding: 12,
        background: "var(--rebar-surface-sunken, rgba(0,0,0,0.02))",
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <h2 style={{ margin: 0, fontSize: "1rem" }}>{title}</h2>
        <span data-testid={`column-count-${columnId}`} style={{ fontSize: "0.85rem", opacity: 0.75 }}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </span>
      </Stack>

      <Stack gap="sm" style={{ marginTop: 12, minHeight: 40 }}>
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            visible={visibleIds.has(card.id)}
            isDragging={dragCardId === card.id}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", card.id);
              onCardDragStart(card.id, columnId);
            }}
            onDragEnd={onCardDragEnd}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const rect = event.currentTarget.getBoundingClientRect();
              const isAfter = event.clientY - rect.top > rect.height / 2;
              onCardDragOver(columnId, index + (isAfter ? 1 : 0));
            }}
          />
        ))}
      </Stack>

      <div style={{ marginTop: 12 }}>
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title"
            aria-label={`New card title for ${title}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
            + Add card
          </Button>
        )}
      </div>
    </Box>
  );
}
