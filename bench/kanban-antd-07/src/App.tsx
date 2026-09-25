// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and the
// kanban-antd-* condition's own constraint). Split into additional files under src/ as you see fit.
import { useState } from "react";
import { Input, Layout, Typography } from "antd";
import { Column } from "./Column";
import { COLUMN_ORDER, IN_PROGRESS_CAP, initialColumns } from "./data";
import type { ColumnId, ColumnsState, DropTarget } from "./types";

const { Header, Content } = Layout;
const { Title } = Typography;

let nextCardId = 1000;

export default function App() {
  const [columns, setColumns] = useState<ColumnsState>(initialColumns);
  const [searchTerm, setSearchTerm] = useState("");
  const [drag, setDrag] = useState<{ cardId: string; fromCol: ColumnId } | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const handleDragStartCard = (cardId: string, fromCol: ColumnId) => {
    setDrag({ cardId, fromCol });
  };

  const handleDragOverSlot = (col: ColumnId, index: number) => {
    setDropTarget((prev) => (prev && prev.col === col && prev.index === index ? prev : { col, index }));
  };

  const handleDragEnd = () => {
    setDrag(null);
    setDropTarget(null);
  };

  const handleDrop = () => {
    if (!drag || !dropTarget) {
      handleDragEnd();
      return;
    }
    const { cardId, fromCol } = drag;
    const { col: toCol, index: rawIndex } = dropTarget;

    setColumns((prev) => {
      // Reject a cross-column drop into "In Progress" once it's at cap.
      if (toCol === "inProgress" && fromCol !== toCol && prev.inProgress.length >= IN_PROGRESS_CAP) {
        return prev;
      }

      const fromArr = [...prev[fromCol]];
      const cardIdx = fromArr.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;
      const [card] = fromArr.splice(cardIdx, 1);

      const sameCol = fromCol === toCol;
      const toArr = sameCol ? fromArr : [...prev[toCol]];
      let insertIndex = rawIndex;
      if (sameCol && cardIdx < insertIndex) insertIndex -= 1;
      insertIndex = Math.max(0, Math.min(insertIndex, toArr.length));
      toArr.splice(insertIndex, 0, card);

      return {
        ...prev,
        [fromCol]: sameCol ? toArr : fromArr,
        [toCol]: toArr,
      };
    });

    handleDragEnd();
  };

  const handleAddCard = (col: ColumnId, title: string) => {
    setColumns((prev) => {
      if (col === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) return prev;
      const newCard = { id: `c${nextCardId++}`, title, assignee: "?" };
      return { ...prev, [col]: [newCard, ...prev[col]] };
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: 24,
          height: "auto",
          padding: "16px 24px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Sprint Board
        </Title>
        <Input.Search
          placeholder="Search cards by title"
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMN_ORDER.map((colId) => (
            <Column
              key={colId}
              colId={colId}
              cards={columns[colId]}
              searchTerm={searchTerm}
              dropTarget={dropTarget}
              onDragStartCard={handleDragStartCard}
              onDragOverSlot={handleDragOverSlot}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
      </Content>
    </Layout>
  );
}
