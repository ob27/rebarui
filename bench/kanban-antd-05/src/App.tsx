import { SearchOutlined } from "@ant-design/icons";
import { Input, Typography } from "antd";
import { useState } from "react";
import type { DragEvent } from "react";
import Column from "./Column";
import { SEED_COLUMNS } from "./seedData";
import { COLUMN_META } from "./types";
import type { CardData, ColumnId } from "./types";

const { Title } = Typography;

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface OverInfo {
  column: ColumnId;
  index: number;
}

function makeCardId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(SEED_COLUMNS);
  const [search, setSearch] = useState("");
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overInfo, setOverInfo] = useState<OverInfo | null>(null);

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, toIndex: number) {
    setColumns((prev) => {
      const fromCards = [...prev[from]];
      const idx = fromCards.findIndex((c) => c.id === cardId);
      if (idx === -1) return prev;
      const [card] = fromCards.splice(idx, 1);
      const isSameColumn = from === to;
      const destCards = isSameColumn ? fromCards : [...prev[to]];

      if (!isSameColumn) {
        const meta = COLUMN_META.find((m) => m.id === to);
        if (meta?.cap !== undefined && destCards.length >= meta.cap) {
          // Dropping into a full column would exceed its soft cap — reject the move.
          return prev;
        }
      }

      let insertAt = toIndex;
      if (isSameColumn && idx < toIndex) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, destCards.length));
      destCards.splice(insertAt, 0, card);

      if (isSameColumn) {
        return { ...prev, [to]: destCards };
      }
      return { ...prev, [from]: fromCards, [to]: destCards };
    });
  }

  function handleCardDragStart(card: CardData, columnId: ColumnId) {
    return (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.id);
      setDragState({ cardId: card.id, from: columnId });
    };
  }

  function handleCardDragOver(columnId: ColumnId, card: CardData) {
    return (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const trueIndex = columns[columnId].findIndex((c) => c.id === card.id);
      const index = e.clientY < midpoint ? trueIndex : trueIndex + 1;
      setOverInfo({ column: columnId, index });
    };
  }

  function handleColumnDragOver(columnId: ColumnId) {
    return (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setOverInfo({ column: columnId, index: columns[columnId].length });
    };
  }

  function handleDrop(columnId: ColumnId) {
    return (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (dragState) {
        const targetIndex =
          overInfo && overInfo.column === columnId ? overInfo.index : columns[columnId].length;
        moveCard(dragState.cardId, dragState.from, columnId, targetIndex);
      }
      setDragState(null);
      setOverInfo(null);
    };
  }

  function handleDragEnd() {
    setDragState(null);
    setOverInfo(null);
  }

  function startAdd(columnId: ColumnId) {
    setAddingColumn(columnId);
    setDraftTitle("");
  }

  function cancelAdd() {
    setAddingColumn(null);
    setDraftTitle("");
  }

  function submitAdd() {
    if (!addingColumn) return;
    const title = draftTitle.trim();
    if (!title) return; // title required — no-op rather than adding a blank card

    const targetColumn = addingColumn;
    setColumns((prev) => {
      const meta = COLUMN_META.find((m) => m.id === targetColumn);
      const existing = prev[targetColumn];
      if (meta?.cap !== undefined && existing.length >= meta.cap) {
        // At cap — reject the add, same as a rejected drop.
        return prev;
      }
      const newCard: CardData = { id: makeCardId(), title, assignee: "?" };
      return { ...prev, [targetColumn]: [newCard, ...existing] };
    });
    cancelAdd();
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Sprint Board
        </Title>
        <Input
          placeholder="Search cards..."
          prefix={<SearchOutlined />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {COLUMN_META.map((meta) => (
          <Column
            key={meta.id}
            meta={meta}
            cards={columns[meta.id]}
            search={search}
            dragState={dragState}
            overInfo={overInfo}
            isAdding={addingColumn === meta.id}
            draftTitle={draftTitle}
            onDraftTitleChange={setDraftTitle}
            onStartAdd={() => startAdd(meta.id)}
            onSubmitAdd={submitAdd}
            onCancelAdd={cancelAdd}
            onCardDragStart={handleCardDragStart}
            onCardDragOver={handleCardDragOver}
            onColumnDragOver={handleColumnDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
