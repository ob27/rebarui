export type ColumnId = "todo" | "in-progress" | "done";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: "Blocked" | "Review";
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — only "In Progress" has one. */
  cap?: number;
}

export type ColumnsState = Record<ColumnId, CardData[]>;
