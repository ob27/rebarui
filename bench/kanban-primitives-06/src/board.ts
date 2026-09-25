import type { BoardState, CardData, ColumnId } from "./types";
import { INPROGRESS_CAP } from "./seed";

export function canDropInto(board: BoardState, toColumn: ColumnId, fromColumn: ColumnId): boolean {
  if (toColumn !== "inprogress" || fromColumn === "inprogress") return true;
  return board.inprogress.length < INPROGRESS_CAP;
}

/** Moves `cardId` from `fromColumn` to `toColumn` at `toIndex` (an index into the destination
 * column's list as it exists *before* the move). Returns the board unchanged if the move would
 * push "In Progress" over its soft cap. */
export function moveCard(
  board: BoardState,
  cardId: string,
  fromColumn: ColumnId,
  toColumn: ColumnId,
  toIndex: number,
): BoardState {
  if (!canDropInto(board, toColumn, fromColumn)) return board;

  const sourceList = [...board[fromColumn]];
  const cardIndex = sourceList.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return board;
  const [card] = sourceList.splice(cardIndex, 1);

  const destList: CardData[] = fromColumn === toColumn ? sourceList : [...board[toColumn]];
  let insertIndex = toIndex;
  if (fromColumn === toColumn && cardIndex < toIndex) {
    insertIndex -= 1;
  }
  insertIndex = Math.max(0, Math.min(insertIndex, destList.length));
  destList.splice(insertIndex, 0, card);

  if (fromColumn === toColumn) {
    return { ...board, [toColumn]: destList };
  }
  return { ...board, [fromColumn]: sourceList, [toColumn]: destList };
}
