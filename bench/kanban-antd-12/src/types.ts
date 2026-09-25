export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export interface ColumnMeta {
  id: ColumnId;
  title: string;
  /** Soft cap on card count, if this column has one. */
  cap?: number;
}
