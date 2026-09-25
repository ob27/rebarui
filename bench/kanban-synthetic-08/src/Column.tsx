import { useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Button, Input, Stack } from "rebar-ui";
import { KanbanCard } from "./KanbanCard";
import type { CardData, ColumnDef, ColumnId } from "./types";

export interface DropIndicator {
  /** The visible card being hovered near, or null when hovering empty column space (drop at
   * the end). */
  anchorCardId: string | null;
  /** Whether the indicator line goes above (`true`) or below (`false`) the anchor card. */
  before: boolean;
}

interface ColumnProps {
  def: ColumnDef;
  /** The true, unfiltered list — drives the count/cap badge regardless of search. */
  cards: CardData[];
  /** The search-filtered list — what's actually rendered. */
  visibleCards: CardData[];
  cap?: number;
  draggingCardId: string | null;
  dropIndicator: DropIndicator | null;
  onPointerDownCard: (e: ReactPointerEvent<HTMLDivElement>, card: CardData, column: ColumnId) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

const DROP_INDICATOR_STYLE = {
  height: 3,
  borderRadius: 2,
  background: "var(--rebar-color-primary, #0066cc)",
  margin: "2px 0",
};

export function Column({
  def,
  cards,
  visibleCards,
  cap,
  draggingCardId,
  dropIndicator,
  onPointerDownCard,
  onPointerMove,
  onPointerUp,
  onAddCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const atCap = cap !== undefined && cards.length >= cap;
  const countLabel = cap !== undefined ? `${cards.length}/${cap}` : `${cards.length}`;

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

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  }

  const showEndIndicator = dropIndicator !== null && dropIndicator.anchorCardId === null;

  return (
    <div
      data-column-id={def.id}
      style={{
        flex: "1 1 0",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: "var(--rebar-space-sm, 8px)",
        background: "var(--rebar-color-bg-secondary, #f5f5f5)",
        borderRadius: 8,
        padding: "var(--rebar-space-sm, 8px)",
      }}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{def.title}</strong>
        <span data-testid={`${def.id}-count`}>{countLabel}</span>
      </Stack>

      {isAdding ? (
        <Input
          autoFocus
          size="sm"
          placeholder="Card title"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!draftTitle.trim()) cancelAdd();
          }}
          aria-label={`New card title for ${def.title}`}
        />
      ) : (
        <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setIsAdding(true)}>
          + Add card
        </Button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--rebar-space-sm, 8px)", minHeight: 40 }}>
        {visibleCards.map((card) => (
          <div key={card.id}>
            {dropIndicator?.anchorCardId === card.id && dropIndicator.before ? (
              <div style={DROP_INDICATOR_STYLE} />
            ) : null}
            <KanbanCard
              card={card}
              isDragging={draggingCardId === card.id}
              onPointerDown={(e) => onPointerDownCard(e, card, def.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
            {dropIndicator?.anchorCardId === card.id && !dropIndicator.before ? (
              <div style={DROP_INDICATOR_STYLE} />
            ) : null}
          </div>
        ))}
        {showEndIndicator ? <div style={DROP_INDICATOR_STYLE} /> : null}
      </div>
    </div>
  );
}
