export type ColumnId = "todo" | "inprogress" | "done";

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
