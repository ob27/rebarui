// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useState, type DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { BoardColumn } from "./BoardColumn";
import { COLUMN_CAPS, COLUMN_ORDER, COLUMN_TITLES, seedColumns } from "./seedData";
import type { CardData, ColumnId } from "./types";

let idCounter = 0;
function makeId(): string {
  idCounter += 1;
  return `card-${Date.now()}-${idCounter}`;
}

interface DragPayload {
  cardId: string;
  from: ColumnId;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(seedColumns);
  const [search, setSearch] = useState("");

  function moveCard(
    cardId: string,
    from: ColumnId,
    to: ColumnId,
    targetCardId: string | null,
    side: "before" | "after" | null,
  ) {
    setColumns((prev) => {
      const source = prev[from];
      const card = source.find((c) => c.id === cardId);
      if (!card) return prev;

      if (to !== from) {
        const cap = COLUMN_CAPS[to];
        if (cap != null && prev[to].length >= cap) return prev;
      }

      const newSource = source.filter((c) => c.id !== cardId);
      const destBase = to === from ? newSource : prev[to];
      let insertIndex = destBase.length;
      if (targetCardId) {
        const idx = destBase.findIndex((c) => c.id === targetCardId);
        if (idx !== -1) insertIndex = side === "after" ? idx + 1 : idx;
      }
      const newDest = [...destBase];
      newDest.splice(insertIndex, 0, card);

      if (to === from) {
        return { ...prev, [from]: newDest };
      }
      return { ...prev, [from]: newSource, [to]: newDest };
    });
  }

  function readPayload(e: DragEvent<HTMLDivElement>): DragPayload | null {
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DragPayload;
    } catch {
      return null;
    }
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) {
    const payload: DragPayload = { cardId, from };
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDropOnCard(e: DragEvent<HTMLDivElement>, targetCardId: string, columnId: ColumnId) {
    e.preventDefault();
    e.stopPropagation();
    const payload = readPayload(e);
    if (!payload || payload.cardId === targetCardId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const side: "before" | "after" = e.clientY - rect.top < rect.height / 2 ? "before" : "after";
    moveCard(payload.cardId, payload.from, columnId, targetCardId, side);
  }

  function handleDropOnColumn(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    const payload = readPayload(e);
    if (!payload) return;
    moveCard(payload.cardId, payload.from, columnId, null, null);
  }

  function handleAddCard(columnId: ColumnId, title: string) {
    setColumns((prev) => {
      const cap = COLUMN_CAPS[columnId];
      if (cap != null && prev[columnId].length >= cap) return prev;
      const newCard: CardData = { id: makeId(), title, assignee: "?" };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
  }

  const query = search.trim().toLowerCase();

  return (
    <Box as="main" style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Sprint Board</h1>
      <Box style={{ marginBottom: 16, maxWidth: 320 }}>
        <Input
          placeholder="Search cards…"
          aria-label="Search cards"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Stack direction="row" gap="lg" align="start">
        {COLUMN_ORDER.map((columnId) => {
          const all = columns[columnId];
          const visible = query ? all.filter((c) => c.title.toLowerCase().includes(query)) : all;
          return (
            <BoardColumn
              key={columnId}
              columnId={columnId}
              title={COLUMN_TITLES[columnId]}
              cards={visible}
              totalCount={all.length}
              cap={COLUMN_CAPS[columnId]}
              onAddCard={handleAddCard}
              onDragStart={handleDragStart}
              onDropOnCard={handleDropOnCard}
              onDropOnColumn={handleDropOnColumn}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
