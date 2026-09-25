// Data shapes for the Sprint Board. Kept separate from behavior (board.ts) and presentation
// (KanbanCard.tsx / Column.tsx) so each file stays focused.

export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** A single-letter initial, rendered in a small round Avatar. */
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export interface ColumnDef {
  id: ColumnId;
  title: string;
}

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

/** Soft caps per column — only "In Progress" has one per the spec. */
export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inprogress: 4,
};
