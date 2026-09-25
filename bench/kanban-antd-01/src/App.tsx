import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CardItem } from "./CardItem";
import { Column } from "./Column";
import { COLUMNS, createInitialBoard, nextId } from "./seed";
import type { BoardState, CardData, ColumnId } from "./types";
import "./App.css";

const { Title } = Typography;

/** Which column (by id) currently holds the card/column with this dnd-kit id.
 * Column droppables use their own `ColumnId` as the id, so a hit there is
 * returned directly; a card hit requires scanning each column's card list. */
function findColumn(board: BoardState, id: string): ColumnId | undefined {
  if (id === "todo" || id === "in-progress" || id === "done") return id;
  for (const def of COLUMNS) {
    if (board[def.id].some((c) => c.id === id)) return def.id;
  }
  return undefined;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const normalizedSearch = search.trim().toLowerCase();
  const visibleIds = useMemo(() => {
    if (!normalizedSearch) return null; // null = "everything visible", avoids building a full-board Set on every keystroke for nothing
    const ids = new Set<string>();
    for (const def of COLUMNS) {
      for (const card of board[def.id]) {
        if (card.title.toLowerCase().includes(normalizedSearch)) ids.add(card.id);
      }
    }
    return ids;
  }, [board, normalizedSearch]);

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as CardData | undefined;
    setActiveCard(card ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeColumn = findColumn(board, activeId);
    const overColumn = findColumn(board, overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setBoard((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];
      const activeIndex = activeItems.findIndex((c) => c.id === activeId);
      if (activeIndex === -1) return prev;

      const overDef = COLUMNS.find((c) => c.id === overColumn);
      if (overDef?.cap && overItems.length >= overDef.cap) return prev; // reject: would exceed the soft cap

      const overIndex = overItems.findIndex((c) => c.id === overId);
      const insertAt = overIndex >= 0 ? overIndex : overItems.length;

      const newActiveItems = [...activeItems];
      const [moved] = newActiveItems.splice(activeIndex, 1);
      const newOverItems = [...overItems];
      newOverItems.splice(insertAt, 0, moved);

      return { ...prev, [activeColumn]: newActiveItems, [overColumn]: newOverItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumn(board, activeId);
    const overColumn = findColumn(board, overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) return;

    if (activeId === overId) return;

    setBoard((prev) => {
      const items = prev[activeColumn];
      const activeIndex = items.findIndex((c) => c.id === activeId);
      const overIndex = items.findIndex((c) => c.id === overId);
      if (activeIndex === -1 || overIndex === -1) return prev;
      return { ...prev, [activeColumn]: arrayMove(items, activeIndex, overIndex) };
    });
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setBoard((prev) => {
      const def = COLUMNS.find((c) => c.id === columnId);
      if (def?.cap && prev[columnId].length >= def.cap) return prev; // reject: at cap
      const card: CardData = { id: nextId(), title };
      return { ...prev, [columnId]: [card, ...prev[columnId]] };
    });
  };

  return (
    <div className="sprint-board-page">
      <Title level={3} style={{ marginBottom: 16 }}>
        Sprint Board
      </Title>

      <Input
        allowClear
        size="large"
        prefix={<SearchOutlined />}
        placeholder="Search cards by title…"
        aria-label="Search cards"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 20 }}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="sprint-board-columns">
          {COLUMNS.map((def) => (
            <Column
              key={def.id}
              def={def}
              cards={board[def.id]}
              visibleIds={visibleIds}
              onAddCard={(title) => handleAddCard(def.id, title)}
            />
          ))}
        </div>

        <DragOverlay>{activeCard ? <CardItem card={activeCard} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
