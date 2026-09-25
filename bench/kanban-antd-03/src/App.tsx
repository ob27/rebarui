import { SearchOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Input, Typography } from "antd";
import { useMemo, useState } from "react";
import { CardView } from "./components/CardView";
import { Column } from "./components/Column";
import { COLUMN_ORDER, COLUMN_TITLES, IN_PROGRESS_CAP } from "./constants";
import { seedColumns } from "./seedData";
import type { ColumnId, ColumnsState, KanbanCard } from "./types";

function isColumnId(id: string): id is ColumnId {
  return (COLUMN_ORDER as string[]).includes(id);
}

let cardIdCounter = 100;
function nextCardId(): string {
  cardIdCounter += 1;
  return `c${cardIdCounter}`;
}

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(seedColumns);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const query = search.trim().toLowerCase();
  const visibleIds = useMemo(() => {
    if (!query) {
      return new Set(Object.values(columns).flat().map((card) => card.id));
    }
    const ids = new Set<string>();
    for (const cards of Object.values(columns)) {
      for (const card of cards) {
        if (card.title.toLowerCase().includes(query)) ids.add(card.id);
      }
    }
    return ids;
  }, [columns, query]);

  function findColumnOfCard(cardId: string): ColumnId | undefined {
    return COLUMN_ORDER.find((colId) => columns[colId].some((card) => card.id === cardId));
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const colId = findColumnOfCard(id);
    setActiveCard(colId ? (columns[colId].find((card) => card.id === id) ?? null) : null);
  }

  function handleDragCancel() {
    setActiveCard(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const sourceColumn = findColumnOfCard(activeId);
    if (!sourceColumn) return;
    const targetColumn = isColumnId(overId) ? overId : findColumnOfCard(overId);
    if (!targetColumn) return;

    if (sourceColumn === targetColumn) {
      const cards = columns[sourceColumn];
      const oldIndex = cards.findIndex((card) => card.id === activeId);
      const overIndex = isColumnId(overId) ? cards.length - 1 : cards.findIndex((card) => card.id === overId);
      if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;
      setColumns((prev) => ({
        ...prev,
        [sourceColumn]: arrayMove(prev[sourceColumn], oldIndex, overIndex),
      }));
      return;
    }

    // Moving to a different column: reject the drop outright once "In Progress" is at cap.
    if (targetColumn === "in-progress" && columns["in-progress"].length >= IN_PROGRESS_CAP) {
      return;
    }

    setColumns((prev) => {
      const sourceCards = [...prev[sourceColumn]];
      const sourceIndex = sourceCards.findIndex((card) => card.id === activeId);
      if (sourceIndex === -1) return prev;
      const [moved] = sourceCards.splice(sourceIndex, 1);

      const targetCards = [...prev[targetColumn]];
      const overIndex = isColumnId(overId) ? targetCards.length : targetCards.findIndex((card) => card.id === overId);
      const insertIndex = overIndex === -1 ? targetCards.length : overIndex;
      targetCards.splice(insertIndex, 0, moved);

      return {
        ...prev,
        [sourceColumn]: sourceCards,
        [targetColumn]: targetCards,
      };
    });
  }

  function handleAddCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      if (columnId === "in-progress" && prev[columnId].length >= IN_PROGRESS_CAP) {
        return prev;
      }
      const newCard: KanbanCard = { id: nextCardId(), title, assignee: "+" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: 24 }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Sprint Board
      </Typography.Title>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search cards by title"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{ maxWidth: 320, marginBottom: 20 }}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMN_ORDER.map((colId) => (
            <Column
              key={colId}
              id={colId}
              title={COLUMN_TITLES[colId]}
              cards={columns[colId]}
              visibleIds={visibleIds}
              cap={colId === "in-progress" ? IN_PROGRESS_CAP : undefined}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div style={{ width: 260 }}>
              <CardView card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
