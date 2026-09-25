export type ColumnId = "todo" | "inprogress" | "done";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: "Blocked" | "Review";
  assignee: string;
}

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export const IN_PROGRESS_CAP = 4;
