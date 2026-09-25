export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, shown in a small round avatar. */
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export interface ColumnMeta {
  id: ColumnId;
  title: string;
  /** Soft cap on card count, if this column has one. */
  cap?: number;
}

export const COLUMNS: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
