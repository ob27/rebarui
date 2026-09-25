import type { ColumnDef, SprintCard } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const SEED_CARDS: Record<string, SprintCard[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow",
      status: null,
      assignee: "A",
    },
    {
      id: "card-2",
      title: "Write onboarding docs",
      description: "Cover local dev setup",
      status: null,
      assignee: "B",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Refactor auth module",
      description: "Split token refresh logic",
      status: "Blocked",
      assignee: "C",
    },
    {
      id: "card-4",
      title: "Design new dashboard",
      description: "Waiting on stakeholder sign-off",
      status: "Review",
      assignee: "D",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Migrate database schema",
      description: "Applied to production",
      status: null,
      assignee: "E",
    },
  ],
};
