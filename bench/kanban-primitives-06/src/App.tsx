import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { moveCard } from "./board";
import { nextId, seedBoard } from "./seed";
import type { BoardState, ColumnId } from "./types";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

interface DragOverInfo {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(seedBoard);
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingFromColumn, setDraggingFromColumn] = useState<ColumnId | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<DragOverInfo | null>(null);

  function handleCardDragStart(cardId: string, column: ColumnId) {
    setDraggingCardId(cardId);
    setDraggingFromColumn(column);
  }

  function handleCardDragEnd() {
    setDraggingCardId(null);
    setDraggingFromColumn(null);
    setDragOverInfo(null);
  }

  function handleDragOverCard(column: ColumnId, index: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setDragOverInfo({ column, index: isAfter ? index + 1 : index });
  }

  function handleDragOverColumn(column: ColumnId, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverInfo({ column, index: board[column].length });
  }

  function handleDrop(column: ColumnId, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!draggingCardId || !draggingFromColumn) return;
    const toIndex = dragOverInfo && dragOverInfo.column === column ? dragOverInfo.index : board[column].length;
    setBoard((prev) => moveCard(prev, draggingCardId, draggingFromColumn, column, toIndex));
    setDraggingCardId(null);
    setDraggingFromColumn(null);
    setDragOverInfo(null);
  }

  function handleAddCard(column: ColumnId, title: string) {
    setBoard((prev) => {
      if (column === "inprogress" && prev.inprogress.length >= 4) return prev;
      const newCard = { id: nextId(), title, assignee: "?" };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  }

  const normalizedSearch = search.trim().toLowerCase();

  return (
    <Box style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack direction="column" gap="md">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search cards"
        />
        <Stack direction="row" gap="md" align="start" style={{ alignItems: "flex-start" }}>
          {COLUMNS.map(({ id, title }) => {
            const cards = board[id];
            const visibleCards = normalizedSearch
              ? cards.filter((card) => card.title.toLowerCase().includes(normalizedSearch))
              : cards;
            return (
              <Column
                key={id}
                columnId={id}
                title={title}
                cards={cards}
                visibleCards={visibleCards}
                draggingCardId={draggingCardId}
                onCardDragStart={handleCardDragStart}
                onCardDragEnd={handleCardDragEnd}
                onDragOverCard={handleDragOverCard}
                onDragOverColumn={handleDragOverColumn}
                onDrop={handleDrop}
                onAddCard={handleAddCard}
                isOver={dragOverInfo?.column === id && draggingCardId !== null}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
