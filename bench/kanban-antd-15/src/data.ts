import type { BoardState, ColumnDef } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const seedBoard: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Design onboarding flow",
      description: "Wireframes for the new signup experience",
      assignee: "A",
    },
    {
      id: "card-2",
      title: "Set up CI pipeline",
      assignee: "B",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Implement auth API",
      description: "JWT access + refresh tokens",
      status: "Blocked",
      assignee: "C",
    },
    {
      id: "card-4",
      title: "Build settings page",
      assignee: "D",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Project kickoff",
      assignee: "A",
    },
  ],
};
