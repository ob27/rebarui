import { useState } from "react";
import { Stack, Input } from "rebar-ui";
import { COLUMNS } from "./types";
import type { Board, ColumnId } from "./types";
import { seedBoard } from "./data";
import { addCard, isAtCap, matchesSearch, moveCard, nextCardId } from "./board";
import { Column } from "./Column";

interface HoverState {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<Board>(seedBoard);
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<ColumnId | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const handleDragStartCard = (cardId: string, fromColumn: ColumnId) => {
    setDraggingCardId(cardId);
    setDraggingFrom(fromColumn);
  };

  const clearDragState = () => {
    setDraggingCardId(null);
    setDraggingFrom(null);
    setHover(null);
  };

  const handleHoverIndex = (column: ColumnId, index: number) => {
    setHover({ column, index });
  };

  const handleDropColumn = (columnId: ColumnId) => {
    if (draggingCardId && draggingFrom) {
      const targetIndex = hover && hover.column === columnId ? hover.index : board[columnId].length;
      setBoard((b) => moveCard(b, draggingCardId, draggingFrom, columnId, targetIndex));
    }
    clearDragState();
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setBoard((b) => addCard(b, columnId, { id: nextCardId(), title }));
  };

  return (
    <Stack direction="column" gap="lg" className="sprint-board" style={{ padding: 24 }}>
      <h1>Sprint Board</h1>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search cards by title…"
        aria-label="Search cards"
        style={{ maxWidth: 320 }}
      />

      <Stack direction="row" gap="lg" align="start" className="sprint-columns">
        {COLUMNS.map((def) => {
          const allCards = board[def.id];
          const visibleCards = allCards.filter((card) => matchesSearch(card, search));
          return (
            <Column
              key={def.id}
              def={def}
              allCards={allCards}
              visibleCards={visibleCards}
              atCap={isAtCap(board, def.id)}
              draggingCardId={draggingCardId}
              onDragStartCard={handleDragStartCard}
              onDragEndCard={clearDragState}
              onHoverIndex={handleHoverIndex}
              onDropColumn={handleDropColumn}
              onAddCard={handleAddCard}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
