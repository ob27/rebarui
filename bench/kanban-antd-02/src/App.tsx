import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Flex, Input, Layout, Typography } from "antd";
import { useMemo, useState } from "react";
import CardItem from "./CardItem";
import Column from "./Column";
import { seedBoard } from "./seed";
import {
  COLUMN_ORDER,
  COLUMN_TITLES,
  IN_PROGRESS_CAP,
  columnIdFromDroppable,
  type Board,
  type ColumnId,
  type KanbanCard,
} from "./types";

const { Title } = Typography;

function findColumnOfCard(board: Board, cardId: string): ColumnId | undefined {
  return COLUMN_ORDER.find((col) => board[col].some((c) => c.id === cardId));
}

function findCard(board: Board, cardId: string): KanbanCard | undefined {
  for (const col of COLUMN_ORDER) {
    const card = board[col].find((c) => c.id === cardId);
    if (card) return card;
  }
  return undefined;
}

let nextCardId = 1000;

export default function App() {
  const [board, setBoard] = useState<Board>(seedBoard);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const matchingIds = useMemo(() => {
    const query = search.trim().toLowerCase();
    const ids = new Set<string>();
    if (!query) {
      COLUMN_ORDER.forEach((col) => board[col].forEach((c) => ids.add(c.id)));
      return ids;
    }
    COLUMN_ORDER.forEach((col) =>
      board[col].forEach((c) => {
        if (c.title.toLowerCase().includes(query)) ids.add(c.id);
      }),
    );
    return ids;
  }, [search, board]);

  function addCard(columnId: ColumnId, title: string) {
    setBoard((prev) => {
      if (columnId === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) {
        return prev; // At cap — reject the add, same as a rejected drop.
      }
      const card: KanbanCard = {
        id: `card-${nextCardId++}`,
        title,
        assignee: "?",
      };
      return { ...prev, [columnId]: [card, ...prev[columnId]] };
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const card = findCard(board, String(event.active.id));
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setBoard((prev) => {
      const sourceCol = findColumnOfCard(prev, activeId);
      if (!sourceCol) return prev;

      let destCol: ColumnId | undefined;
      let destIndex: number;

      const containerColId = columnIdFromDroppable(overId);
      if (containerColId) {
        destCol = containerColId;
        destIndex = prev[destCol].length;
      } else {
        destCol = findColumnOfCard(prev, overId);
        if (!destCol) return prev;
        destIndex = prev[destCol].findIndex((c) => c.id === overId);
      }

      const sourceIndex = prev[sourceCol].findIndex((c) => c.id === activeId);
      if (sourceIndex === -1) return prev;

      // Reordering within the same column never changes its count.
      if (sourceCol === destCol) {
        if (sourceIndex === destIndex) return prev;
        return {
          ...prev,
          [sourceCol]: arrayMove(prev[sourceCol], sourceIndex, destIndex),
        };
      }

      // Moving across columns — enforce the "In Progress" soft cap.
      if (destCol === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) {
        return prev;
      }

      const card = prev[sourceCol][sourceIndex];
      const nextSource = prev[sourceCol].filter((c) => c.id !== activeId);
      const nextDest = [...prev[destCol]];
      nextDest.splice(destIndex, 0, card);

      return { ...prev, [sourceCol]: nextSource, [destCol]: nextDest };
    });
  }

  return (
    <Layout style={{ minHeight: "100vh", padding: 24, background: "#fff" }}>
      <Flex vertical gap={16} style={{ height: "100%" }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Title level={3} style={{ margin: 0 }}>
            Sprint Board
          </Title>
          <Input.Search
            allowClear
            placeholder="Search cards by title…"
            style={{ maxWidth: 320 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Flex>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Flex gap={16} align="flex-start" style={{ overflowX: "auto", paddingBottom: 8 }}>
            {COLUMN_ORDER.map((columnId) => (
              <Column
                key={columnId}
                id={columnId}
                title={COLUMN_TITLES[columnId]}
                cards={board[columnId]}
                matchingIds={matchingIds}
                cap={columnId === "inProgress" ? IN_PROGRESS_CAP : undefined}
                onAddCard={(title) => addCard(columnId, title)}
              />
            ))}
          </Flex>

          <DragOverlay>{activeCard ? <CardItem card={activeCard} overlay /> : null}</DragOverlay>
        </DndContext>
      </Flex>
    </Layout>
  );
}
