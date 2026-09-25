import type { Board } from "./types";

export const seedBoard: Board = {
  todo: [
    {
      id: "card-1",
      title: "Design empty states",
      description: "Cover zero-card columns and a no-results search",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Wire up analytics events",
      assignee: "T",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Refactor auth middleware",
      description: "Split token refresh into its own module",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "card-4",
      title: "Sprint board drag-and-drop",
      status: "Review",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up CI pipeline",
      assignee: "J",
    },
  ],
};
