export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Full name; only the first letter is shown in the avatar. Absent = unassigned. */
  assignee?: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count, if any (only "In Progress" has one per spec). */
  cap?: number;
}

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export function getCap(columnId: ColumnId): number | undefined {
  return COLUMNS.find((c) => c.id === columnId)?.cap;
}
