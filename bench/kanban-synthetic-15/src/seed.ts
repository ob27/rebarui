import type { ColumnData } from "./types";

export const SEED_COLUMNS: ColumnData[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      {
        id: "c1",
        title: "Write onboarding checklist",
        description: "Cover account setup, first project, invite flow.",
        assignee: "R",
      },
      {
        id: "c2",
        title: "Audit unused CSS variables",
        assignee: "T",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cap: 4,
    cards: [
      {
        id: "c3",
        title: "Fix drag ghost offset on Firefox",
        description: "Reproduces only with a scaled viewport.",
        status: "Blocked",
        assignee: "M",
      },
      {
        id: "c4",
        title: "Search box keyboard focus trap",
        status: "Review",
        assignee: "R",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "c5",
        title: "Set up CI for the bench scaffolds",
        assignee: "T",
      },
    ],
  },
];
