export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface SprintCard {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  assignee: string;
}

export type ColumnsState = Record<ColumnId, SprintCard[]>;

export interface DropTarget {
  column: ColumnId;
  /** Insert relative to this card's id — `null` means "append at the end of the column". */
  anchorId: string | null;
  position: "before" | "after";
}

export const COLUMN_ORDER: ColumnId[] = ["todo", "in-progress", "done"];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const IN_PROGRESS_CAP = 4;
