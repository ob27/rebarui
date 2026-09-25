import type { Board, CardData, ColumnId } from "./types";
import { COLUMNS } from "./types";

export function capFor(columnId: ColumnId): number | undefined {
  return COLUMNS.find((c) => c.id === columnId)?.cap;
}

/** Whether adding one more card to `columnId` (via drop or add-card) would exceed its soft cap. */
export function isAtCap(board: Board, columnId: ColumnId): boolean {
  const cap = capFor(columnId);
  return cap !== undefined && board[columnId].length >= cap;
}

/**
 * Moves `cardId` from `fromColumn` to `toColumn` at `toIndex` (an index into the *destination*
 * column's array, pre-removal). Rejects (returns the original board unchanged) a cross-column move
 * that would push the destination over its soft cap — a same-column reorder never changes that
 * column's count, so it's never rejected here.
 */
export function moveCard(
  board: Board,
  cardId: string,
  fromColumn: ColumnId,
  toColumn: ColumnId,
  toIndex: number,
): Board {
  const fromList = [...board[fromColumn]];
  const cardIndex = fromList.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return board;

  if (fromColumn !== toColumn && isAtCap(board, toColumn)) {
    return board;
  }

  const [card] = fromList.splice(cardIndex, 1);

  if (fromColumn === toColumn) {
    let insertAt = toIndex;
    if (cardIndex < insertAt) insertAt -= 1;
    insertAt = clamp(insertAt, 0, fromList.length);
    fromList.splice(insertAt, 0, card);
    return { ...board, [fromColumn]: fromList };
  }

  const toList = [...board[toColumn]];
  const insertAt = clamp(toIndex, 0, toList.length);
  toList.splice(insertAt, 0, card);
  return { ...board, [fromColumn]: fromList, [toColumn]: toList };
}

export function addCard(board: Board, columnId: ColumnId, card: CardData): Board {
  if (isAtCap(board, columnId)) return board;
  return { ...board, [columnId]: [card, ...board[columnId]] };
}

export function matchesSearch(card: CardData, query: string): boolean {
  if (!query.trim()) return true;
  return card.title.toLowerCase().includes(query.trim().toLowerCase());
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

let idCounter = 0;
export function nextCardId(): string {
  idCounter += 1;
  return `card-new-${Date.now()}-${idCounter}`;
}
