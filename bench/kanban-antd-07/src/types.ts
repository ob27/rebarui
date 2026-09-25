export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial shown in the card's avatar. */
  assignee: string;
}

export type ColumnsState = Record<ColumnId, KanbanCardData[]>;

export interface DropTarget {
  col: ColumnId;
  index: number;
}
