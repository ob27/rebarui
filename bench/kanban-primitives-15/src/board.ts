import { COLUMN_CAPS } from "./types";
import type { BoardState, ColumnId, DropTarget } from "./types";

/**
 * Moves `cardId` from `from` to the column/position described by `target`, enforcing each
 * column's soft cap (a cross-column move into a column at its cap is rejected outright — the
 * board is returned unchanged; a same-column reorder never changes that column's count, so it's
 * never capped).
 *
 * Returns the same `prev` reference when the move is a no-op (card not found, cap exceeded, or
 * dropped onto itself) so callers can skip a re-render.
 */
export function moveCard(prev: BoardState, cardId: string, from: ColumnId, target: DropTarget): BoardState {
  const { column: to, cardId: relativeToCardId, position } = target;

  if (relativeToCardId === cardId) return prev;

  const sourceList = prev[from];
  const cardIndex = sourceList.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return prev;

  if (from !== to) {
    const cap = COLUMN_CAPS[to];
    if (cap !== undefined && prev[to].length >= cap) return prev;
  }

  const fromList = [...sourceList];
  const [card] = fromList.splice(cardIndex, 1);

  const toList = from === to ? fromList : [...prev[to]];

  let insertIndex: number;
  if (relativeToCardId === null) {
    insertIndex = toList.length;
  } else {
    const anchorIndex = toList.findIndex((c) => c.id === relativeToCardId);
    insertIndex = anchorIndex === -1 ? toList.length : position === "before" ? anchorIndex : anchorIndex + 1;
  }
  insertIndex = Math.max(0, Math.min(insertIndex, toList.length));

  toList.splice(insertIndex, 0, card);

  if (from === to) {
    return { ...prev, [to]: toList };
  }
  return { ...prev, [from]: fromList, [to]: toList };
}

/** True if adding one more card to `column` would exceed its soft cap. */
export function isColumnFull(prev: BoardState, column: ColumnId): boolean {
  const cap = COLUMN_CAPS[column];
  return cap !== undefined && prev[column].length >= cap;
}
