import { useState } from "react";
import type { CSSProperties, DragEvent, KeyboardEvent } from "react";
import { Box, Stack, Button, Input, Tag } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { CardData, ColumnData } from "./types";

export type DropPosition = "before" | "after";

const dropIndicatorStyle: CSSProperties = {
  height: 3,
  borderRadius: 2,
  background: "var(--rebar-accent, #3b6ef6)",
  margin: "2px 0",
};

interface ColumnProps {
  column: ColumnData;
  visibleCards: CardData[];
  draggingCardId: string | null;
  dragOverColumnId: string | null;
  dragOverCardId: string | null;
  dragOverPosition: DropPosition | null;
  atCap: boolean;
  onAddCard: (columnId: ColumnData["id"], title: string) => void;
  onCardDragStart: (card: CardData, columnId: ColumnData["id"]) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (
    e: DragEvent<HTMLDivElement>,
    columnId: ColumnData["id"],
    cardId: string,
  ) => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>, columnId: ColumnData["id"]) => void;
  onColumnDrop: (e: DragEvent<HTMLDivElement>, columnId: ColumnData["id"]) => void;
}

export function Column({
  column,
  visibleCards,
  draggingCardId,
  dragOverColumnId,
  dragOverCardId,
  dragOverPosition,
  atCap,
  onAddCard,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onColumnDrop,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const startAdd = () => {
    if (atCap) return;
    setAdding(true);
    setDraft("");
  };

  const cancelAdd = () => {
    setAdding(false);
    setDraft("");
  };

  const commitAdd = () => {
    const title = draft.trim();
    if (!title || atCap) {
      cancelAdd();
      return;
    }
    onAddCard(column.id, title);
    cancelAdd();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  };

  const showEndIndicator = dragOverColumnId === column.id && dragOverCardId === null;

  return (
    <Box
      className="sprint-column"
      data-testid={`column-${column.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 280,
        maxWidth: 320,
        flex: "1 1 0",
        background: "var(--rebar-surface-2, #f3f3f3)",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Stack direction="row" align="center" justify="between" style={{ marginBottom: 12 }}>
        <Stack direction="row" align="center" gap="sm">
          <strong>{column.title}</strong>
          {column.cap ? (
            <Tag tone={atCap ? "warning" : "default"}>
              {column.cards.length}/{column.cap}
            </Tag>
          ) : (
            <Tag>{column.cards.length}</Tag>
          )}
        </Stack>
      </Stack>

      <div
        onDragOver={(e) => onColumnDragOver(e, column.id)}
        onDrop={(e) => onColumnDrop(e, column.id)}
        style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 40 }}
        data-testid={`column-body-${column.id}`}
      >
        {visibleCards.map((card) => {
          const isDragOverTarget =
            dragOverColumnId === column.id && dragOverCardId === card.id;
          return (
            <div key={card.id}>
              {isDragOverTarget && dragOverPosition === "before" ? (
                <div style={dropIndicatorStyle} />
              ) : null}
              <SprintCard
                card={card}
                dragging={draggingCardId === card.id}
                activeBorder={isDragOverTarget}
                onDragStart={() => onCardDragStart(card, column.id)}
                onDragEnd={onCardDragEnd}
                onDragOver={(e) => onCardDragOver(e, column.id, card.id)}
              />
              {isDragOverTarget && dragOverPosition === "after" ? (
                <div style={dropIndicatorStyle} />
              ) : null}
            </div>
          );
        })}
        {showEndIndicator ? <div style={dropIndicatorStyle} /> : null}
      </div>

      <div style={{ marginTop: 12 }}>
        {adding ? (
          <Input
            autoFocus
            placeholder="Card title"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={`New card title for ${column.title}`}
          />
        ) : (
          <Button variant="secondary" size="sm" onClick={startAdd} disabled={atCap}>
            + Add card
          </Button>
        )}
      </div>
    </Box>
  );
}
