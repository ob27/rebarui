// Sprint Board — kanban-synthetic-08 condition: the static shell is composed from Synthetic-tier
// `Card`/`Tag`/`Avatar`/`Stack`/`Input`/`Button` (see KanbanCard.tsx, Column.tsx), but the
// drag-and-drop, search-filter, and add-card *behavior* below is hand-written from scratch — no
// `Kanban` import from rebar-ui, no drag-and-drop library.
//
// Drag-and-drop uses the Pointer Events API directly (setPointerCapture on pointerdown, so
// move/up events keep routing to the drag source even once the cursor leaves it) rather than the
// native HTML5 drag-and-drop API — it's simpler to reason about and to drive from a test, since it
// needs only ordinary mouse/touch events instead of a synthetic DataTransfer-bearing DragEvent.

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Input, Stack } from "rebar-ui";
import { Column } from "./Column";
import type { DropIndicator } from "./Column";
import { KanbanCard } from "./KanbanCard";
import { addCardToTop, moveCard } from "./board";
import { SEED_BOARD } from "./seedData";
import { COLUMN_CAPS, COLUMN_DEFS } from "./types";
import type { BoardState, ColumnId } from "./types";

interface DragState {
  cardId: string;
  fromColumn: ColumnId;
  pointerId: number;
  /** Pointer position relative to the dragged card's own top-left, so the ghost tracks the
   * cursor at the same spot the user originally grabbed it. */
  offsetX: number;
  offsetY: number;
  width: number;
  x: number;
  y: number;
}

interface DropTarget {
  column: ColumnId;
  /** Index into the column's true (unfiltered) card array — what actually gets passed to
   * moveCard. */
  trueIndex: number;
  anchorCardId: string | null;
  before: boolean;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(SEED_BOARD);
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const newCardCounter = useRef(0);

  // Reads the real DOM under the pointer to find which column/card is being hovered. Cards carry
  // `data-card-id`, columns carry `data-column-id` (set in KanbanCard.tsx / Column.tsx).
  const computeDropTarget = useCallback(
    (clientX: number, clientY: number, draggedCardId: string): DropTarget | null => {
      const el = document.elementFromPoint(clientX, clientY);
      const columnEl = el?.closest<HTMLElement>("[data-column-id]");
      if (!columnEl || !columnEl.dataset.columnId) return null;
      const column = columnEl.dataset.columnId as ColumnId;
      const trueList = board[column];

      const cardEl = el?.closest<HTMLElement>("[data-card-id]");
      const anchorId = cardEl?.dataset.cardId;
      if (cardEl && anchorId && anchorId !== draggedCardId) {
        const rect = cardEl.getBoundingClientRect();
        const before = clientY < rect.top + rect.height / 2;
        const anchorIndex = trueList.findIndex((c) => c.id === anchorId);
        const trueIndex = anchorIndex === -1 ? trueList.length : before ? anchorIndex : anchorIndex + 1;
        return { column, trueIndex, anchorCardId: anchorId, before };
      }

      // Hovering empty column space (or over the dragged card's own original slot) — drop at
      // the end.
      return { column, trueIndex: trueList.length, anchorCardId: null, before: false };
    },
    [board],
  );

  function handlePointerDownCard(e: ReactPointerEvent<HTMLDivElement>, cardId: string, column: ColumnId) {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const rect = target.getBoundingClientRect();
    setDragState({
      cardId,
      fromColumn: column,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      x: e.clientX,
      y: e.clientY,
    });
    setDropTarget(null);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    e.preventDefault();
    const { clientX, clientY } = e;
    setDragState((prev) => (prev ? { ...prev, x: clientX, y: clientY } : prev));
    setDropTarget(computeDropTarget(clientX, clientY, dragState.cardId));
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    const target = computeDropTarget(e.clientX, e.clientY, dragState.cardId) ?? {
      column: dragState.fromColumn,
      trueIndex: board[dragState.fromColumn].length,
      anchorCardId: null,
      before: false,
    };
    const { cardId, fromColumn } = dragState;
    setBoard((prev) => moveCard(prev, cardId, fromColumn, target.column, target.trueIndex));
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragState(null);
    setDropTarget(null);
  }

  function handleAddCard(column: ColumnId, title: string) {
    newCardCounter.current += 1;
    setBoard((prev) =>
      addCardToTop(prev, column, {
        id: `new-${newCardCounter.current}`,
        title,
        assignee: "?",
      }),
    );
  }

  const searchTerm = search.trim().toLowerCase();
  const draggedCard = dragState ? board[dragState.fromColumn].find((c) => c.id === dragState.cardId) ?? null : null;

  return (
    <div
      style={{
        padding: "var(--rebar-space-lg, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--rebar-space-lg, 24px)",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <Stack direction="column" gap="sm">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search cards"
        />
      </Stack>

      <div style={{ display: "flex", gap: "var(--rebar-space-lg, 24px)", alignItems: "flex-start" }}>
        {COLUMN_DEFS.map((def) => {
          const cards = board[def.id];
          const visibleCards = searchTerm
            ? cards.filter((c) => c.title.toLowerCase().includes(searchTerm))
            : cards;
          const indicator: DropIndicator | null =
            dropTarget && dropTarget.column === def.id
              ? { anchorCardId: dropTarget.anchorCardId, before: dropTarget.before }
              : null;

          return (
            <Column
              key={def.id}
              def={def}
              cards={cards}
              visibleCards={visibleCards}
              cap={COLUMN_CAPS[def.id]}
              draggingCardId={dragState?.cardId ?? null}
              dropIndicator={indicator}
              onPointerDownCard={(e, card, column) => handlePointerDownCard(e, card.id, column)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onAddCard={handleAddCard}
            />
          );
        })}
      </div>

      {dragState && draggedCard ? (
        <div
          style={{
            position: "fixed",
            left: dragState.x - dragState.offsetX,
            top: dragState.y - dragState.offsetY,
            width: dragState.width,
            pointerEvents: "none",
            opacity: 0.9,
            zIndex: 1000,
            transform: "rotate(1deg)",
          }}
        >
          <KanbanCard
            card={draggedCard}
            isDragging={false}
            onPointerDown={() => {}}
            onPointerMove={() => {}}
            onPointerUp={() => {}}
          />
        </div>
      ) : null}
    </div>
  );
}
