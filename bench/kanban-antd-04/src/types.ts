export type ColumnId = "todo" | "inProgress" | "done";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: "Blocked" | "Review";
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inProgress", "done"];

export const COLUMN_META: Record<ColumnId, { title: string; cap?: number }> = {
  todo: { title: "To Do" },
  inProgress: { title: "In Progress", cap: 4 },
  done: { title: "Done" },
};
