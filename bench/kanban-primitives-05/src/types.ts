export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review" | null;

export interface SprintCard {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  cap?: number;
}
