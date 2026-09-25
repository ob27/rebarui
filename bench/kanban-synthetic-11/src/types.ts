export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  assignee: string; // single-letter initial
}

export interface ColumnData {
  id: ColumnId;
  title: string;
  cap?: number;
}

export const COLUMNS: ColumnData[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
