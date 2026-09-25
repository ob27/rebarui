export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review" | null;

export interface CardItem {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  assignee: string;
}

export type BoardState = Record<ColumnId, CardItem[]>;

export interface ColumnMeta {
  id: ColumnId;
  title: string;
  /** Soft cap on card count for this column, if any. */
  cap?: number;
}

export const COLUMNS: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
