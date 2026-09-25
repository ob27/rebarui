import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack } from "rebar-ui";
import { SprintCard } from "./SprintCard";
import type { ColumnData } from "./types";
import { matchesSearch } from "./utils";

export interface DropTarget {
  columnId: ColumnData["id"];
  index: number;
}

export interface BoardColumnProps {
  column: ColumnData;
  search: string;
  draggedCardId: string | null;
  dropTarget: DropTarget | null;
  onCardDragStart: (event: DragEvent<HTMLDivElement>, cardId: string, columnId: ColumnData["id"]) => void;
  onCardDragOver: (event: DragEvent<HTMLDivElement>, columnId: ColumnData["id"], index: number) => void;
  onColumnDragOver: (event: DragEvent<HTMLDivElement>, columnId: ColumnData["id"]) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, columnId: ColumnData["id"]) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  onAddCard: (columnId: ColumnData["id"], title: string) => void;
}

const DROP_INDICATOR_STYLE = {
  height: 4,
  borderRadius: 2,
  background: "var(--rebar-color-accent, #4a6cf7)",
  margin: "2px 0",
};

/** One Sprint Board column: header (title + count/cap), the card list (with drag-and-drop
 * reorder/cross-column-move indicators), and the inline "+ Add card" control. All drag/search/
 * add-card *behavior* lives in `App`; this component only renders based on the props it's given —
 * matching the "write it yourself" primitives-tier constraint, this is plain composition of
 * `Box`/`Stack`/`Button`/`Input`, not a pre-built Kanban unit. */
export function BoardColumn({
  column,
  search,
  draggedCardId,
  dropTarget,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onDragEnd,
  onAddCard,
}: BoardColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const atCap = column.cap != null && column.cards.length >= column.cap;
  const countLabel = column.cap != null ? `${column.cards.length}/${column.cap}` : `${column.cards.length}`;

  const closeAdd = () => {
    setIsAdding(false);
    setDraftTitle("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmed = draftTitle.trim();
      if (trimmed && !atCap) {
        onAddCard(column.id, trimmed);
      }
      closeAdd();
    } else if (event.key === "Escape") {
      closeAdd();
    }
  };

  const showIndicatorAt = (index: number) =>
    draggedCardId != null && dropTarget?.columnId === column.id && dropTarget.index === index;

  return (
    <Box
      className="board-column"
      style={{
        width: 280,
        flex: "0 0 280px",
        border: "1px solid var(--rebar-color-border, #d0d0d0)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "var(--rebar-color-surface, #f7f7f8)",
        alignSelf: "flex-start",
      }}
      onDragOver={(event) => onColumnDragOver(event, column.id)}
      onDrop={(event) => onDrop(event, column.id)}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{column.title}</strong>
        <span data-testid="column-count">{countLabel}</span>
      </Stack>

      <Stack direction="column" gap="sm">
        {column.cards.map((card, index) => (
          <div key={card.id}>
            {showIndicatorAt(index) ? <div style={DROP_INDICATOR_STYLE} /> : null}
            <SprintCard
              card={card}
              hidden={!matchesSearch(card.title, search)}
              onDragStart={(event) => onCardDragStart(event, card.id, column.id)}
              onDragOver={(event) => onCardDragOver(event, column.id, index)}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
        {showIndicatorAt(column.cards.length) ? <div style={DROP_INDICATOR_STYLE} /> : null}
      </Stack>

      {isAdding ? (
        <Input
          autoFocus
          size="sm"
          placeholder="Card title"
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={closeAdd}
        />
      ) : (
        <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setIsAdding(true)}>
          + Add card
        </Button>
      )}
    </Box>
  );
}
