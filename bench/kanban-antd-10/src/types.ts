export type ColumnId = "todo" | "inProgress" | "done";

export type CardTag = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  tag?: CardTag;
  assignee: string; // single-letter initial
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  cap?: number;
}

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
