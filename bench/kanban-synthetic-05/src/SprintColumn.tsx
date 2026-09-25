import { useState, type DragEvent, type KeyboardEvent } from "react";
import { Box, Stack, Button, Input } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { CardData, ColumnId, DragPayload } from "./types";
import { IN_PROGRESS_CAP } from "./seedData";

interface SprintColumnProps {
  id: ColumnId;
  title: string;
  allCards: CardData[];
  visibleCards: CardData[];
  draggingId: string | null;
  onDragStartCard: (payload: DragPayload) => void;
  onDragEndCard: () => void;
  onDropOnCard: (e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) => void;
  onDropOnColumn: (e: DragEvent<HTMLDivElement>, column: ColumnId) => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

export function SprintColumn({
  id,
  title,
  allCards,
  visibleCards,
  draggingId,
  onDragStartCard,
  onDragEndCard,
  onDropOnCard,
  onDropOnColumn,
  onAddCard,
}: SprintColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const atCap = id === "inProgress" && allCards.length >= IN_PROGRESS_CAP;
  const countLabel = id === "inProgress" ? `${allCards.length}/${IN_PROGRESS_CAP}` : `${allCards.length}`;

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed || atCap) return;
    onAddCard(id, trimmed);
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <Box
      data-column-id={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropOnColumn(e, id)}
      style={{
        flex: "1 1 0",
        minWidth: 240,
        background: "var(--rebar-color-surface-sunken, #f4f4f5)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{title}</strong>
        <span data-testid={`${id}-count`}>{countLabel}</span>
      </Stack>

      {adding ? (
        <Input
          autoFocus
          size="sm"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!draft.trim()) setAdding(false);
          }}
        />
      ) : (
        <Button
          variant="secondary"
          size="sm"
          disabled={atCap}
          onClick={() => setAdding(true)}
        >
          + Add card
        </Button>
      )}

      <Stack direction="column" gap="sm">
        {visibleCards.map((card) => (
          <SprintCard
            key={card.id}
            card={card}
            column={id}
            index={allCards.findIndex((c) => c.id === card.id)}
            draggingId={draggingId}
            onDragStartCard={onDragStartCard}
            onDragEndCard={onDragEndCard}
            onDropOnCard={onDropOnCard}
          />
        ))}
      </Stack>
    </Box>
  );
}
