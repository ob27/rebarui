import type { BoardState, ColumnMeta } from "./types";

export const COLUMNS: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const INITIAL_BOARD: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow",
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Draft onboarding flow",
      assignee: "R",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Fix login redirect bug",
      description: "Redirects to wrong page after SSO",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "card-4",
      title: "Migrate search index",
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Ship dark mode toggle",
      description: "Rolled out behind a feature flag",
      assignee: "K",
    },
  ],
};
