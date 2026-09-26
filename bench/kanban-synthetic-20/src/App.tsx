import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Input } from "rebar-ui";
import "./App.css";
import { Column } from "./Column";
import type { DropTarget } from "./Column";
import { makeId, seedBoard } from "./data";
import { COLUMN_ORDER, COLUMN_TITLES, IN_PROGRESS_CAP } from "./types";
import type { BoardState, CardData, ColumnId } from "./types";

interface DragState {
  cardId: string;
  fromColumn: ColumnId;
}

/**
 * Sprint Board — the "kanban-synthetic" benchmark condition. The static shell (columns, cards,
 * tags, avatars, inputs, buttons) is composed entirely from rebar-ui's Synthetic-tier components
 * (`Card`, `Tag` via `Card`'s own `labels` prop, `Avatar`, `Stack`, `Input`, `Button`) — but
 * `Kanban` itself is never imported, and every behavior below (drag-and-drop, search-filter,
 * add-card, the "In Progress" cap) is hand-written state, not delegated to a pre-built component.
 */
export default function App() {
  const [board, setBoard] = useState<BoardState>(() => seedBoard());
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const dragRef = useRef<DragState | null>(null);

  function handleCardDragStart(column: ColumnId, card: CardData) {
    return (event: DragEvent<HTMLDivElement>) => {
      dragRef.current = { cardId: card.id, fromColumn: column };
      setDraggingCardId(card.id);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.id);
    };
  }

  function handleCardDragEnd() {
    dragRef.current = null;
    setDraggingCardId(null);
    setDropTarget(null);
  }

  function handleCardDragOver(column: ColumnId, index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const rect = event.currentTarget.getBoundingClientRect();
      const isBefore = event.clientY < rect.top + rect.height / 2;
      setDropTarget({ column, index: isBefore ? index : index + 1 });
    };
  }

  function handleColumnDragOver(column: ColumnId) {
    return (event: DragEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      // Only sets an end-of-list target; a hover over an individual card (handleCardDragOver)
      // takes precedence since it fires after this on the way to the card.
      setDropTarget((current) =>
        current && current.column === column ? current : { column, index: board[column].length },
      );
    };
  }

  function handleDrop(column: ColumnId) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const drag = dragRef.current;
      const target = dropTarget;
      dragRef.current = null;
      setDraggingCardId(null);
      setDropTarget(null);
      if (!drag) return;

      const { cardId, fromColumn } = drag;
      const targetIndex = target && target.column === column ? target.index : board[column].length;

      setBoard((prev) => {
        // Reject a cross-column drop into "In Progress" once it's already at its soft cap —
        // reordering within In Progress itself never changes its count, so that's always allowed.
        if (column === "inProgress" && fromColumn !== "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) {
          return prev;
        }

        const sourceList = prev[fromColumn];
        const cardIndex = sourceList.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;
        const card = sourceList[cardIndex];

        if (fromColumn === column) {
          const next = sourceList.filter((c) => c.id !== cardId);
          let insertAt = targetIndex;
          if (cardIndex < targetIndex) insertAt -= 1;
          insertAt = Math.max(0, Math.min(insertAt, next.length));
          next.splice(insertAt, 0, card);
          return { ...prev, [column]: next };
        }

        const newSource = sourceList.filter((c) => c.id !== cardId);
        const destList = [...prev[column]];
        const insertAt = Math.max(0, Math.min(targetIndex, destList.length));
        destList.splice(insertAt, 0, card);
        return { ...prev, [fromColumn]: newSource, [column]: destList };
      });
    };
  }

  function handleAddCard(column: ColumnId, title: string) {
    setBoard((prev) => {
      if (column === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) return prev;
      const newCard: CardData = { id: makeId(), title, assignee: "?" };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  }

  return (
    <div className="sprint-board-page">
      <Input
        className="sprint-search"
        type="search"
        placeholder="Search cards by title…"
        aria-label="Search cards"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="sprint-board">
        {COLUMN_ORDER.map((columnId) => (
          <Column
            key={columnId}
            columnId={columnId}
            title={COLUMN_TITLES[columnId]}
            cards={board[columnId]}
            cap={columnId === "inProgress" ? IN_PROGRESS_CAP : undefined}
            query={search}
            draggingCardId={draggingCardId}
            dropTarget={dropTarget}
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={handleCardDragEnd}
            onCardDragOver={handleCardDragOver}
            onColumnDragOver={handleColumnDragOver}
            onDrop={handleDrop}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
    </div>
  );
}
