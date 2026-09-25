export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  columnId: ColumnId;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, rendered in a small round avatar. */
  assignee: string;
}

export interface ColumnConfig {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — only "In Progress" has one. */
  cap?: number;
}

export const COLUMNS: ColumnConfig[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
