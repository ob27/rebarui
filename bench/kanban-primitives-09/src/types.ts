// Shared data shapes for the Sprint Board.

export type StatusTag = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: StatusTag;
  /** A single-letter assignee initial, rendered in a small round Avatar. */
  assignee: string;
}

export type ColumnId = "todo" | "in-progress" | "done";

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — undefined means uncapped. */
  cap?: number;
}

export type BoardState = Record<ColumnId, CardData[]>;
