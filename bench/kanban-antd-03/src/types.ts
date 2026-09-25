export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, rendered in a small round avatar. */
  assignee: string;
}

export type ColumnsState = Record<ColumnId, KanbanCard[]>;
