import { useRef, useState } from "react";
import { Input } from "rebar-ui";
import { Column } from "./Column";
import { COLUMN_CAPS, COLUMN_IDS, COLUMN_TITLES } from "./types";
import type { CardData, ColumnId } from "./types";
import "./App.css";

type BoardState = Record<ColumnId, CardData[]>;

const INITIAL_BOARD: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Design empty states",
      description: "Cover zero-data and error variants",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Write onboarding copy",
      assignee: "J",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Build search filter",
      description: "Debounce input, highlight matches",
      tag: "Blocked",
      assignee: "T",
    },
    {
      id: "card-4",
      title: "Refactor Avatar sizes",
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up CI pipeline",
      assignee: "S",
    },
  ],
};

export default function App() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const nextId = useRef(6);

  function moveCard(cardId: string, toColumn: ColumnId, targetCardId: string | null) {
    setBoard((prev) => {
      let fromColumn: ColumnId | null = null;
      let card: CardData | undefined;

      for (const columnId of COLUMN_IDS) {
        const found = prev[columnId].find((c) => c.id === cardId);
        if (found) {
          fromColumn = columnId;
          card = found;
          break;
        }
      }

      if (!card || !fromColumn) return prev;

      const isCrossColumn = fromColumn !== toColumn;
      if (isCrossColumn) {
        const cap = COLUMN_CAPS[toColumn];
        if (cap !== undefined && prev[toColumn].length >= cap) {
          // Rejected: destination column is at its soft cap.
          return prev;
        }
      }

      const remainingSource = prev[fromColumn].filter((c) => c.id !== cardId);
      const destList = isCrossColumn ? [...prev[toColumn]] : remainingSource;

      let insertIndex = destList.length;
      if (targetCardId) {
        const targetIndex = destList.findIndex((c) => c.id === targetCardId);
        if (targetIndex !== -1) insertIndex = targetIndex;
      }

      const newDestList = [
        ...destList.slice(0, insertIndex),
        card,
        ...destList.slice(insertIndex),
      ];

      if (!isCrossColumn) {
        return { ...prev, [fromColumn]: newDestList };
      }

      return { ...prev, [fromColumn]: remainingSource, [toColumn]: newDestList };
    });
  }

  function addCard(columnId: ColumnId, title: string) {
    setBoard((prev) => {
      const cap = COLUMN_CAPS[columnId];
      if (cap !== undefined && prev[columnId].length >= cap) {
        // Rejected: column is at its soft cap.
        return prev;
      }
      const newCard: CardData = {
        id: `card-${nextId.current++}`,
        title,
        assignee: "U",
      };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <div className="board-page">
      <Input
        className="board-search"
        placeholder="Search cards…"
        aria-label="Search cards"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="board">
        {COLUMN_IDS.map((columnId) => (
          <Column
            key={columnId}
            id={columnId}
            title={COLUMN_TITLES[columnId]}
            cards={board[columnId]}
            cap={COLUMN_CAPS[columnId]}
            searchQuery={searchQuery}
            draggedId={draggedId}
            onDragStart={setDraggedId}
            onDragEnd={() => setDraggedId(null)}
            onDropOnCard={(targetId, targetColumn) => {
              if (draggedId) moveCard(draggedId, targetColumn, targetId);
              setDraggedId(null);
            }}
            onDropOnColumn={(targetColumn) => {
              if (draggedId) moveCard(draggedId, targetColumn, null);
              setDraggedId(null);
            }}
            onAddCard={addCard}
          />
        ))}
      </div>
    </div>
  );
}
