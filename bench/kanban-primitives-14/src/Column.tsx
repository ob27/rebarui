import { Box, Stack } from "rebar-ui";
import type { CardData, ColumnConfig } from "./types";
import KanbanCard from "./KanbanCard";
import AddCardForm from "./AddCardForm";

interface ColumnProps {
  column: ColumnConfig;
  /** All cards in this column (true order, ignoring the search filter). */
  allCards: CardData[];
  /** The subset of `allCards` that should actually render, given the active search term. */
  visibleCards: CardData[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropBefore: (cardId: string, targetColumnId: ColumnConfig["id"], beforeCardId: string | null) => void;
  onAddCard: (columnId: ColumnConfig["id"], title: string) => void;
}

export default function Column({
  column,
  allCards,
  visibleCards,
  draggedId,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onAddCard,
}: ColumnProps) {
  const atCap = column.cap !== undefined && allCards.length >= column.cap;
  const countLabel = column.cap !== undefined ? `${allCards.length}/${column.cap}` : `${allCards.length}`;

  return (
    <Box
      as="section"
      style={{
        flex: "1 1 0",
        minWidth: 240,
        border: "1px solid var(--rebar-color-border, #ccc)",
        borderRadius: 8,
        padding: "var(--rebar-space-md, 16px)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--rebar-space-sm, 8px)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (draggedId) onDropBefore(draggedId, column.id, null);
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{column.title}</strong>
        <span style={{ fontSize: "0.85em", color: "var(--rebar-color-text-secondary)" }}>
          {countLabel}
        </span>
      </Stack>

      <Stack direction="column" gap="sm">
        {visibleCards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggedId === card.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropBefore={(beforeId) => {
              if (draggedId) onDropBefore(draggedId, column.id, beforeId);
            }}
          />
        ))}
      </Stack>

      <AddCardForm disabled={atCap} onAdd={(title) => onAddCard(column.id, title)} />
    </Box>
  );
}
