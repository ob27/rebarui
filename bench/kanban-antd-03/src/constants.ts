import type { ColumnId } from "./types";

export const COLUMN_ORDER: ColumnId[] = ["todo", "in-progress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

/** Soft cap on the "In Progress" column — enforced on both drop and add-card. */
export const IN_PROGRESS_CAP = 4;
