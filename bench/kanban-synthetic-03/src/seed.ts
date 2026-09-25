import type { CardData, ColumnData, ColumnId } from "./types";

export const COLUMNS: ColumnData[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const SEED_CARDS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Write onboarding docs",
      description: "Cover the first-run setup flow",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Design empty states",
      status: null,
      assignee: "J",
    },
  ],
  inprogress: [
    {
      id: "card-3",
      title: "Refactor auth middleware",
      description: "Blocked on infra approval",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "card-4",
      title: "Sprint board polish",
      status: "Review",
      assignee: "A",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up CI pipeline",
      description: "Runs on every push",
      status: null,
      assignee: "T",
    },
  ],
};
