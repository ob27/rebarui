import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import { computeDropIndex } from "./dragUtils";
import { seedColumns } from "./seedData";
import { COLUMNS } from "./types";
import type { CardData, ColumnId } from "./types";

const COLUMN_CAP: Partial<Record<ColumnId, number>> = Object.fromEntries(
  COLUMNS.filter((c) => c.cap !== undefined).map((c) => [c.id, c.cap]),
);

function makeCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [columnsState, setColumnsState] = useState<Record<ColumnId, CardData[]>>(seedColumns);
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ column: ColumnId; index: number } | null>(null);

  // A ref (not state) for the in-flight drag's identity — read synchronously inside native drag
  // event handlers without waiting on a render.
  const draggingRef = useRef<{ id: string; from: ColumnId } | null>(null);

  function isMatch(card: CardData): boolean {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return card.title.toLowerCase().includes(term);
  }

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, index: number) {
    setColumnsState((prev) => {
      const fromList = prev[from];
      const cardIdx = fromList.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;
      const card = fromList[cardIdx];

      // Reject a cross-column move into a column already at its cap — a same-column reorder
      // never changes that column's count, so it's always allowed.
      if (to !== from) {
        const cap = COLUMN_CAP[to];
        if (cap !== undefined && prev[to].length >= cap) {
          return prev;
        }
      }

      const newFromList = fromList.filter((c) => c.id !== cardId);
      const baseToList = from === to ? newFromList : prev[to].slice();
      const clampedIndex = Math.max(0, Math.min(index, baseToList.length));
      const newToList = [...baseToList.slice(0, clampedIndex), card, ...baseToList.slice(clampedIndex)];

      return { ...prev, [from]: newFromList, [to]: newToList };
    });
  }

  function addCard(columnId: ColumnId, title: string) {
    setColumnsState((prev) => {
      const cap = COLUMN_CAP[columnId];
      if (cap !== undefined && prev[columnId].length >= cap) return prev;
      const newCard: CardData = { id: makeCardId(), title, status: null, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  function handleCardDragStart(e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) {
    draggingRef.current = { id: cardId, from };
    setDraggingCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
  }

  function handleCardDragEnd() {
    draggingRef.current = null;
    setDraggingCardId(null);
    setDropTarget(null);
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    const dragging = draggingRef.current;
    if (!dragging) return;
    const index = computeDropIndex(e.currentTarget, e.clientY, dragging.id);
    setDropTarget({ column: columnId, index });
  }

  function handleColumnDrop(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    const dragging = draggingRef.current;
    if (!dragging) return;
    const index =
      dropTarget && dropTarget.column === columnId ? dropTarget.index : columnsState[columnId].length;
    moveCard(dragging.id, dragging.from, columnId, index);
    draggingRef.current = null;
    setDraggingCardId(null);
    setDropTarget(null);
  }

  return (
    <Box style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="lg">
        <div>
          <h1 style={{ margin: "0 0 12px" }}>Sprint Board</h1>
          <Input
            aria-label="Search cards"
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </div>

        <Stack direction="row" gap="lg" align="start" style={{ overflowX: "auto" }}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={columnsState[column.id]}
              draggingCardId={draggingCardId}
              isMatch={isMatch}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onAddCard={addCard}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
