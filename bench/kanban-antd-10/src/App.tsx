import { useMemo, useRef, useState } from "react";
import { ConfigProvider, Input, Layout, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { CardPreview } from "./CardPreview";
import { seedColumns } from "./seedData";
import { COLUMN_DEFS, type CardData, type ColumnId } from "./types";

const { Header, Content } = Layout;
const { Title } = Typography;

function findContainer(
  columns: Record<ColumnId, CardData[]>,
  id: string,
): ColumnId | undefined {
  if (COLUMN_DEFS.some((c) => c.id === id)) return id as ColumnId;
  for (const col of COLUMN_DEFS) {
    if (columns[col.id].some((c) => c.id === id)) return col.id;
  }
  return undefined;
}

function capOf(columnId: ColumnId): number | undefined {
  return COLUMN_DEFS.find((c) => c.id === columnId)?.cap;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(seedColumns);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const nextId = useRef(1000);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const trimmedQuery = query.trim().toLowerCase();
  const isFiltering = trimmedQuery.length > 0;

  const visibleColumns = useMemo(() => {
    const result: Record<ColumnId, CardData[]> = { todo: [], inProgress: [], done: [] };
    for (const col of COLUMN_DEFS) {
      result[col.id] = isFiltering
        ? columns[col.id].filter((card) => card.title.toLowerCase().includes(trimmedQuery))
        : columns[col.id];
    }
    return result;
  }, [columns, isFiltering, trimmedQuery]);

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    for (const col of COLUMN_DEFS) {
      const found = columns[col.id].find((c) => c.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, columns]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;

    const activeContainer = findContainer(columns, activeIdStr);
    const overContainer = findContainer(columns, overIdStr);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((c) => c.id === activeIdStr);
      if (activeIndex === -1) return prev;

      // Reject a cross-column move that would push the destination over its cap.
      const cap = capOf(overContainer);
      if (cap !== undefined && overItems.length >= cap) return prev;

      const overIndex = overItems.findIndex((c) => c.id === overIdStr);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      const movingCard = activeItems[activeIndex];
      const newActiveItems = activeItems.filter((c) => c.id !== activeIdStr);
      const newOverItems = [
        ...overItems.slice(0, newIndex),
        movingCard,
        ...overItems.slice(newIndex),
      ];

      return { ...prev, [activeContainer]: newActiveItems, [overContainer]: newOverItems };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;

    const activeContainer = findContainer(columns, activeIdStr);
    const overContainer = findContainer(columns, overIdStr);
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    setColumns((prev) => {
      const items = prev[activeContainer];
      const activeIndex = items.findIndex((c) => c.id === activeIdStr);
      const overIndex = items.findIndex((c) => c.id === overIdStr);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return prev;
      return { ...prev, [activeContainer]: arrayMove(items, activeIndex, overIndex) };
    });
  }

  function handleAddCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      const cap = capOf(columnId);
      if (cap !== undefined && prev[columnId].length >= cap) return prev;
      const newCard: CardData = {
        id: `c${nextId.current++}`,
        title,
        assignee: "?",
      };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <ConfigProvider>
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            height: "auto",
            padding: "16px 24px",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Sprint Board
          </Title>
          <Input
            allowClear
            placeholder="Search cards by title..."
            prefix={<SearchOutlined />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Header>
        <Content style={{ padding: 24 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {COLUMN_DEFS.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  cards={columns[col.id]}
                  visibleCards={visibleColumns[col.id]}
                  isFiltering={isFiltering}
                  onAddCard={handleAddCard}
                />
              ))}
            </div>
            <DragOverlay>{activeCard ? <CardPreview card={activeCard} /> : null}</DragOverlay>
          </DndContext>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
