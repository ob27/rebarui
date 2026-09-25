import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Avatar, Card, Input, Tag, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Column from "./Column";
import { initialColumns, makeCardId } from "./data";
import { COLUMN_CAPS, COLUMN_ORDER, COLUMN_TITLES, isColumnId, type CardData, type ColumnId } from "./types";

const { Title } = Typography;

function findColumnOfCard(
  columns: Record<ColumnId, CardData[]>,
  cardId: string,
): ColumnId | null {
  for (const colId of COLUMN_ORDER) {
    if (columns[colId].some((c) => c.id === cardId)) return colId;
  }
  return null;
}

function tagColor(status: CardData["status"]): string {
  if (status === "Blocked") return "red";
  if (status === "Review") return "gold";
  return "default";
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(initialColumns);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    const colId = findColumnOfCard(columns, activeId);
    if (!colId) return null;
    return columns[colId].find((c) => c.id === activeId) ?? null;
  }, [activeId, columns]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeCardId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumnOfCard(columns, activeCardId);
    const overColumn = isColumnId(overId) ? overId : findColumnOfCard(columns, overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];
      const cap = COLUMN_CAPS[overColumn];
      if (cap !== undefined && overItems.length >= cap) return prev; // reject: would exceed cap

      const activeIndex = activeItems.findIndex((c) => c.id === activeCardId);
      if (activeIndex === -1) return prev;
      const card = activeItems[activeIndex];

      const overIndex = isColumnId(overId)
        ? overItems.length
        : overItems.findIndex((c) => c.id === overId);

      const newOverItems = [...overItems];
      newOverItems.splice(overIndex === -1 ? overItems.length : overIndex, 0, card);

      return {
        ...prev,
        [activeColumn]: activeItems.filter((c) => c.id !== activeCardId),
        [overColumn]: newOverItems,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeCardId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumnOfCard(columns, activeCardId);
    const overColumn = isColumnId(overId) ? overId : findColumnOfCard(columns, overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) return;

    setColumns((prev) => {
      const items = prev[activeColumn];
      const activeIndex = items.findIndex((c) => c.id === activeCardId);
      const overIndex = isColumnId(overId) ? items.length - 1 : items.findIndex((c) => c.id === overId);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return prev;
      return { ...prev, [activeColumn]: arrayMove(items, activeIndex, overIndex) };
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function addCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      const cap = COLUMN_CAPS[columnId];
      if (cap !== undefined && prev[columnId].length >= cap) return prev; // reject: at cap
      const newCard: CardData = {
        id: makeCardId(),
        title,
        status: null,
        assignee: "?",
      };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Sprint Board
      </Title>

      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search cards by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 20 }}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
              cap={COLUMN_CAPS[colId]}
              searchQuery={search}
              onAddCard={(title) => addCard(colId, title)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <Card size="small" style={{ width: 276 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div>{activeCard.title}</div>
                  {activeCard.status && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color={tagColor(activeCard.status)}>{activeCard.status}</Tag>
                    </div>
                  )}
                </div>
                <Avatar size="small">{activeCard.assignee}</Avatar>
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
