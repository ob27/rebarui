export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string; // single-letter initial
}

export type BoardState = Record<ColumnId, CardData[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inProgress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

/** Soft cap on the "In Progress" column — the only column with one. */
export const IN_PROGRESS_CAP = 4;
