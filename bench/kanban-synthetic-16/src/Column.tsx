import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Button, Input, Stack } from "rebar-ui";
import { CardItem } from "./CardItem";
import { IN_PROGRESS_CAP } from "./data";
import { computeDropIndex } from "./dnd";
import type { CardData, ColumnDef, ColumnId } from "./types";

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  search: string;
  draggingCardId: string | null;
  onDragStart: (e: DragEvent<HTMLDivElement>, card: CardData, fromColumn: ColumnId) => void;
  onDragEnd: () => void;
  onDrop: (toColumn: ColumnId, index: number) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

function matchesSearch(card: CardData, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return card.title.toLowerCase().includes(query);
}

export function Column({
  def,
  cards,
  search,
  draggingCardId,
  onDragStart,
  onDragEnd,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const isCapped = def.id === "in-progress";
  const atCap = isCapped && cards.length >= IN_PROGRESS_CAP;

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const container = listRef.current;
    if (!container) return;
    const index = computeDropIndex(container, e.clientY, draggingCardId ?? undefined);
    onDrop(def.id, index);
  }

  function submitAdd() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddCard(def.id, trimmed);
    setDraft("");
    setAdding(false);
  }

  function handleAddKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <div className="board-column" data-testid={`column-${def.id}`}>
      <div className="board-column-header">
        <span className="board-column-title">{def.title}</span>
        <span className="board-column-count" data-testid={`column-count-${def.id}`}>
          {isCapped ? `${cards.length}/${IN_PROGRESS_CAP}` : cards.length}
        </span>
      </div>

      {adding ? (
        <Input
          autoFocus
          size="sm"
          placeholder="Card title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleAddKeyDown}
          aria-label={`New card title for ${def.title}`}
        />
      ) : (
        <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => setAdding(true)}>
          + Add card
        </Button>
      )}

      <div
        ref={listRef}
        className="board-column-list"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Stack gap="sm">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              visible={matchesSearch(card, search)}
              dragging={draggingCardId === card.id}
              onDragStart={(e) => onDragStart(e, card, def.id)}
              onDragEnd={onDragEnd}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
}
