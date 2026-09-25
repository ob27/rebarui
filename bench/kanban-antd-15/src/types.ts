export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  cap?: number;
}

export type BoardState = Record<ColumnId, CardData[]>;
