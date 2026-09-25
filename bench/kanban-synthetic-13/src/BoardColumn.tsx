import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack, Tag } from "rebar-ui";
import { CardItem } from "./CardItem";
import { COLUMN_LABELS, IN_PROGRESS_CAP } from "./types";
import type { ColumnId, DropTarget, SprintCard } from "./types";

export interface BoardColumnProps {
  column: ColumnId;
  cards: SprintCard[];
  visibleCards: SprintCard[];
  isFiltering: boolean;
  draggingCardId: string | null;
  dropTarget: DropTarget | null;
  onAddCard: (column: ColumnId, title: string) => void;
  onCardDragStart: (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => void;
  onColumnDragOver: (event: DragEvent<HTMLDivElement>, column: ColumnId) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, column: ColumnId) => void;
}

export function BoardColumn({
  column,
  cards,
  visibleCards,
  isFiltering,
  draggingCardId,
  dropTarget,
  onAddCard,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
}: BoardColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = column === "in-progress" && cards.length >= IN_PROGRESS_CAP;

  const commitAdd = () => {
    const title = draft.trim();
    if (!title || atCap) return;
    onAddCard(column, title);
    setDraft("");
    setAdding(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft("");
      setAdding(false);
    }
  };

  return (
    <Stack
      direction="column"
      gap="sm"
      style={{
        flex: "1 1 0",
        minWidth: 260,
        background: "var(--rebar-color-surface, #f5f5f5)",
        borderRadius: 8,
        padding: "var(--rebar-space-sm, 8px)",
      }}
      data-column={column}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{COLUMN_LABELS[column]}</strong>
        <Tag tone={atCap ? "warning" : "default"}>
          {column === "in-progress" ? `${cards.length}/${IN_PROGRESS_CAP}` : cards.length}
        </Tag>
      </Stack>

      <div>
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!draft.trim()) setAdding(false);
            }}
          />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            disabled={atCap}
            onClick={() => setAdding(true)}
            style={{ width: "100%" }}
          >
            + Add card
          </Button>
        )}
      </div>

      <Box
        style={{ minHeight: 40, flex: "1 1 auto" }}
        onDragOver={(event) => onColumnDragOver(event, column)}
        onDrop={(event) => onDrop(event, column)}
      >
        <Stack direction="column" gap="sm">
          {visibleCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              column={column}
              isDragging={draggingCardId === card.id}
              isDropTarget={
                !!dropTarget &&
                dropTarget.column === column &&
                dropTarget.anchorId === card.id &&
                dropTarget.position === "before"
              }
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              onCardDragOver={onCardDragOver}
            />
          ))}
          {isFiltering && visibleCards.length === 0 && cards.length > 0 ? (
            <span style={{ color: "var(--rebar-color-text-muted, #888)", fontSize: "0.875em" }}>
              No matching cards
            </span>
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
}
