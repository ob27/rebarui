export type ColumnId = "todo" | "in-progress" | "done";

export type CardTag = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  tag?: CardTag;
  /** Single-letter assignee initial. Omitted for cards created via the inline "+ Add card"
   * control, which only collects a title. */
  assignee?: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count. Only "In Progress" has one per spec. */
  cap?: number;
}

export type BoardState = Record<ColumnId, CardData[]>;

export interface DropIndicator {
  column: ColumnId;
  index: number;
}

export interface DragInfo {
  cardId: string;
  fromColumn: ColumnId;
}
