export type ColumnId = "todo" | "inProgress" | "done";

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
  /** Soft cap on card count, if any. */
  cap?: number;
}

export const COLUMN_META: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
