import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { Input, Stack } from "rebar-ui";
import { BoardColumn } from "./BoardColumn";
import { SEED_COLUMNS } from "./seedData";
import { COLUMN_ORDER, IN_PROGRESS_CAP } from "./types";
import type { ColumnId, ColumnsState, DropTarget, SprintCard } from "./types";

function makeId(): string {
  return `card-${Math.random().toString(36).slice(2, 10)}`;
}

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(SEED_COLUMNS);
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<ColumnId | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const isFiltering = search.trim().length > 0;

  const visibleColumns = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = {} as Record<ColumnId, SprintCard[]>;
    for (const columnId of COLUMN_ORDER) {
      result[columnId] = query
        ? columns[columnId].filter((card) => card.title.toLowerCase().includes(query))
        : columns[columnId];
    }
    return result;
  }, [columns, search]);

  const handleAddCard = (column: ColumnId, title: string) => {
    setColumns((prev) => {
      if (column === "in-progress" && prev[column].length >= IN_PROGRESS_CAP) return prev;
      const card: SprintCard = { id: makeId(), title, assignee: "?" };
      return { ...prev, [column]: [card, ...prev[column]] };
    });
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => {
    setDraggingCardId(card.id);
    setDraggingFrom(column);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.id);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
    setDraggingFrom(null);
    setDropTarget(null);
  };

  const handleCardDragOver = (event: DragEvent<HTMLDivElement>, card: SprintCard, column: ColumnId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!draggingCardId || card.id === draggingCardId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isAbove = event.clientY < rect.top + rect.height / 2;
    const next: DropTarget = {
      column,
      anchorId: card.id,
      position: isAbove ? "before" : "after",
    };
    setDropTarget((prev) =>
      prev &&
      prev.column === next.column &&
      prev.anchorId === next.anchorId &&
      prev.position === next.position
        ? prev
        : next,
    );
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, column: ColumnId) => {
    event.preventDefault();
    if (!draggingCardId) return;
    setDropTarget((prev) =>
      prev && prev.column === column && prev.anchorId === null
        ? prev
        : { column, anchorId: null, position: "after" },
    );
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, column: ColumnId) => {
    event.preventDefault();
    const cardId = draggingCardId ?? event.dataTransfer.getData("text/plain");
    const fromColumn = draggingFrom;
    const target = dropTarget;
    setDraggingCardId(null);
    setDraggingFrom(null);
    setDropTarget(null);
    if (!cardId || !fromColumn) return;

    setColumns((prev) => {
      const fromArr = [...prev[fromColumn]];
      const cardIdx = fromArr.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;
      const [card] = fromArr.splice(cardIdx, 1);

      const sameColumn = fromColumn === column;
      const toArr = sameColumn ? fromArr : [...prev[column]];

      // Reject a cross-column drop that would exceed the "In Progress" cap — a no-op, the
      // dragged card simply snaps back since state never changes.
      if (column === "in-progress" && !sameColumn && toArr.length >= IN_PROGRESS_CAP) {
        return prev;
      }

      let insertIndex = toArr.length;
      if (target && target.column === column) {
        if (target.anchorId === null) {
          insertIndex = toArr.length;
        } else {
          const anchorIdx = toArr.findIndex((c) => c.id === target.anchorId);
          if (anchorIdx !== -1) {
            insertIndex = target.position === "before" ? anchorIdx : anchorIdx + 1;
          }
        }
      }
      insertIndex = Math.max(0, Math.min(insertIndex, toArr.length));
      toArr.splice(insertIndex, 0, card);

      return {
        ...prev,
        [fromColumn]: sameColumn ? toArr : fromArr,
        [column]: toArr,
      };
    });
  };

  return (
    <Stack direction="column" gap="lg" style={{ padding: "var(--rebar-space-lg, 24px)", minHeight: "100vh" }}>
      <Stack direction="column" gap="sm">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search cards"
          style={{ maxWidth: 320 }}
        />
      </Stack>
      <Stack direction="row" gap="md" align="start" style={{ flexWrap: "wrap" }}>
        {COLUMN_ORDER.map((columnId) => (
          <BoardColumn
            key={columnId}
            column={columnId}
            cards={columns[columnId]}
            visibleCards={visibleColumns[columnId]}
            isFiltering={isFiltering}
            draggingCardId={draggingCardId}
            dropTarget={dropTarget}
            onAddCard={handleAddCard}
            onCardDragStart={handleDragStart}
            onCardDragEnd={handleDragEnd}
            onCardDragOver={handleCardDragOver}
            onColumnDragOver={handleColumnDragOver}
            onDrop={handleDrop}
          />
        ))}
      </Stack>
    </Stack>
  );
}
