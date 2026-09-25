// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and the
// kanban-antd-* condition's own constraint). Split into additional files under src/ as you see fit.
import { useMemo, useState } from "react";
import { Card as AntCard, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { SprintCardBody } from "./SprintCard";
import { makeId, seedBoard } from "./seedData";
import { COLUMN_META, COLUMN_ORDER } from "./types";
import type { BoardState, CardData, ColumnId } from "./types";

function findColumnOfCard(board: BoardState, cardId: string): ColumnId | undefined {
  return COLUMN_ORDER.find((columnId) => board[columnId].some((c) => c.id === cardId));
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(() => seedBoard());
  const [query, setQuery] = useState("");
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleIds = useMemo(() => {
    const ids = new Set<string>();
    COLUMN_ORDER.forEach((columnId) =>
      board[columnId].forEach((card) => {
        if (!normalizedQuery || card.title.toLowerCase().includes(normalizedQuery)) {
          ids.add(card.id);
        }
      }),
    );
    return ids;
  }, [board, normalizedQuery]);

  function handleAddCard(columnId: ColumnId, title: string) {
    setBoard((prev) => {
      const cap = COLUMN_META[columnId].cap;
      if (cap !== undefined && prev[columnId].length >= cap) return prev;
      const newCard: CardData = { id: makeId(), title, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string;
    const columnId = findColumnOfCard(board, activeId);
    setActiveCard(columnId ? board[columnId].find((c) => c.id === activeId) ?? null : null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    setBoard((prev) => {
      const activeColumn = findColumnOfCard(prev, activeId);
      if (!activeColumn) return prev;

      const overColumn = overId.startsWith("column:")
        ? (overId.slice("column:".length) as ColumnId)
        : findColumnOfCard(prev, overId);
      if (!overColumn || activeColumn === overColumn) return prev;

      const cap = COLUMN_META[overColumn].cap;
      if (cap !== undefined && prev[overColumn].length >= cap) return prev;

      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];
      const activeIndex = activeItems.findIndex((c) => c.id === activeId);
      if (activeIndex < 0) return prev;
      const card = activeItems[activeIndex];

      const overIndex = overId.startsWith("column:")
        ? overItems.length
        : (() => {
            const idx = overItems.findIndex((c) => c.id === overId);
            return idx >= 0 ? idx : overItems.length;
          })();

      const newActiveItems = activeItems.filter((c) => c.id !== activeId);
      const newOverItems = [
        ...overItems.slice(0, overIndex),
        card,
        ...overItems.slice(overIndex),
      ];

      return { ...prev, [activeColumn]: newActiveItems, [overColumn]: newOverItems };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (overId.startsWith("column:")) return;

    setBoard((prev) => {
      const activeColumn = findColumnOfCard(prev, activeId);
      const overColumn = findColumnOfCard(prev, overId);
      if (!activeColumn || !overColumn || activeColumn !== overColumn) return prev;

      const items = prev[activeColumn];
      const activeIndex = items.findIndex((c) => c.id === activeId);
      const overIndex = items.findIndex((c) => c.id === overId);
      if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) return prev;

      return { ...prev, [activeColumn]: arrayMove(items, activeIndex, overIndex) };
    });
  }

  return (
    <div
      style={{
        padding: 24,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        gap: 16,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Sprint Board
        </Typography.Title>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search cards by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 280 }}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0, overflowX: "auto" }}>
          {COLUMN_ORDER.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              cards={board[columnId]}
              visibleIds={visibleIds}
              onAddCard={handleAddCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <AntCard size="small" styles={{ body: { padding: 12 } }} style={{ width: 256 }}>
              <SprintCardBody card={activeCard} />
            </AntCard>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
