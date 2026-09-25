import type { CardData, ColumnId } from "./types";

export const SEED_CARDS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Draft onboarding docs",
      description: "Cover install + first run",
      status: null,
      assignee: "R",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Fix search debounce bug",
      description: "Rapid typing drops keystrokes",
      status: "Blocked",
      assignee: "A",
    },
    {
      id: "card-4",
      title: "Kanban drag polish",
      description: "Smooth reorder animation",
      status: null,
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Ship theme-clean package",
      description: "Published to npm",
      status: "Review",
      assignee: "T",
    },
  ],
};
