import type { ColumnId, ColumnsState } from "./types";

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export const COLUMN_ORDER: ColumnId[] = ["todo", "inProgress", "done"];

/** Soft cap on how many cards "In Progress" may hold. */
export const IN_PROGRESS_CAP = 4;

export const initialColumns: ColumnsState = {
  todo: [
    {
      id: "t1",
      title: "Design onboarding flow",
      description: "Sketch the first-run screens",
      assignee: "A",
    },
    {
      id: "t2",
      title: "Set up CI pipeline",
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Kanban drag-and-drop",
      description: "Cross-column move + in-column reorder",
      status: "Blocked",
      assignee: "T",
    },
    {
      id: "p2",
      title: "Search filter",
      assignee: "R",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Project scaffolding",
      assignee: "T",
    },
  ],
};
