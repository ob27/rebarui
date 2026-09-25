export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review" | undefined;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export interface ColumnMeta {
  id: ColumnId;
  title: string;
  cap?: number;
}
