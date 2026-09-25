import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Box, Stack, Input, Button } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { CardData, ColumnData } from "./types";

interface ColumnProps {
  column: ColumnData;
  cards: CardData[];
  visibleIds: Set<string>;
  draggingCardId: string | null;
  onDragStartCard: (event: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onDragEndCard: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOverCard: (event: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOverColumn: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onAddCard: (columnId: ColumnData["id"], title: string) => void;
}

export function Column({
  column,
  cards,
  visibleIds,
  draggingCardId,
  onDragStartCard,
  onDragEndCard,
  onDragOverCard,
  onDragOverColumn,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  const atCap = column.cap !== undefined && cards.length >= column.cap;

  const commitAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddCard(column.id, trimmed);
    setValue("");
    setAdding(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAdd();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setValue("");
      setAdding(false);
    }
  };

  return (
    <Box
      className="sprint-column"
      data-column-id={column.id}
      onDragOver={onDragOverColumn}
      onDrop={onDrop}
      style={{
        flex: "1 1 0",
        minWidth: 260,
        background: "var(--rebar-surface-subtle, #f4f4f5)",
        borderRadius: 8,
        padding: 12,
        minHeight: 400,
      }}
    >
      <Stack direction="row" justify="between" align="center" style={{ marginBottom: 8 }}>
        <strong>{column.title}</strong>
        <span data-testid={`column-count-${column.id}`}>
          {column.cap !== undefined ? `${cards.length}/${column.cap}` : cards.length}
        </span>
      </Stack>

      <Stack direction="column" gap="sm">
        {adding ? (
          <Input
            autoFocus
            value={value}
            placeholder="Card title"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!value.trim()) setAdding(false);
            }}
          />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            disabled={atCap}
            onClick={() => setAdding(true)}
          >
            + Add card
          </Button>
        )}

        {cards.map((card, index) => (
          <SprintCard
            key={card.id}
            card={card}
            dragging={draggingCardId === card.id}
            hidden={!visibleIds.has(card.id)}
            onDragStart={(event) => onDragStartCard(event, card.id)}
            onDragEnd={onDragEndCard}
            onDragOver={(event) => onDragOverCard(event, index)}
          />
        ))}
      </Stack>
    </Box>
  );
}
