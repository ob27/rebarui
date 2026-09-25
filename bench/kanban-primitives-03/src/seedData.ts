import type { CardData, ColumnId } from "./types";

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inprogress: 4,
};

export const seedColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "t1",
      title: "Design onboarding flow",
      description: "Sketch the first-run screens",
      assignee: "A",
    },
    { id: "t2", title: "Write API docs for billing", assignee: "B" },
  ],
  inprogress: [
    {
      id: "p1",
      title: "Fix search index rebuild",
      description: "Nightly job timing out",
      status: "Blocked",
      assignee: "C",
    },
    { id: "p2", title: "Refactor auth middleware", assignee: "D" },
  ],
  done: [{ id: "d1", title: "Set up CI pipeline", assignee: "E" }],
};
