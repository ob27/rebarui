import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { Input } from "rebar-ui";
import { Column } from "./Column";
import { COLUMNS } from "./types";
import type { CardData, ColumnId } from "./types";
import { initialCards, makeId } from "./seedData";
import "./App.css";

type CardsState = Record<ColumnId, CardData[]>;
type DragState = { cardId: string; from: ColumnId } | null;
type DropTarget = { column: ColumnId; index: number } | null;

export default function App() {
  const [cards, setCards] = useState<CardsState>(initialCards);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState<DragState>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);

  const query = search.trim().toLowerCase();
  const visibleCards = useMemo(() => {
    const result = {} as Record<ColumnId, CardData[]>;
    for (const column of COLUMNS) {
      result[column.id] = query
        ? cards[column.id].filter((c) => c.title.toLowerCase().includes(query))
        : cards[column.id];
    }
    return result;
  }, [cards, query]);

  function handleDragStart(e: DragEvent, cardId: string, from: ColumnId) {
    e.dataTransfer.effectAllowed = "move";
    setDragging({ cardId, from });
  }

  function handleDragEnd() {
    setDragging(null);
    setDropTarget(null);
  }

  function handleCardDragOver(e: DragEvent, columnId: ColumnId, index: number) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const insertIndex = e.clientY < midpoint ? index : index + 1;
    setDropTarget((prev) =>
      prev?.column === columnId && prev.index === insertIndex ? prev : { column: columnId, index: insertIndex },
    );
  }

  function handleContainerDragOver(e: DragEvent, columnId: ColumnId) {
    e.preventDefault();
    if (!dragging) return;
    if (e.target === e.currentTarget) {
      const length = cards[columnId].length;
      setDropTarget((prev) => (prev?.column === columnId && prev.index === length ? prev : { column: columnId, index: length }));
    }
  }

  function handleDrop(e: DragEvent, columnId: ColumnId) {
    e.preventDefault();
    if (!dragging) return;
    const { cardId, from } = dragging;

    const destColumnDef = COLUMNS.find((c) => c.id === columnId);
    if (from !== columnId && destColumnDef?.cap !== undefined && cards[columnId].length >= destColumnDef.cap) {
      setDragging(null);
      setDropTarget(null);
      return;
    }

    setCards((prev) => {
      const draggedCard = prev[from].find((c) => c.id === cardId);
      if (!draggedCard) return prev;

      const sourceList = prev[from].filter((c) => c.id !== cardId);
      const rawIndex = dropTarget?.column === columnId ? dropTarget.index : prev[columnId].length;

      if (from === columnId) {
        const origIndex = prev[columnId].findIndex((c) => c.id === cardId);
        let adjusted = rawIndex > origIndex ? rawIndex - 1 : rawIndex;
        adjusted = Math.min(Math.max(adjusted, 0), sourceList.length);
        const destList = [...sourceList];
        destList.splice(adjusted, 0, draggedCard);
        return { ...prev, [columnId]: destList };
      }

      const destList = [...prev[columnId]];
      const clamped = Math.min(Math.max(rawIndex, 0), destList.length);
      destList.splice(clamped, 0, draggedCard);
      return { ...prev, [from]: sourceList, [columnId]: destList };
    });

    setDragging(null);
    setDropTarget(null);
  }

  function handleAddCard(columnId: ColumnId, title: string) {
    setCards((prev) => {
      const columnDef = COLUMNS.find((c) => c.id === columnId);
      if (columnDef?.cap !== undefined && prev[columnId].length >= columnDef.cap) return prev;
      const newCard: CardData = { id: makeId(), title, status: null, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <div className="sprint-board">
      <h1>Sprint Board</h1>
      <Input
        placeholder="Search cards…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search cards"
        className="sprint-search"
      />
      <div className="sprint-columns">
        {COLUMNS.map((column) => {
          const atCap = column.cap !== undefined && cards[column.id].length >= column.cap;
          return (
            <Column
              key={column.id}
              column={column}
              cards={cards[column.id]}
              visibleCards={visibleCards[column.id]}
              draggingCardId={dragging?.cardId ?? null}
              dropTarget={dropTarget}
              atCap={atCap}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onCardDragOver={handleCardDragOver}
              onContainerDragOver={handleContainerDragOver}
              onDrop={handleDrop}
              onAddCard={handleAddCard}
            />
          );
        })}
      </div>
    </div>
  );
}
