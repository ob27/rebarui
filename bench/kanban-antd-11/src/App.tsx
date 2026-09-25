import { useState } from "react";
import { Input, Typography } from "antd";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { CardPreview } from "./CardItem";
import { INITIAL_COLUMNS, IN_PROGRESS_CAP } from "./data";
import type { CardData, ColumnId, ColumnsState } from "./types";

const { Title } = Typography;

const COLUMN_META: { id: ColumnId; title: string; cap?: number }[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: IN_PROGRESS_CAP },
  { id: "done", title: "Done" },
];

function findContainer(columns: ColumnsState, id: UniqueIdentifier): ColumnId | undefined {
  if (id === "todo" || id === "inProgress" || id === "done") return id;
  return (Object.keys(columns) as ColumnId[]).find((key) =>
    columns[key].some((card) => card.id === id),
  );
}

let nextCardId = 1000;

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(INITIAL_COLUMNS);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const activeCard: CardData | undefined = activeId
    ? Object.values(columns)
        .flat()
        .find((c) => c.id === activeId)
    : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(columns, active.id);
    const overContainer = findContainer(columns, over.id);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((c) => c.id === active.id);
      if (activeIndex === -1) return prev;

      // Reject a drop that would push "In Progress" over its soft cap.
      if (overContainer === "inProgress" && overItems.length >= IN_PROGRESS_CAP) {
        return prev;
      }

      const overIndex = overItems.findIndex((c) => c.id === over.id);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;
      const movingCard = activeItems[activeIndex];

      return {
        ...prev,
        [activeContainer]: activeItems.filter((c) => c.id !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          movingCard,
          ...overItems.slice(newIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(columns, active.id);
    const overContainer = findContainer(columns, over.id);
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    const items = columns[activeContainer];
    const activeIndex = items.findIndex((c) => c.id === active.id);
    const overIndex = items.findIndex((c) => c.id === over.id);
    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      setColumns((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
      }));
    }
  };

  const handleAddCard = (columnId: ColumnId, title: string) => {
    setColumns((prev) => {
      if (columnId === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) {
        return prev;
      }
      const newCard: CardData = {
        id: `c${nextCardId++}`,
        title,
        assignee: "U",
      };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#fff" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Sprint Board
      </Title>

      <Input.Search
        placeholder="Search cards by title"
        allowClear
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 24, display: "block" }}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMN_META.map((meta) => (
            <Column
              key={meta.id}
              id={meta.id}
              title={meta.title}
              cards={columns[meta.id]}
              cap={meta.cap}
              searchQuery={search}
              onAddCard={(title) => handleAddCard(meta.id, title)}
            />
          ))}
        </div>

        <DragOverlay>{activeCard ? <CardPreview card={activeCard} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
