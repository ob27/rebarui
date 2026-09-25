import type { Board, ColumnDef } from "./types";

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const seedBoard: Board = {
  todo: [
    {
      id: "t1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for lint + test",
      assignee: "A",
    },
    {
      id: "t2",
      title: "Design onboarding flow",
      description: "Sketch the first-run experience",
      assignee: "B",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Implement auth service",
      description: "JWT-based session handling",
      status: "Blocked",
      assignee: "C",
    },
    {
      id: "p2",
      title: "Refactor API client",
      assignee: "D",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Project kickoff",
      description: "Align on scope and timeline",
      assignee: "A",
    },
  ],
};
