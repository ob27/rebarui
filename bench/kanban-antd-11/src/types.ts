export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export type ColumnId = "todo" | "inProgress" | "done";

export type ColumnsState = Record<ColumnId, CardData[]>;
