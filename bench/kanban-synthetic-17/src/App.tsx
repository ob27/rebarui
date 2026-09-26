import { useState } from "react";
import { Input } from "rebar-ui";
import { Column } from "./Column";
import { COLUMNS, SEED_CARDS } from "./types";
import type { CardData, ColumnId } from "./types";

let nextCardId = 1000;

export default function App() {
  const [cardsByColumn, setCardsByColumn] = useState<Record<ColumnId, CardData[]>>(SEED_CARDS);
  const [search, setSearch] = useState("");
  const [dragCard, setDragCard] = useState<{ id: string; from: ColumnId } | null>(null);

  const handleDragStartCard = (columnId: ColumnId) => (cardId: string) => {
    setDragCard({ id: cardId, from: columnId });
  };

  const handleDragEndCard = () => {
    setDragCard(null);
  };

  const handleDropAt = (targetColumn: ColumnId) => (targetIndex: number) => {
    if (!dragCard) return;
    const { id, from } = dragCard;

    setCardsByColumn((prev) => {
      const sourceList = prev[from];
      const cardIndex = sourceList.findIndex((c) => c.id === id);
      if (cardIndex === -1) return prev;

      const targetColumnDef = COLUMNS.find((c) => c.id === targetColumn)!;
      const targetList = prev[targetColumn];

      // Column cap only constrains moves arriving FROM another column — reordering within the
      // same (already-at-or-under-cap) column never changes that column's count.
      if (from !== targetColumn && targetColumnDef.cap !== undefined && targetList.length >= targetColumnDef.cap) {
        return prev;
      }

      const card = sourceList[cardIndex];
      const newSource = sourceList.filter((_, i) => i !== cardIndex);

      let insertIndex = targetIndex;
      if (from === targetColumn && cardIndex < insertIndex) {
        insertIndex -= 1;
      }

      const targetBase = from === targetColumn ? newSource : targetList;
      const newTarget = [...targetBase];
      insertIndex = Math.max(0, Math.min(insertIndex, newTarget.length));
      newTarget.splice(insertIndex, 0, card);

      if (from === targetColumn) {
        return { ...prev, [targetColumn]: newTarget };
      }
      return { ...prev, [from]: newSource, [targetColumn]: newTarget };
    });

    setDragCard(null);
  };

  const handleAddCard = (columnId: ColumnId) => (title: string) => {
    setCardsByColumn((prev) => {
      const columnDef = COLUMNS.find((c) => c.id === columnId)!;
      const list = prev[columnId];
      if (columnDef.cap !== undefined && list.length >= columnDef.cap) {
        return prev;
      }
      const newCard: CardData = {
        id: `card-${nextCardId++}`,
        title,
        status: null,
        assignee: "?",
      };
      return { ...prev, [columnId]: [newCard, ...list] };
    });
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ marginBottom: 12 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search cards"
          style={{ width: 320 }}
        />
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={cardsByColumn[column.id]}
            search={search}
            draggingCardId={dragCard?.id ?? null}
            onAddCard={handleAddCard(column.id)}
            onDragStartCard={handleDragStartCard(column.id)}
            onDragEndCard={handleDragEndCard}
            onDropAt={handleDropAt(column.id)}
          />
        ))}
      </div>
    </div>
  );
}
