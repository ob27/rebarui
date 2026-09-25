export type StatusTag = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: StatusTag;
  assignee: string;
}

export type ColumnId = "todo" | "in-progress" | "done";

export interface ColumnDef {
  id: ColumnId;
  title: string;
  cap?: number;
}

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
