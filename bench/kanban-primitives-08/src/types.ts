export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  /** Single-letter assignee initial, shown in a small round avatar. */
  assignee: string;
}

export interface ColumnConfig {
  id: ColumnId;
  title: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

/** Soft caps per column — only "In Progress" has one for this board. */
export const COLUMN_CAP: Partial<Record<ColumnId, number>> = {
  inProgress: 4,
};

export type Board = Record<ColumnId, CardData[]>;
