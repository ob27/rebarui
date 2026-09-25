import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Button, Card, Input, Stack } from "rebar-ui";
import { CardItem } from "./CardItem";
import type { CardData, ColumnDef, ColumnId } from "./types";

export interface DragState {
  cardId: string;
  from: ColumnId;
}

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  query: string;
  drag: DragState | null;
  atCap: boolean;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  /** Called with the index (within this column's true card list) a drop landed on. */
  onCardDrop: (targetIndex: number) => void;
  onAddCard: (title: string) => boolean;
}

/** One Sprint Board column — the header/list/add-control shell is composed from `Card`, `Stack`,
 * `Button`, `Input`; the drag-and-drop and add-card behavior below is hand-written state and event
 * wiring, not anything a pre-built `Kanban` component provides. */
export function Column({
  def,
  cards,
  query,
  drag,
  atCap,
  onDragStart,
  onDragEnd,
  onCardDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [isOver, setIsOver] = useState(false);

  // A drag is "compatible" with this column if it either already lives here (a pure reorder,
  // which never changes this column's count) or this column has room for one more.
  const isValidDropTarget = drag !== null && (drag.from === def.id || !atCap);

  function submitAdd() {
    const title = draft.trim();
    if (!title) return;
    const added = onAddCard(title);
    if (added) {
      setDraft("");
      setAdding(false);
    }
  }

  function handleTitleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraft("");
      setAdding(false);
    }
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>) {
    if (!drag) return;
    e.preventDefault();
    setIsOver(true);
  }

  function handleColumnDrop(e: DragEvent<HTMLDivElement>) {
    if (!drag) return;
    e.preventDefault();
    setIsOver(false);
    // Bubbled up from empty space below the last card (any per-card drop stops propagation) —
    // treat it as "drop at the end."
    onCardDrop(cards.length);
  }

  return (
    <Card
      title={def.title}
      extra={
        <span className="sprint-column-count">
          {def.cap != null ? `${cards.length}/${def.cap}` : cards.length}
        </span>
      }
      activeBorder={isValidDropTarget}
      className="sprint-column"
      data-testid={`column-${def.id}`}
      onDragOver={handleColumnDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleColumnDrop}
      data-drag-over={isOver ? "true" : undefined}
    >
      <Stack gap="sm">
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title…"
            aria-label={`New card title for ${def.title}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleTitleKeyDown}
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
            data-testid={`add-card-${def.id}`}
          >
            + Add card
          </Button>
        )}

        <Stack gap="sm" data-testid={`card-list-${def.id}`}>
          {cards.map((card, index) => {
            const hidden = query !== "" && !card.title.toLowerCase().includes(query);
            return (
              <CardItem
                key={card.id}
                card={card}
                hidden={hidden}
                dragging={drag?.cardId === card.id}
                onDragStart={() => onDragStart(card.id)}
                onDragEnd={onDragEnd}
                onDragOverCard={(e) => {
                  if (!drag) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOver(true);
                }}
                onDropOnCard={(e) => {
                  if (!drag) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOver(false);
                  onCardDrop(index);
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}
