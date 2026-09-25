import { useState } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { COLUMN_DEFS, nextId, seedCards } from "./data";
import { Column } from "./Column";
import type { DragState } from "./Column";
import type { CardData, ColumnId } from "./types";
import "./sprint-board.css";

type Columns = Record<ColumnId, CardData[]>;

function capFor(id: ColumnId): number | undefined {
  return COLUMN_DEFS.find((c) => c.id === id)?.cap;
}

// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and the
// kanban-synthetic-* condition's constraint): the static shell below leans on Synthetic-tier
// composition components (`Card`, `Tag` via Card's `labels`, `Avatar`, `Stack`) plus the
// `Button`/`Input` primitives, but none of the actual behavior — drag-and-drop, search-filter,
// add-card, the "In Progress" cap — comes from a pre-built component. `Kanban` from `rebar-ui` is
// never imported; all of that state and event wiring lives in this file and Column.tsx.
export default function App() {
  const [columns, setColumns] = useState<Columns>(() => seedCards());
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);

  function addCard(columnId: ColumnId, title: string): boolean {
    const cap = capFor(columnId);
    if (cap != null && columns[columnId].length >= cap) return false;
    const card: CardData = { id: nextId(), title, assignee: "?" };
    setColumns((prev) => ({ ...prev, [columnId]: [card, ...prev[columnId]] }));
    return true;
  }

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, targetIndex: number) {
    setColumns((prev) => {
      const cap = capFor(to);
      // Reject a drop that would push a capped column over its limit — a pure reorder within the
      // same column (from === to) never changes that column's count, so it's always allowed.
      if (to !== from && cap != null && prev[to].length >= cap) {
        return prev;
      }

      const sourceList = [...prev[from]];
      const idx = sourceList.findIndex((c) => c.id === cardId);
      if (idx === -1) return prev;
      const [card] = sourceList.splice(idx, 1);

      const destList = from === to ? sourceList : [...prev[to]];
      let insertAt = targetIndex;
      // Removing the card from its own column first-hand shifts every later index left by one.
      if (from === to && idx < insertAt) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, destList.length));
      destList.splice(insertAt, 0, card);

      if (from === to) {
        return { ...prev, [from]: destList };
      }
      return { ...prev, [from]: sourceList, [to]: destList };
    });
  }

  const query = search.trim().toLowerCase();

  return (
    <Box style={{ padding: "var(--rebar-space-xl)", maxWidth: 1200, margin: "0 auto" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            placeholder="Search cards by title…"
            aria-label="Search cards"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="lg" align="start" className="sprint-board-columns">
          {COLUMN_DEFS.map((def) => {
            const cards = columns[def.id];
            const atCap = def.cap != null && cards.length >= def.cap;
            return (
              <Box key={def.id} style={{ flex: 1, minWidth: 0 }}>
                <Column
                  def={def}
                  cards={cards}
                  query={query}
                  drag={drag}
                  atCap={atCap}
                  onDragStart={(cardId) => setDrag({ cardId, from: def.id })}
                  onDragEnd={() => setDrag(null)}
                  onCardDrop={(targetIndex) => {
                    if (drag) moveCard(drag.cardId, drag.from, def.id, targetIndex);
                    setDrag(null);
                  }}
                  onAddCard={(title) => addCard(def.id, title)}
                />
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
