export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export const IN_PROGRESS_CAP = 4;
