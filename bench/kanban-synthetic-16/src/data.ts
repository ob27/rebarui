import type { CardData, ColumnDef, ColumnId } from "./types";

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

/** Soft cap for the "In Progress" column — enforced on both drag-drop and add-card. */
export const IN_PROGRESS_CAP = 4;

export const SEED_DATA: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "seed-1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for build + test",
      assignee: "T",
    },
    {
      id: "seed-2",
      title: "Design onboarding flow",
      description: "First-run experience for new workspaces",
      assignee: "R",
    },
  ],
  "in-progress": [
    {
      id: "seed-3",
      title: "Fix login redirect bug",
      description: "Redirects to /undefined after SSO callback",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "seed-4",
      title: "Refactor API client",
      status: "Review",
      assignee: "J",
    },
  ],
  done: [
    {
      id: "seed-5",
      title: "Write project README",
      assignee: "T",
    },
  ],
};
