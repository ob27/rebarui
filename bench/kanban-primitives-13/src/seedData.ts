import type { ColumnData } from "./types";

export const initialColumns: ColumnData[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      {
        id: "card-1",
        title: "Design onboarding flow",
        description: "Sketch the first-run experience for new accounts",
        status: null,
        assignee: "A",
      },
      {
        id: "card-2",
        title: "Write API spec for billing",
        description: "Draft endpoints for invoices and subscriptions",
        status: "Review",
        assignee: "M",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cap: 4,
    cards: [
      {
        id: "card-3",
        title: "Implement search filter",
        description: "Add substring search across the board",
        status: "Blocked",
        assignee: "T",
      },
      {
        id: "card-4",
        title: "Refactor auth middleware",
        status: null,
        assignee: "J",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "card-5",
        title: "Set up CI pipeline",
        description: "Run lint, typecheck, and tests on every PR",
        status: null,
        assignee: "R",
      },
    ],
  },
];
