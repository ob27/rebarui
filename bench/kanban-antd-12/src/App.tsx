import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { Input, Typography } from "antd";
import KanbanColumn from "./KanbanColumn";
import { COLUMN_META, IN_PROGRESS_CAP } from "./constants";
import { makeCardId, seedColumns } from "./data";
import type { CardData, ColumnId } from "./types";
import "./App.css";

const { Title } = Typography;

interface DraggedInfo {
  cardId: string;
  fromColumn: ColumnId;
}

interface DragOverInfo {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(seedColumns);
  const [search, setSearch] = useState("");
  const [dragged, setDragged] = useState<DraggedInfo | null>(null);
  const [dragOver, setDragOver] = useState<DragOverInfo | null>(null);

  // While a card is being dragged, pretend it's already been removed from its
  // origin column. That way every drop-index computed against this view maps
  // directly onto the real array with no "it's still in there" offset math.
  const displayColumns = useMemo(() => {
    if (!dragged) return columns;
    return {
      ...columns,
      [dragged.fromColumn]: columns[dragged.fromColumn].filter((c) => c.id !== dragged.cardId),
    };
  }, [columns, dragged]);

  const query = search.trim().toLowerCase();

  function moveCard(cardId: string, fromColumn: ColumnId, toColumn: ColumnId, toIndex: number) {
    setColumns((prev) => {
      if (toColumn !== fromColumn && toColumn === "in-progress" && prev["in-progress"].length >= IN_PROGRESS_CAP) {
        // Reject: dropping here would exceed the soft cap.
        return prev;
      }
      const source = [...prev[fromColumn]];
      const idx = source.findIndex((c) => c.id === cardId);
      if (idx === -1) return prev;
      const [card] = source.splice(idx, 1);
      const target = fromColumn === toColumn ? source : [...prev[toColumn]];
      const insertIndex = Math.max(0, Math.min(toIndex, target.length));
      target.splice(insertIndex, 0, card);
      return { ...prev, [fromColumn]: source, [toColumn]: target };
    });
  }

  function handleDrop() {
    if (dragged && dragOver) {
      moveCard(dragged.cardId, dragged.fromColumn, dragOver.column, dragOver.index);
    }
    setDragged(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    setDragged(null);
    setDragOver(null);
  }

  function addCard(column: ColumnId, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((prev) => {
      if (column === "in-progress" && prev["in-progress"].length >= IN_PROGRESS_CAP) {
        // Reject: the column is already at cap.
        return prev;
      }
      const newCard: CardData = { id: makeCardId(), title: trimmed, assignee: "?" };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  }

  return (
    <div className="board-page">
      <Title level={3} className="board-page__title">
        Sprint Board
      </Title>
      <Input.Search
        allowClear
        placeholder="Search cards by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="board-page__search"
      />
      <div className="board-columns">
        {COLUMN_META.map((meta) => {
          const fullCards = columns[meta.id];
          const visibleCards = displayColumns[meta.id].filter((c) =>
            query ? c.title.toLowerCase().includes(query) : true,
          );
          const atCap = meta.cap !== undefined && fullCards.length >= meta.cap;

          return (
            <KanbanColumn
              key={meta.id}
              meta={meta}
              totalCount={fullCards.length}
              cards={visibleCards}
              atCap={atCap}
              onAddCard={(title) => addCard(meta.id, title)}
              onCardDragStart={(cardId) => setDragged({ cardId, fromColumn: meta.id })}
              onCardDragOver={(index, e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const before = e.clientY - rect.top < rect.height / 2;
                setDragOver({ column: meta.id, index: before ? index : index + 1 });
              }}
              onColumnDragOver={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setDragOver({ column: meta.id, index: visibleCards.length });
              }}
              onDrop={handleDrop}
              onCardDragEnd={handleDragEnd}
            />
          );
        })}
      </div>
    </div>
  );
}
