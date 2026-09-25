import type { ColumnsState } from "./types";

export const SEED_COLUMNS: ColumnsState = {
  todo: [
    {
      id: "card-1",
      title: "Write onboarding email copy",
      description: "Draft the 3-email welcome sequence",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Audit third-party font licenses",
      assignee: "T",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Fix pagination bug on reports page",
      description: "Page 2+ drops the active filter",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "card-4",
      title: "Add CSV export to invoices",
      status: "Review",
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Migrate auth to new session store",
      assignee: "R",
    },
  ],
};
