import type { BoardState } from "./types";

export const SEED_BOARD: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Design empty states for the reports page",
      description: "Cover zero-data and error variants",
      assignee: "P",
    },
    {
      id: "card-2",
      title: "Write onboarding checklist copy",
      assignee: "R",
    },
  ],
  inprogress: [
    {
      id: "card-3",
      title: "Wire up the billing webhook handler",
      description: "Retry on 5xx, dead-letter after 3 attempts",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "card-4",
      title: "Refactor the session-token refresh flow",
      status: "Review",
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up staging environment",
      description: "Mirrors prod infra, seeded with fixture data",
      assignee: "T",
    },
  ],
};
