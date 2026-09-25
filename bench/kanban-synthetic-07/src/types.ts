export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  /** Optional one-line context shown under the title. */
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, or "?" for an unassigned card. */
  assignee: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — only "In Progress" has one. */
  cap?: number;
}
