// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and the
// kanban-antd-* condition's own constraint). Split into additional files under src/ as you see fit.
import { useMemo, useState } from "react";
import { Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Column from "./Column";
import { COLUMNS, seedBoard } from "./data";
import type { BoardState, CardData, ColumnId } from "./types";

const { Title } = Typography;

let nextCardSeq = 1;
function newCardId() {
  return `new-${Date.now()}-${nextCardSeq++}`;
}

function findColumnOf(board: BoardState, cardId: string): ColumnId | null {
  for (const col of COLUMNS) {
    if (board[col.id].some((c) => c.id === cardId)) return col.id;
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(seedBoard);
  const [search, setSearch] = useState("");

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  // Move `draggedId` into `toCol`, inserting immediately before `beforeCardId`
  // (or at the end of the column when `beforeCardId` is null).
  const moveCard = (draggedId: string, toCol: ColumnId, beforeCardId: string | null) => {
    setBoard((prev) => {
      const fromCol = findColumnOf(prev, draggedId);
      if (!fromCol) return prev;
      if (fromCol === toCol && draggedId === beforeCardId) return prev;

      const sourceArr = [...prev[fromCol]];
      const cardIdx = sourceArr.findIndex((c) => c.id === draggedId);
      if (cardIdx === -1) return prev;
      const [card] = sourceArr.splice(cardIdx, 1);

      const destArr = fromCol === toCol ? sourceArr : [...prev[toCol]];
      const destDef = COLUMNS.find((c) => c.id === toCol);
      if (destDef?.cap != null && destArr.length >= destDef.cap) {
        // Would exceed the cap: reject the move entirely (no-op).
        return prev;
      }

      let insertIdx = destArr.length;
      if (beforeCardId) {
        const idx = destArr.findIndex((c) => c.id === beforeCardId);
        if (idx !== -1) insertIdx = idx;
      }
      destArr.splice(insertIdx, 0, card);

      const next: BoardState = { ...prev, [fromCol]: sourceArr };
      next[toCol] = destArr;
      return next;
    });
  };

  const addCard = (colId: ColumnId, title: string) => {
    setBoard((prev) => {
      const def = COLUMNS.find((c) => c.id === colId);
      if (def?.cap != null && prev[colId].length >= def.cap) return prev;
      const card: CardData = { id: newCardId(), title, assignee: "?" };
      return { ...prev, [colId]: [card, ...prev[colId]] };
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return board;
    const result = {} as BoardState;
    for (const col of COLUMNS) {
      result[col.id] = board[col.id].filter((c) => c.title.toLowerCase().includes(q));
    }
    return result;
  }, [board, search]);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Sprint Board
      </Title>

      <Input
        allowClear
        placeholder="Search cards by title..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 360 }}
      />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {COLUMNS.map((def) => (
          <Column
            key={def.id}
            def={def}
            cards={board[def.id]}
            visibleCards={filtered[def.id]}
            onDragStart={handleDragStart}
            onDropOnCard={(draggedId, targetId) => moveCard(draggedId, def.id, targetId)}
            onDropAtEnd={(draggedId) => moveCard(draggedId, def.id, null)}
            onAddCard={(title) => addCard(def.id, title)}
          />
        ))}
      </div>
    </div>
  );
}
