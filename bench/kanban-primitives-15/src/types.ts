export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** A single-letter assignee initial, shown in a small round avatar. */
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

/** Soft caps per column — a column absent here has no cap. */
export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inprogress: 4,
};

/**
 * Where a dragged card should land within a target column, expressed relative to an existing
 * card rather than a raw array index — this keeps drop targeting correct even while `search` is
 * hiding some cards from the DOM (a hidden card still occupies a real position in the underlying
 * list, so indexing by *visible* position alone would silently reorder around it).
 */
export interface DropTarget {
  column: ColumnId;
  /** null means "at the end of the column's full list", independent of `position`. */
  cardId: string | null;
  position: "before" | "after";
}
