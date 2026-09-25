import type { BoardState, ColumnDef, ColumnId, SprintCard } from "./types";

/** Locates a card by id anywhere on the board. */
export function findLocation(
  board: BoardState,
  cardId: string,
): { columnId: ColumnId; index: number } | null {
  for (const columnId of Object.keys(board) as ColumnId[]) {
    const index = board[columnId].findIndex((c) => c.id === cardId);
    if (index !== -1) return { columnId, index };
  }
  return null;
}

export function countInColumn(board: BoardState, columnId: ColumnId): number {
  return board[columnId].length;
}

/**
 * Moves (or reorders) a card to `toColumn` at `toIndex`. Enforces a column's soft cap on
 * cross-column moves only — reordering within the same column never changes that column's count,
 * so the cap can't be violated by it. Returns the original board, unchanged, if the move would
 * push a capped destination column over its limit (a rejected drop is a no-op, not a partial one).
 */
export function moveCard(
  board: BoardState,
  columns: ColumnDef[],
  cardId: string,
  toColumn: ColumnId,
  toIndex: number,
): BoardState {
  const location = findLocation(board, cardId);
  if (!location) return board;
  const { columnId: fromColumn, index: fromIndex } = location;
  const card = board[fromColumn][fromIndex];

  const withoutCard: BoardState = {
    ...board,
    [fromColumn]: board[fromColumn].filter((c) => c.id !== cardId),
  };

  const destArr = withoutCard[toColumn];
  const cap = columns.find((c) => c.id === toColumn)?.cap;
  if (fromColumn !== toColumn && cap !== undefined && destArr.length >= cap) {
    return board;
  }

  const clampedIndex = Math.max(0, Math.min(toIndex, destArr.length));
  const newDestArr = [...destArr.slice(0, clampedIndex), card, ...destArr.slice(clampedIndex)];

  return { ...withoutCard, [toColumn]: newDestArr };
}

/** Adds a new card to the top of a column, rejecting (no-op) if that would exceed its cap. */
export function addCard(
  board: BoardState,
  columns: ColumnDef[],
  columnId: ColumnId,
  card: SprintCard,
): BoardState {
  const cap = columns.find((c) => c.id === columnId)?.cap;
  if (cap !== undefined && board[columnId].length >= cap) return board;
  return { ...board, [columnId]: [card, ...board[columnId]] };
}

/** Reads the drop index (in terms of the array with the dragged card already excluded) for a
 * column's card list container, based on where `clientY` sits relative to each rendered card. */
export function getDropIndex(container: HTMLElement, clientY: number, excludeId: string): number {
  const els = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]")).filter(
    (el) => el.dataset.cardId !== excludeId,
  );
  for (let i = 0; i < els.length; i++) {
    const rect = els[i].getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (clientY < mid) return i;
  }
  return els.length;
}
