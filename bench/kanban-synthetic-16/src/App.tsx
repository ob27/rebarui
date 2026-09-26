// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useState } from "react";
import type { DragEvent } from "react";
import { Input, Stack } from "rebar-ui";
import "./board.css";
import { Column } from "./Column";
import { COLUMN_DEFS, IN_PROGRESS_CAP, SEED_DATA } from "./data";
import type { CardData, ColumnId } from "./types";

let nextCardSeq = 0;
function makeCardId(): string {
  nextCardSeq += 1;
  return `card-${Date.now()}-${nextCardSeq}`;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(SEED_DATA);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<{ cardId: string; from: ColumnId } | null>(null);

  function handleDragStart(e: DragEvent<HTMLDivElement>, card: CardData, fromColumn: ColumnId) {
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox to allow the drag to start at all; the actual move is driven by React
    // state (`drag`), not by reading this back out on drop.
    e.dataTransfer.setData("text/plain", card.id);
    setDrag({ cardId: card.id, from: fromColumn });
  }

  function handleDragEnd() {
    setDrag(null);
  }

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, targetIndex: number) {
    setColumns((prev) => {
      const card = prev[from].find((c) => c.id === cardId);
      if (!card) return prev;

      // Reject a cross-column drop into "In Progress" once it's at the cap — a no-op, same as a
      // rejected add-card submission. Reordering *within* an already-at-cap column is still fine.
      if (to === "in-progress" && from !== "in-progress" && prev["in-progress"].length >= IN_PROGRESS_CAP) {
        return prev;
      }

      const fromRemaining = prev[from].filter((c) => c.id !== cardId);

      if (from === to) {
        const index = Math.max(0, Math.min(targetIndex, fromRemaining.length));
        const reordered = [...fromRemaining];
        reordered.splice(index, 0, card);
        return { ...prev, [from]: reordered };
      }

      const toList = [...prev[to]];
      const index = Math.max(0, Math.min(targetIndex, toList.length));
      toList.splice(index, 0, card);
      return { ...prev, [from]: fromRemaining, [to]: toList };
    });
  }

  function handleDrop(toColumn: ColumnId, index: number) {
    if (!drag) return;
    moveCard(drag.cardId, drag.from, toColumn, index);
    setDrag(null);
  }

  function handleAddCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      // Same cap rule as a drag-drop: a no-op once "In Progress" is full.
      if (columnId === "in-progress" && prev["in-progress"].length >= IN_PROGRESS_CAP) {
        return prev;
      }
      const newCard: CardData = { id: makeCardId(), title, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  return (
    <Stack gap="lg" className="board-app">
      <div className="board-search">
        <Input
          size="md"
          placeholder="Search cards by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search cards"
        />
      </div>
      <div className="board-columns">
        {COLUMN_DEFS.map((def) => (
          <Column
            key={def.id}
            def={def}
            cards={columns[def.id]}
            search={search}
            draggingCardId={drag?.cardId ?? null}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
    </Stack>
  );
}
