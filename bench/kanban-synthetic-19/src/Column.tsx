import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack } from "rebar-ui";
import type { CardData, ColumnDef, ColumnId } from "./types";
import { SprintCard } from "./SprintCard";

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  searchQuery: string;
  draggedCardId: string | null;
  onCardDragStart: (e: DragEvent, card: CardData, columnId: ColumnId) => void;
  onCardDragEnd: (e: DragEvent) => void;
  onCardDragOver: (e: DragEvent) => void;
  onCardDrop: (e: DragEvent, card: CardData, columnId: ColumnId) => void;
  onColumnDragOver: (e: DragEvent) => void;
  onColumnDrop: (e: DragEvent, columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

function matchesQuery(card: CardData, query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  return card.title.toLowerCase().includes(trimmed);
}

export function Column({
  def,
  cards,
  searchQuery,
  draggedCardId,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onCardDrop,
  onColumnDragOver,
  onColumnDrop,
  onAddCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const atCap = def.cap !== undefined && cards.length >= def.cap;

  function commitAdd() {
    const title = draftTitle.trim();
    if (!title || atCap) return;
    onAddCard(def.id, title);
    setDraftTitle("");
    setIsAdding(false);
  }

  function cancelAdd() {
    setDraftTitle("");
    setIsAdding(false);
  }

  function handleDraftKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  }

  return (
    <Box
      className="sprint-column"
      data-column-id={def.id}
      style={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        flexShrink: 0,
        background: "var(--rebar-surface-2, #f4f4f5)",
        borderRadius: 8,
        padding: 12,
        gap: 12,
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{def.title}</strong>
        <span data-testid="column-count">{def.cap !== undefined ? `${cards.length}/${def.cap}` : cards.length}</span>
      </Stack>

      <div
        className="sprint-column-body"
        data-testid="column-body"
        onDragOver={onColumnDragOver}
        onDrop={(e) => onColumnDrop(e, def.id)}
        style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 40 }}
      >
        {cards.map((card) => (
          <SprintCard
            key={card.id}
            card={card}
            columnId={def.id}
            matchesSearch={matchesQuery(card, searchQuery)}
            isDragging={draggedCardId === card.id}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onCardDragOver={onCardDragOver}
            onCardDrop={onCardDrop}
          />
        ))}
      </div>

      {isAdding ? (
        <Stack direction="column" gap="xs">
          <Input
            autoFocus
            placeholder="Card title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleDraftKeyDown}
            onBlur={commitAdd}
            aria-label={`New card title for ${def.title}`}
          />
        </Stack>
      ) : (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={atCap}
          data-testid="add-card-button"
        >
          + Add card
        </Button>
      )}
    </Box>
  );
}
