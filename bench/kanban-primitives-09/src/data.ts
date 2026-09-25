import type { BoardState, ColumnDef } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const initialBoard: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow to the repo",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Draft onboarding docs",
      description: "Cover install steps and first run",
      status: null,
      assignee: "M",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Migrate auth service",
      description: "Swap session store to Redis",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "card-4",
      title: "Sprint board polish",
      description: "Column caps and search filter",
      status: "Review",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Wire up theme-clean",
      description: "Ship the default theme package",
      status: null,
      assignee: "R",
    },
  ],
};
