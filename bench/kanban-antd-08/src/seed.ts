import type { CardData, ColumnId } from "./types";

export const seedCards: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "GitHub Actions for lint + test on every PR",
      assignee: "Priya",
    },
    {
      id: "card-2",
      title: "Design empty states",
      status: "Review",
      assignee: "Marco",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Wire up drag-and-drop",
      description: "dnd-kit multi-column sortable",
      status: "Blocked",
      assignee: "Priya",
    },
    {
      id: "card-4",
      title: "Implement search filter",
      assignee: "Jun",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Project kickoff",
      assignee: "Marco",
    },
  ],
};
