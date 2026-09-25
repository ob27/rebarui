import type { CardData, ColumnId } from "./types";

export const seedColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "t1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for lint + test",
      assignee: "A",
    },
    {
      id: "t2",
      title: "Design onboarding flow",
      description: "Wireframe the first-run experience",
      assignee: "B",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Refactor auth module",
      description: "Split token refresh into its own hook",
      tag: "Blocked",
      assignee: "C",
    },
    {
      id: "p2",
      title: "Implement search filter",
      description: "Debounce input, filter across columns",
      assignee: "A",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Migrate to Vite",
      description: "Swap CRA for Vite build tooling",
      assignee: "D",
    },
  ],
};
