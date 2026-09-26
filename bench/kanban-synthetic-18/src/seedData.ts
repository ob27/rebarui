import type { CardData, ColumnId } from "./types";

export const seedColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "seed-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow",
      status: null,
      assignee: "T",
    },
    {
      id: "seed-2",
      title: "Draft onboarding flow",
      description: "First-run experience for new users",
      status: null,
      assignee: "M",
    },
  ],
  "in-progress": [
    {
      id: "seed-3",
      title: "Fix search debounce bug",
      description: "Requests fire too eagerly",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "seed-4",
      title: "Kanban card drag polish",
      description: "Smooth reorder animation",
      status: "Review",
      assignee: "R",
    },
  ],
  done: [
    {
      id: "seed-5",
      title: "Ship v0.1 changelog",
      description: "Publish release notes",
      status: null,
      assignee: "T",
    },
  ],
};
