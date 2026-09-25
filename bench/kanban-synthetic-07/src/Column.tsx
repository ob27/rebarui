import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack, Tag } from "rebar-ui";
import type { CardData, ColumnId } from "./types";
import { CardItem } from "./CardItem";

interface ColumnProps {
  id: ColumnId;
  title: string;
  cap?: number;
  cards: CardData[];
  search: string;
  isDragOver: boolean;
  onAddCard: (title: string) => void;
  onCardDragStart: (cardId: string) => void;
  onCardDragOver: (index: number, before: boolean) => void;
  onColumnDragOver: () => void;
  onDrop: () => void;
  onCardDragEnd: () => void;
}

function matchesSearch(card: CardData, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return card.title.toLowerCase().includes(needle);
}

export function Column({
  id,
  title,
  cap,
  cards,
  search,
  isDragOver,
  onAddCard,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onCardDragEnd,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = cap != null && cards.length >= cap;

  // Keep each card's real (unfiltered) index so drag/reorder math stays correct even while a
  // search is hiding some cards — the count/cap badge and drop math both need the true array,
  // never the filtered view.
  const visible = cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => matchesSearch(card, search));

  function commitAdd() {
    const nextTitle = draft.trim();
    if (!nextTitle || atCap) return; // title required; also a no-op once at cap
    onAddCard(nextTitle);
    setDraft("");
    setAdding(false);
  }

  function cancelAdd() {
    setDraft("");
    setAdding(false);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitAdd();
    if (e.key === "Escape") cancelAdd();
  }

  return (
    <Box
      data-rebar-part="kanban-column"
      data-column-id={id}
      style={{
        flex: "1 1 0",
        minWidth: 240,
        borderRadius: 8,
        padding: 8,
        outline: isDragOver ? "2px dashed var(--rebar-color-border-strong, #888)" : "2px dashed transparent",
        outlineOffset: 2,
      }}
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        // Only reaches here when the pointer is over empty column space, not a card — CardItem's
        // own onDragOver stops propagation before it can bubble up to here.
        e.preventDefault();
        onColumnDragOver();
      }}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <Stack direction="row" justify="between" align="center" gap="sm" style={{ marginBottom: 8 }}>
        <strong>{title}</strong>
        <Tag tone={atCap ? "warning" : "default"}>{cap != null ? `${cards.length}/${cap}` : cards.length}</Tag>
      </Stack>

      <Stack gap="sm">
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title..."
            aria-label={`New card title for ${title}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <Button variant="secondary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
            + Add card
          </Button>
        )}

        {visible.map(({ card, index }) => (
          <CardItem
            key={card.id}
            card={card}
            onDragStart={() => onCardDragStart(card.id)}
            onDragOver={(before) => onCardDragOver(index, before)}
            onDragEnd={onCardDragEnd}
          />
        ))}
      </Stack>
    </Box>
  );
}
