// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useMemo, useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { addCard, moveCard } from "./board";
import { ColumnView } from "./ColumnView";
import { initialBoard } from "./seedData";
import { COLUMNS } from "./types";
import type { BoardState, ColumnId, SprintCard } from "./types";

let nextCardSeq = 1000;

export default function App() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const visibleByColumn = useMemo(() => {
    const result: Record<ColumnId, SprintCard[]> = { todo: [], "in-progress": [], done: [] };
    for (const column of COLUMNS) {
      result[column.id] = normalizedQuery
        ? board[column.id].filter((c) => c.title.toLowerCase().includes(normalizedQuery))
        : board[column.id];
    }
    return result;
  }, [board, normalizedQuery]);

  const handleDragStartCard = (id: string) => setDraggingId(id);
  const handleDragEndCard = () => setDraggingId(null);

  const handleDragOverColumn = (columnId: ColumnId, index: number) => {
    if (!draggingId) return;
    setBoard((prev) => {
      const next = moveCard(prev, COLUMNS, draggingId, columnId, index);
      return next === prev ? prev : next;
    });
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    const card: SprintCard = {
      id: `card-${nextCardSeq++}`,
      title,
      status: null,
      assignee: "?",
    };
    setBoard((prev) => addCard(prev, COLUMNS, columnId, card));
  };

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--rebar-space-lg, 24px)" }}>
      <Stack gap="lg">
        <Stack gap="sm">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            type="search"
            placeholder="Search cards by title…"
            aria-label="Search cards"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="md" align="start">
          {COLUMNS.map((column) => (
            <ColumnView
              key={column.id}
              column={column}
              allCards={board[column.id]}
              visibleCards={visibleByColumn[column.id]}
              draggingId={draggingId}
              onDragStartCard={handleDragStartCard}
              onDragEndCard={handleDragEndCard}
              onDragOverColumn={handleDragOverColumn}
              onAddCard={handleAddCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
