export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial rendered in a small round avatar. Optional — a freshly
   * added card (title only, via the "+ Add card" control) has no assignee yet. */
  assignee?: string;
}

export interface ColumnMeta {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — only "In Progress" has one. */
  cap?: number;
}

/** A card actively being dragged, and the column it started in. */
export interface DragState {
  card: CardData;
  columnId: ColumnId;
}

/** Where a drop would land: which column, and the index within that column's *visible* (i.e.
 * search-matching) cards. */
export interface DropIndicator {
  columnId: ColumnId;
  index: number;
}
