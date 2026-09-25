export type StatusTag = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: StatusTag;
  assignee: string;
}

export type ColumnId = "todo" | "inprogress" | "done";

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

// Soft cap: only "In Progress" has one for this board.
export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inprogress: 4,
};

export function isColumnId(id: string): id is ColumnId {
  return id === "todo" || id === "inprogress" || id === "done";
}
