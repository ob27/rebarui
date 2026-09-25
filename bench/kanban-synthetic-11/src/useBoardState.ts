import { useCallback, useState } from "react";
import type { CardData, ColumnId } from "./types";
import { COLUMNS } from "./types";
import { SEED_CARDS } from "./seed";

let nextId = 1000;

function capFor(columnId: ColumnId): number | undefined {
  return COLUMNS.find((c) => c.id === columnId)?.cap;
}

/** All board state (cards, add-card, move/reorder) lives here — hand-written from scratch per
 * this benchmark condition's constraint, no `Kanban` import. */
export function useBoardState() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(SEED_CARDS);

  const isAtCap = useCallback(
    (columnId: ColumnId) => {
      const cap = capFor(columnId);
      return cap != null && columns[columnId].length >= cap;
    },
    [columns],
  );

  /** Adds `title` to the top of `columnId`. Returns false (no-op) if the title is blank or the
   * column is already at its soft cap — the caller uses that to decide whether to clear/keep the
   * inline input open. */
  const addCard = useCallback(
    (columnId: ColumnId, title: string): boolean => {
      const trimmed = title.trim();
      if (!trimmed) return false;

      let added = false;
      setColumns((prev) => {
        const cap = capFor(columnId);
        if (cap != null && prev[columnId].length >= cap) return prev; // reject: at cap
        added = true;
        const card: CardData = {
          id: `card-${nextId++}`,
          title: trimmed,
          status: null,
          assignee: "?",
        };
        return { ...prev, [columnId]: [card, ...prev[columnId]] };
      });
      return added;
    },
    [],
  );

  /** Moves (or reorders, when `fromColumn === toColumn`) the card `cardId` to `toIndex` within
   * `toColumn`'s array. `toIndex` is expressed in terms of the column's current (pre-move) full
   * card list. Rejects (no-op) a cross-column move that would exceed the target's soft cap. */
  const moveCard = useCallback((cardId: string, fromColumn: ColumnId, toColumn: ColumnId, toIndex: number) => {
    setColumns((prev) => {
      const source = [...prev[fromColumn]];
      const cardIndex = source.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [card] = source.splice(cardIndex, 1);

      // The drop index was computed against the list *including* the dragged card, so once it's
      // removed, everything after its old position shifts left by one.
      let adjustedIndex = toIndex;
      if (fromColumn === toColumn && cardIndex < toIndex) {
        adjustedIndex -= 1;
      }

      const isSameColumn = fromColumn === toColumn;
      const dest = isSameColumn ? source : [...prev[toColumn]];

      if (!isSameColumn) {
        const cap = capFor(toColumn);
        if (cap != null && dest.length >= cap) return prev; // reject: would exceed cap
      }

      const clamped = Math.max(0, Math.min(adjustedIndex, dest.length));
      dest.splice(clamped, 0, card);

      return isSameColumn
        ? { ...prev, [fromColumn]: dest }
        : { ...prev, [fromColumn]: source, [toColumn]: dest };
    });
  }, []);

  return { columns, addCard, moveCard, isAtCap };
}
