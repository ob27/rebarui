// Pure state-transition helpers for the board — no DOM, no React. Kept separate so the
// drag/reorder/add-card *behavior* (the part this condition requires hand-writing) is easy to
// read and reason about on its own.

import { COLUMN_CAPS } from "./types";
import type { BoardState, CardData, ColumnId } from "./types";

/**
 * Moves (or reorders) a card to `toIndex` within `toColumn`.
 *
 * Returns the *same* `board` reference, unchanged, if the move would push `toColumn` past its
 * soft cap — callers can rely on this to detect a rejected move without a separate boolean.
 */
export function moveCard(
  board: BoardState,
  cardId: string,
  fromColumn: ColumnId,
  toColumn: ColumnId,
  toIndex: number,
): BoardState {
  const fromList = board[fromColumn];
  const cardIndex = fromList.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return board;
  const card = fromList[cardIndex];

  const cap = COLUMN_CAPS[toColumn];
  if (cap !== undefined && toColumn !== fromColumn && board[toColumn].length >= cap) {
    return board;
  }

  const newFromList = fromList.filter((c) => c.id !== cardId);
  const destBaseList = fromColumn === toColumn ? newFromList : board[toColumn];

  let insertIndex = toIndex;
  if (fromColumn === toColumn && cardIndex < toIndex) insertIndex -= 1;
  insertIndex = Math.max(0, Math.min(insertIndex, destBaseList.length));

  const newToList = [...destBaseList];
  newToList.splice(insertIndex, 0, card);

  if (fromColumn === toColumn) {
    return { ...board, [toColumn]: newToList };
  }
  return { ...board, [fromColumn]: newFromList, [toColumn]: newToList };
}

/** Adds `card` to the top of `column` — or returns `board` unchanged if the column is at cap. */
export function addCardToTop(board: BoardState, column: ColumnId, card: CardData): BoardState {
  const cap = COLUMN_CAPS[column];
  if (cap !== undefined && board[column].length >= cap) return board;
  return { ...board, [column]: [card, ...board[column]] };
}
