export type ColumnId = "todo" | "inProgress" | "done";

export type CardTag = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  tag?: CardTag;
  assignee: string;
}

export const COLUMN_IDS: ColumnId[] = ["todo", "inProgress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inProgress: 4,
};
