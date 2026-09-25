import type { Board } from "./types";

export const seedBoard: Board = {
  todo: [
    {
      id: "card-1",
      title: "Write onboarding checklist",
      description: "Cover account setup and first-project walkthrough",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Audit unused dependencies",
      assignee: "J",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Rebuild settings page layout",
      description: "Match the new spacing tokens",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "card-4",
      title: "Add search filter to board",
      status: "Review",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up CI pipeline",
      assignee: "R",
    },
  ],
};
