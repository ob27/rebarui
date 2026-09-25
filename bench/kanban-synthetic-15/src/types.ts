export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string; // single-letter initial
}

export interface ColumnData {
  id: ColumnId;
  title: string;
  cap?: number;
  cards: CardData[];
}
