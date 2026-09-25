import type { Board } from "./types";

/** Seed data: 2 cards in To Do, 2 in In Progress (one with a status tag), 1 in Done. */
export const SEED_BOARD: Board = {
  todo: [
    {
      id: "c1",
      title: "Design landing page hero",
      description: "Explore three directions for the new hero section",
      status: null,
      assignee: "A",
    },
    {
      id: "c2",
      title: "Set up CI pipeline",
      description: "Wire GitHub Actions for lint + test",
      status: null,
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "c3",
      title: "Refactor auth module",
      description: "Split token refresh into its own hook",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "c4",
      title: "Write onboarding docs",
      status: null,
      assignee: "T",
    },
  ],
  done: [
    {
      id: "c5",
      title: "Fix footer alignment on mobile",
      description: "Safari flexbox bug",
      status: null,
      assignee: "A",
    },
  ],
};
