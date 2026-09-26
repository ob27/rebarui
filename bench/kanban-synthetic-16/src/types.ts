export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, shown in a small round avatar. */
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
}
