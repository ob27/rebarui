import { useMemo, useState } from "react";
import { Input, Typography } from "antd";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import { COLUMNS, INITIAL_BOARD } from "./data";
import type { BoardState, CardData, ColumnId } from "./types";

let nextCardId = 1000;

export default function App() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const visibleIds = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return null; // null means "everything visible" — avoids building a full set on every keystroke
    }
    const ids = new Set<string>();
    for (const col of Object.keys(board) as ColumnId[]) {
      for (const card of board[col]) {
        if (card.title.toLowerCase().includes(query)) {
          ids.add(card.id);
        }
      }
    }
    return ids;
  }, [board, search]);

  function handleAddCard(colId: ColumnId, title: string) {
    setBoard((prev) => {
      const meta = COLUMNS.find((c) => c.id === colId)!;
      if (meta.cap !== undefined && prev[colId].length >= meta.cap) {
        return prev; // reject: would exceed the column's cap
      }
      const newCard: CardData = {
        id: `card-${nextCardId++}`,
        title,
        assignee: "U",
      };
      return { ...prev, [colId]: [newCard, ...prev[colId]] };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setBoard((prev) => {
      const columnIds = Object.keys(prev) as ColumnId[];
      const sourceCol = columnIds.find((col) => prev[col].some((c) => c.id === activeId));
      if (!sourceCol) return prev;

      const isColumnTarget = COLUMNS.some((c) => c.id === overId);
      const destCol = isColumnTarget
        ? (overId as ColumnId)
        : columnIds.find((col) => prev[col].some((c) => c.id === overId));
      if (!destCol) return prev;

      const sourceCards = [...prev[sourceCol]];
      const activeIndex = sourceCards.findIndex((c) => c.id === activeId);
      const [movedCard] = sourceCards.splice(activeIndex, 1);

      const sameColumn = sourceCol === destCol;
      const destCards = sameColumn ? sourceCards : [...prev[destCol]];

      const destMeta = COLUMNS.find((c) => c.id === destCol)!;
      if (!sameColumn && destMeta.cap !== undefined && destCards.length >= destMeta.cap) {
        return prev; // reject: dropping here would exceed the column's cap
      }

      let insertIndex = destCards.length;
      if (!isColumnTarget) {
        const overIndex = destCards.findIndex((c) => c.id === overId);
        if (overIndex !== -1) insertIndex = overIndex;
      }
      destCards.splice(insertIndex, 0, movedCard);

      if (sameColumn) {
        return { ...prev, [sourceCol]: destCards };
      }
      return { ...prev, [sourceCol]: sourceCards, [destCol]: destCards };
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Sprint Board
      </Typography.Title>

      <Input.Search
        placeholder="Search cards by title…"
        allowClear
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{ maxWidth: 360, marginBottom: 20 }}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMNS.map((meta) => {
            const cards = board[meta.id];
            const atCap = meta.cap !== undefined && cards.length >= meta.cap;
            return (
              <Column
                key={meta.id}
                meta={meta}
                cards={cards}
                visibleIds={visibleIds ?? new Set(cards.map((c) => c.id))}
                atCap={atCap}
                onAddCard={(title) => handleAddCard(meta.id, title)}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
