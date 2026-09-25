import type { ColumnId, SprintCard } from "./types";

export const SEED_CARDS: Record<ColumnId, SprintCard[]> = {
  todo: [
    {
      id: "c1",
      title: "Wire up billing webhook",
      description: "Listen for invoice.paid and reconcile local state",
      status: null,
      assignee: "T",
    },
    {
      id: "c2",
      title: "Design empty states for reports",
      description: "Needs a pass from design before build",
      status: null,
      assignee: "R",
    },
  ],
  "in-progress": [
    {
      id: "c3",
      title: "Migrate auth to session tokens",
      description: "Blocked on infra rotating the signing key",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "c4",
      title: "Sprint board drag-and-drop",
      status: null,
      assignee: "A",
    },
  ],
  done: [
    {
      id: "c5",
      title: "Set up CI pipeline",
      description: "Runs typecheck + tests on every PR",
      status: null,
      assignee: "T",
    },
  ],
};
