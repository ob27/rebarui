import { useState, type DragEvent, type KeyboardEvent } from "react";
import { Box, Stack, Button, Input } from "rebar-ui";
import { CardItem } from "./CardItem";
import type { ColumnDef, SprintCard } from "./types";

interface DropTarget {
  column: string;
  index: number;
}

interface ColumnProps {
  column: ColumnDef;
  cards: SprintCard[];
  searchQuery: string;
  draggedCardId: string | null;
  dropTarget: DropTarget | null;
  onCardDragStart: (cardId: string, column: string) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (e: DragEvent<HTMLDivElement>, column: string, index: number) => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>, column: string) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, column: string) => void;
  onAddCard: (column: string, title: string) => boolean;
}

export function Column({
  column,
  cards,
  searchQuery,
  draggedCardId,
  dropTarget,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const atCap = column.cap !== undefined && cards.length >= column.cap;
  const query = searchQuery.trim().toLowerCase();

  function startAdding() {
    if (atCap) return;
    setIsAdding(true);
    setDraftTitle("");
  }

  function commitAdd() {
    const title = draftTitle.trim();
    if (!title) return;
    const added = onAddCard(column.id, title);
    if (added) {
      setDraftTitle("");
      setIsAdding(false);
    }
  }

  function cancelAdd() {
    setIsAdding(false);
    setDraftTitle("");
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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
      as="section"
      style={{
        flex: "1 1 0",
        minWidth: 260,
        background: "var(--rebar-color-surface-subtle, #f5f5f5)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      onDragOver={(e) => onColumnDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
      data-column-id={column.id}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{column.title}</strong>
        <span data-testid={`count-${column.id}`}>
          {column.cap !== undefined ? `${cards.length}/${column.cap}` : cards.length}
        </span>
      </Stack>

      <Stack direction="column" gap="sm">
        {cards.map((card, index) => {
          const isHidden = query.length > 0 && !card.title.toLowerCase().includes(query);
          const showIndicatorBefore = dropTarget?.column === column.id && dropTarget.index === index;
          return (
            <div key={card.id} style={{ display: isHidden ? "none" : "block" }}>
              {showIndicatorBefore ? (
                <div style={{ height: 2, background: "var(--rebar-color-accent, #3366ff)", marginBottom: 4 }} />
              ) : null}
              <CardItem
                card={card}
                isDragging={draggedCardId === card.id}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", card.id);
                  onCardDragStart(card.id, column.id);
                }}
                onDragEnd={onCardDragEnd}
                onDragOverCard={(e) => onCardDragOver(e, column.id, index)}
              />
            </div>
          );
        })}
        {dropTarget?.column === column.id && dropTarget.index === cards.length ? (
          <div style={{ height: 2, background: "var(--rebar-color-accent, #3366ff)" }} />
        ) : null}
      </Stack>

      {isAdding ? (
        <Stack direction="column" gap="xs">
          <Input
            autoFocus
            placeholder="Card title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={() => {
              if (!draftTitle.trim()) cancelAdd();
            }}
          />
        </Stack>
      ) : (
        <Button variant="tertiary" size="sm" onClick={startAdding} disabled={atCap}>
          + Add card
        </Button>
      )}
    </Box>
  );
}
