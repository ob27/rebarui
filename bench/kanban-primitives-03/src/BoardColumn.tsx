import { useState, type DragEvent, type KeyboardEvent } from "react";
import { Box, Button, Input, Stack } from "rebar-ui";
import { CardItem } from "./CardItem";
import type { CardData, ColumnId } from "./types";

interface BoardColumnProps {
  columnId: ColumnId;
  title: string;
  cards: CardData[];
  totalCount: number;
  cap?: number;
  onAddCard: (columnId: ColumnId, title: string) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) => void;
  onDropOnCard: (e: DragEvent<HTMLDivElement>, targetCardId: string, columnId: ColumnId) => void;
  onDropOnColumn: (e: DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
}

export function BoardColumn({
  columnId,
  title,
  cards,
  totalCount,
  cap,
  onAddCard,
  onDragStart,
  onDropOnCard,
  onDropOnColumn,
}: BoardColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const atCap = cap != null && totalCount >= cap;

  function commitAdd() {
    const trimmed = draftTitle.trim();
    if (!trimmed || atCap) return;
    onAddCard(columnId, trimmed);
    setDraftTitle("");
    setIsAdding(false);
  }

  function cancelAdd() {
    setDraftTitle("");
    setIsAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitAdd();
    else if (e.key === "Escape") cancelAdd();
  }

  return (
    <Box
      as="section"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropOnColumn(e, columnId)}
      style={{ flex: "1 1 0", minWidth: 260 }}
    >
      <Stack direction="row" justify="between" align="center" style={{ marginBottom: 8 }}>
        <strong>{title}</strong>
        <span>{cap != null ? `${totalCount}/${cap}` : totalCount}</span>
      </Stack>
      <Stack gap="sm" style={{ minHeight: 40 }}>
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            columnId={columnId}
            onDragStart={onDragStart}
            onDropOnCard={onDropOnCard}
          />
        ))}
      </Stack>
      <div style={{ marginTop: 8 }}>
        {isAdding ? (
          <Input
            autoFocus
            value={draftTitle}
            placeholder="Card title"
            aria-label="New card title"
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setIsAdding(true)}>
            + Add card
          </Button>
        )}
      </div>
    </Box>
  );
}
