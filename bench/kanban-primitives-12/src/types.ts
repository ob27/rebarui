export type StatusTag = "Blocked" | "Review" | null;

export interface SprintCard {
  id: string;
  title: string;
  description?: string;
  status: StatusTag;
  assignee: string; // single-letter initial
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

export type BoardState = Record<ColumnId, SprintCard[]>;
