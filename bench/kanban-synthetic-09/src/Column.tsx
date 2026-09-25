import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Stack, Tag, Input, Button } from "rebar-ui";
import type { CardData, ColumnDef, ColumnId } from "./types";
import { CardItem } from "./CardItem";

export interface ColumnProps {
  def: ColumnDef;
  /** All cards currently in this column, in order (true state — unaffected by search). */
  allCards: CardData[];
  /** The subset of `allCards` that should actually render, in the same relative order. */
  visibleCards: CardData[];
  atCap: boolean;
  draggingCardId: string | null;
  onDragStartCard: (cardId: string, fromColumn: ColumnId) => void;
  onDragEndCard: () => void;
  onHoverIndex: (columnId: ColumnId, index: number) => void;
  onDropColumn: (columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({
  def,
  allCards,
  visibleCards,
  atCap,
  draggingCardId,
  onDragStartCard,
  onDragEndCard,
  onHoverIndex,
  onDropColumn,
  onAddCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startAdding = () => {
    if (atCap) return;
    setIsAdding(true);
    setDraft("");
    // Focus after the input mounts.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const commitAdd = () => {
    const title = draft.trim();
    if (!title) return;
    onAddCard(def.id, title);
    setDraft("");
    setIsAdding(false);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setDraft("");
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

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only fires when the pointer is over the column's own background (below the last card, or an
    // empty column) — every card handles its own, more precise dragover and stops it bubbling here.
    onHoverIndex(def.id, allCards.length);
  };

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDropColumn(def.id);
  };

  return (
    <Stack
      direction="column"
      gap="sm"
      className="sprint-column"
      style={{ flex: 1, minWidth: 240 }}
      onDragOver={handleColumnDragOver}
      onDrop={handleColumnDrop}
      data-column-id={def.id}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{def.title}</strong>
        <Tag tone={atCap ? "warning" : "default"}>
          {def.cap !== undefined ? `${allCards.length}/${def.cap}` : allCards.length}
        </Tag>
      </Stack>

      <Stack direction="column" gap="sm" className="sprint-column-cards">
        {visibleCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            index={allCards.findIndex((c) => c.id === card.id)}
            isDragging={draggingCardId === card.id}
            onDragStart={() => onDragStartCard(card.id, def.id)}
            onDragEnd={onDragEndCard}
            onHoverIndex={(index) => onHoverIndex(def.id, index)}
          />
        ))}
      </Stack>

      {isAdding ? (
        <Stack direction="column" gap="xs">
          <Input
            ref={inputRef}
            value={draft}
            placeholder="Card title"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Stack>
      ) : (
        <Button variant="tertiary" onClick={startAdding} disabled={atCap}>
          + Add card
        </Button>
      )}
    </Stack>
  );
}
