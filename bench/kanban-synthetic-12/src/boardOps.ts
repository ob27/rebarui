import { COLUMN_CAPS, type BoardState, type ColumnId } from "./types";

/**
 * True if moving a card into `to` (from a *different* column) would exceed that column's soft
 * cap. Reordering within the same column never counts against the cap — the card is already
 * there.
 */
export function wouldExceedCap(board: BoardState, to: ColumnId, from: ColumnId): boolean {
  if (from === to) return false;
  const cap = COLUMN_CAPS[to];
  if (cap === undefined) return false;
  return board[to].length >= cap;
}

/**
 * Moves the card with `cardId` out of `from` and into `to` at `toIndex`, returning a new board
 * state (never mutates the input). Handles the same-column reorder case (index shift after
 * removal) and rejects the move outright — returning the board unchanged — if it would exceed
 * the destination column's cap.
 */
export function moveCard(
  board: BoardState,
  cardId: string,
  from: ColumnId,
  to: ColumnId,
  toIndex: number,
): BoardState {
  const sourceList = [...board[from]];
  const sourceIndex = sourceList.findIndex((c) => c.id === cardId);
  if (sourceIndex === -1) return board;

  if (wouldExceedCap(board, to, from)) return board;

  const [moved] = sourceList.splice(sourceIndex, 1);

  if (from === to) {
    let insertAt = toIndex;
    if (sourceIndex < insertAt) insertAt -= 1;
    insertAt = Math.max(0, Math.min(insertAt, sourceList.length));
    sourceList.splice(insertAt, 0, moved);
    return { ...board, [from]: sourceList };
  }

  const targetList = [...board[to]];
  const insertAt = Math.max(0, Math.min(toIndex, targetList.length));
  targetList.splice(insertAt, 0, moved);
  return { ...board, [from]: sourceList, [to]: targetList };
}
