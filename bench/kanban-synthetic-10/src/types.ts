export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, rendered via `Avatar`'s `fallback`. */
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — undefined means uncapped. */
  cap?: number;
}
