import type { BoardState } from "./types";

export function createSeedBoard(): BoardState {
  return {
    todo: [
      {
        id: "card-1",
        title: "Write onboarding checklist",
        description: "Draft the first-run checklist for new workspace members.",
        assignee: "J",
      },
      {
        id: "card-2",
        title: "Audit unused feature flags",
        assignee: "T",
      },
    ],
    inprogress: [
      {
        id: "card-3",
        title: "Fix pagination on reports table",
        description: "Page size resets to 10 after a filter change.",
        status: "Blocked",
        assignee: "R",
      },
      {
        id: "card-4",
        title: "Design empty states for search",
        status: "Review",
        assignee: "M",
      },
    ],
    done: [
      {
        id: "card-5",
        title: "Upgrade build pipeline to Node 20",
        assignee: "T",
      },
    ],
  };
}
