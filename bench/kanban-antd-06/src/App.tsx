import { SearchOutlined } from "@ant-design/icons";
import { Input, Layout, Typography } from "antd";
import { useRef, useState, type DragEvent } from "react";
import { Column } from "./Column";
import { COLUMN_DEFS, seedBoard } from "./seedData";
import type { Board, ColumnId, KanbanCard } from "./types";

const { Title } = Typography;
const { Content, Header } = Layout;

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface DropIndicator {
  column: ColumnId;
  index: number;
}

function capOf(columnId: ColumnId): number | undefined {
  return COLUMN_DEFS.find((c) => c.id === columnId)?.cap;
}

export default function App() {
  const [board, setBoard] = useState<Board>(seedBoard);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const nextId = useRef(100);

  function isAtCap(columnId: ColumnId, currentBoard: Board = board): boolean {
    const cap = capOf(columnId);
    if (!cap) return false;
    return currentBoard[columnId].length >= cap;
  }

  function handleCardDragStart(e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) {
    setDrag({ cardId, from });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
  }

  function handleCardDragEnd() {
    setDrag(null);
    setDropIndicator(null);
  }

  function handleCardDragOver(e: DragEvent<HTMLDivElement>, columnId: ColumnId, index: number) {
    if (!drag) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const before = offset < rect.height / 2;
    setDropIndicator({ column: columnId, index: before ? index : index + 1 });
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    if (!drag) return;
    e.preventDefault();
    setDropIndicator({ column: columnId, index: board[columnId].length });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    if (!drag) return;
    const target = dropIndicator ?? { column: columnId, index: board[columnId].length };
    finalizeMove(drag, target);
    setDrag(null);
    setDropIndicator(null);
  }

  function finalizeMove(dragState: DragState, target: DropIndicator) {
    setBoard((prev) => {
      const from = dragState.from;
      const to = target.column;

      const fromList = [...prev[from]];
      const cardIndex = fromList.findIndex((c) => c.id === dragState.cardId);
      if (cardIndex === -1) return prev;

      // Reject a cross-column drop that would exceed the destination's cap.
      if (to !== from) {
        const cap = capOf(to);
        if (cap && prev[to].length >= cap) {
          return prev;
        }
      }

      const [card] = fromList.splice(cardIndex, 1);

      let insertIndex = target.index;
      if (to === from && cardIndex < insertIndex) {
        insertIndex -= 1;
      }

      const toList = to === from ? fromList : [...prev[to]];
      insertIndex = Math.max(0, Math.min(insertIndex, toList.length));
      toList.splice(insertIndex, 0, card);

      if (to === from) {
        return { ...prev, [from]: toList };
      }
      return { ...prev, [from]: fromList, [to]: toList };
    });
  }

  function handleOpenAdd(columnId: ColumnId) {
    if (isAtCap(columnId)) return;
    setAddingColumn(columnId);
    setDraftTitle("");
  }

  function handleDraftCancel() {
    setAddingColumn(null);
    setDraftTitle("");
  }

  function handleDraftSubmit() {
    const columnId = addingColumn;
    if (!columnId) return;
    const title = draftTitle.trim();
    if (!title) return;
    if (isAtCap(columnId)) {
      handleDraftCancel();
      return;
    }
    const newCard: KanbanCard = {
      id: `c${nextId.current++}`,
      title,
      assignee: "?",
    };
    setBoard((prev) => ({ ...prev, [columnId]: [newCard, ...prev[columnId]] }));
    handleDraftCancel();
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Sprint Board
        </Title>
        <Input
          allowClear
          placeholder="Search cards by title..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {COLUMN_DEFS.map((def) => (
            <Column
              key={def.id}
              def={def}
              cards={board[def.id]}
              search={search}
              draggedCardId={drag?.cardId ?? null}
              dropIndicator={dropIndicator}
              atCap={isAtCap(def.id)}
              isAdding={addingColumn === def.id}
              draftTitle={draftTitle}
              onOpenAdd={() => handleOpenAdd(def.id)}
              onDraftChange={setDraftTitle}
              onDraftSubmit={handleDraftSubmit}
              onDraftCancel={handleDraftCancel}
              onCardDragStart={(e, cardId) => handleCardDragStart(e, cardId, def.id)}
              onCardDragEnd={handleCardDragEnd}
              onCardDragOver={(e, index) => handleCardDragOver(e, def.id, index)}
              onColumnDragOver={(e) => handleColumnDragOver(e, def.id)}
              onDrop={(e) => handleDrop(e, def.id)}
            />
          ))}
        </div>
      </Content>
    </Layout>
  );
}
