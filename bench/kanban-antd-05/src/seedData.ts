import type { CardData, ColumnId } from "./types";

export const SEED_COLUMNS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "t1",
      title: "Design empty states",
      description: "Cover zero-data and error variants",
      assignee: "A",
    },
    {
      id: "t2",
      title: "Write onboarding copy",
      status: "Review",
      assignee: "J",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Refactor auth middleware",
      description: "Split token refresh logic out",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "p2",
      title: "Kanban drag polish",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Set up CI pipeline",
      assignee: "S",
    },
  ],
};
