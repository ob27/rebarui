import type { ColumnDef, ColumnsState } from "./types";

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const INITIAL_COLUMNS: ColumnsState = {
  todo: [
    {
      id: "seed-todo-1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for lint + tests",
      assignee: "J",
    },
    {
      id: "seed-todo-2",
      title: "Design onboarding flow",
      description: "Sketch the new-user signup steps",
      assignee: "A",
    },
  ],
  "in-progress": [
    {
      id: "seed-progress-1",
      title: "Fix login redirect bug",
      description: "Users land on 404 after SSO login",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "seed-progress-2",
      title: "Implement search API",
      description: "Paginated full-text search endpoint",
      status: "Review",
      assignee: "S",
    },
  ],
  done: [
    {
      id: "seed-done-1",
      title: "Update dependencies",
      description: "Bump React and Vite to latest",
      assignee: "T",
    },
  ],
};
