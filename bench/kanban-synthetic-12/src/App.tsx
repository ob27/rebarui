import { useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import "./App.css";
import { moveCard } from "./boardOps";
import { Column, type DragInfo, type DropTarget } from "./Column";
import { SEED_BOARD } from "./seedData";
import { COLUMN_CAPS, COLUMN_ORDER, type BoardState, type CardData, type ColumnId } from "./types";

let nextCardId = 1000;

export default function App() {
  const [board, setBoard] = useState<BoardState>(SEED_BOARD);
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  // Plain functions (not memoized) so they always close over the latest `dragging`/`dropTarget`
  // state — this app is small enough that re-creating them each render costs nothing, and it
  // sidesteps stale-closure bugs and the StrictMode double-invoke hazard of nesting functional
  // setState calls inside one another.
  const handleDragStart = (cardId: string, from: ColumnId) => {
    setDragging({ cardId, from });
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDropTarget(null);
  };

  const handleDragOverColumn = (columnId: ColumnId, index: number) => {
    setDropTarget((prev) => {
      if (prev && prev.column === columnId && prev.index === index) return prev;
      return { column: columnId, index };
    });
  };

  const handleDropColumn = (columnId: ColumnId) => {
    if (!dragging) return;
    const index = dropTarget && dropTarget.column === columnId ? dropTarget.index : 0;
    setBoard((prevBoard) => moveCard(prevBoard, dragging.cardId, dragging.from, columnId, index));
    setDragging(null);
    setDropTarget(null);
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    const newCard: CardData = {
      id: `new-${nextCardId++}`,
      title,
      assignee: "?",
    };
    setBoard((prevBoard) => {
      const cap = COLUMN_CAPS[columnId];
      if (cap !== undefined && prevBoard[columnId].length >= cap) return prevBoard;
      return { ...prevBoard, [columnId]: [newCard, ...prevBoard[columnId]] };
    });
  };

  return (
    <Box className="sprint-board-page">
      <Stack gap="lg">
        <Stack direction="row" align="center" gap="md" className="sprint-board-toolbar">
          <h1 className="sprint-board-title">Sprint Board</h1>
          <Input
            size="md"
            placeholder="Search cards by title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search cards"
            className="sprint-search-input"
          />
        </Stack>

        <div className="sprint-board-columns">
          {COLUMN_ORDER.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              cards={board[columnId]}
              query={query}
              dragging={dragging}
              dropTarget={dropTarget}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOverColumn={handleDragOverColumn}
              onDropColumn={handleDropColumn}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
      </Stack>
    </Box>
  );
}
