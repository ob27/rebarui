import type { ColumnMeta } from "./types";

export const IN_PROGRESS_CAP = 4;

export const COLUMN_META: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: IN_PROGRESS_CAP },
  { id: "done", title: "Done" },
];
