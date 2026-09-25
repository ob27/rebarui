// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and the
// kanban-antd-* condition's own constraint). Split into additional files under src/ as you see fit.
import { Input, Typography } from "antd";
import { useState } from "react";
import Column from "./Column";
import { SEED_DATA, makeId } from "./data";
import { COLUMNS } from "./types";
import type { CardData, ColumnId } from "./types";

const { Title } = Typography;

type ColumnsState = Record<ColumnId, CardData[]>;

interface DragState {
  cardId: string;
  fromColumn: ColumnId;
}

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(SEED_DATA);
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  function handleAddCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      const columnDef = COLUMNS.find((c) => c.id === columnId);
      const list = prev[columnId];
      if (columnDef?.cap && list.length >= columnDef.cap) {
        return prev; // reject: would exceed cap
      }
      const newCard: CardData = { id: makeId(), title, assignee: "U" };
      return { ...prev, [columnId]: [newCard, ...list] };
    });
  }

  function handleCardDragStart(cardId: string, fromColumn: ColumnId) {
    setDragState({ cardId, fromColumn });
  }

  function handleCardDragEnd() {
    setDragState(null);
    setDragOverCardId(null);
  }

  function moveDraggedCard(toColumn: ColumnId, beforeCardId: string | null) {
    if (!dragState) return;
    const { cardId, fromColumn } = dragState;

    setColumns((prev) => {
      const fromList = prev[fromColumn];
      const cardIndex = fromList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const card = fromList[cardIndex];

      const isSameColumn = fromColumn === toColumn;
      const columnDef = COLUMNS.find((c) => c.id === toColumn);

      if (!isSameColumn && columnDef?.cap && prev[toColumn].length >= columnDef.cap) {
        return prev; // reject: drop would exceed cap
      }

      const newFromList = fromList.filter((c) => c.id !== cardId);
      const workingToList = isSameColumn ? newFromList : [...prev[toColumn]];

      let insertIndex = beforeCardId ? workingToList.findIndex((c) => c.id === beforeCardId) : -1;
      if (insertIndex === -1) insertIndex = workingToList.length;

      workingToList.splice(insertIndex, 0, card);

      if (isSameColumn) {
        return { ...prev, [toColumn]: workingToList };
      }
      return { ...prev, [fromColumn]: newFromList, [toColumn]: workingToList };
    });

    setDragState(null);
    setDragOverCardId(null);
  }

  const searchLower = search.trim().toLowerCase();

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Sprint Board
      </Title>

      <Input.Search
        placeholder="Search cards by title..."
        allowClear
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 20 }}
      />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {COLUMNS.map((columnDef) => {
          const cards = columns[columnDef.id];
          const visibleCards = searchLower
            ? cards.filter((c) => c.title.toLowerCase().includes(searchLower))
            : cards;
          const atCap = Boolean(columnDef.cap && cards.length >= columnDef.cap);

          return (
            <Column
              key={columnDef.id}
              columnDef={columnDef}
              cards={cards}
              visibleCards={visibleCards}
              atCap={atCap}
              draggingCardId={dragState?.cardId ?? null}
              dragOverCardId={dragOverCardId}
              onCardDragStart={(cardId) => handleCardDragStart(cardId, columnDef.id)}
              onCardDragEnd={handleCardDragEnd}
              onCardDragEnter={(cardId) => setDragOverCardId(cardId)}
              onDropBeforeCard={(cardId) => moveDraggedCard(columnDef.id, cardId)}
              onDropAtEnd={() => moveDraggedCard(columnDef.id, null)}
              onAddCard={(title) => handleAddCard(columnDef.id, title)}
            />
          );
        })}
      </div>
    </div>
  );
}
