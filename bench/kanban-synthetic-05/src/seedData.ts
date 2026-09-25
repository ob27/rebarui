import type { CardData, ColumnId } from "./types";

export const COLUMN_DEFS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const IN_PROGRESS_CAP = 4;

export const seedColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Write onboarding checklist",
      description: "Cover account setup and first project",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Audit unused dependencies",
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Fix flaky drag-and-drop test",
      description: "Intermittent failure on column reorder",
      status: "Blocked",
      assignee: "T",
    },
    {
      id: "card-4",
      title: "Draft sprint retro notes",
      status: "Review",
      assignee: "J",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up CI pipeline",
      assignee: "K",
    },
  ],
};
