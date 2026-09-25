import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Column from "./Column";
import { CardVisual } from "./CardItem";
import { COLUMNS, getCap } from "./types";
import type { CardData, ColumnId } from "./types";
import { seedCards } from "./seed";

type Board = Record<ColumnId, CardData[]>;

/** Resolve which column a given draggable/droppable id belongs to.
 * A column id itself resolves to that column (dropping on empty space). */
function findContainer(board: Board, id: string): ColumnId | undefined {
  if (id in board) return id as ColumnId;
  for (const columnId of Object.keys(board) as ColumnId[]) {
    if (board[columnId].some((card) => card.id === id)) return columnId;
  }
  return undefined;
}

function findCard(board: Board, id: string): CardData | undefined {
  for (const columnId of Object.keys(board) as ColumnId[]) {
    const found = board[columnId].find((card) => card.id === id);
    if (found) return found;
  }
  return undefined;
}

let nextCardSeq = 1000;

export default function App() {
  const [board, setBoard] = useState<Board>(seedCards);
  const [query, setQuery] = useState("");
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleAddCard(columnId: ColumnId, title: string) {
    setBoard((prev) => {
      const cap = getCap(columnId);
      if (cap !== undefined && prev[columnId].length >= cap) return prev;
      const newCard: CardData = { id: `card-new-${nextCardSeq++}`, title };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveCard(findCard(board, String(event.active.id)) ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeContainer = findContainer(board, activeId);
    const overContainer = findContainer(board, overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setBoard((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((c) => c.id === activeId);
      if (activeIndex === -1) return prev;

      // Reject the move (leave the card where it is) if the destination is at its cap.
      const cap = getCap(overContainer);
      if (cap !== undefined && overItems.length >= cap) return prev;

      const overIndex = overItems.findIndex((c) => c.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      const movingCard = activeItems[activeIndex];
      const newActiveItems = activeItems.filter((c) => c.id !== activeId);
      const newOverItems = [...overItems.slice(0, newIndex), movingCard, ...overItems.slice(newIndex)];

      return { ...prev, [activeContainer]: newActiveItems, [overContainer]: newOverItems };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(board, activeId);
    const overContainer = findContainer(board, overId);
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    const items = board[activeContainer];
    const activeIndex = items.findIndex((c) => c.id === activeId);
    const overIndex = items.findIndex((c) => c.id === overId);
    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

    setBoard((prev) => ({
      ...prev,
      [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
    }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Sprint Board
      </Typography.Title>

      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search cards by title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 20 }}
        aria-label="Search cards"
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              cap={col.cap}
              cards={board[col.id]}
              query={query}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
        <DragOverlay>{activeCard ? <CardVisual card={activeCard} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
