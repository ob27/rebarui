import type { CardData, ColumnId } from "./types";

export const seedColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "seed-1",
      title: "Set up CI pipeline",
      description: "GitHub Actions for lint + test",
      assignee: "A",
    },
    {
      id: "seed-2",
      title: "Design empty states",
      description: "Cover the board with 0 cards",
      assignee: "M",
    },
  ],
  "in-progress": [
    {
      id: "seed-3",
      title: "Implement drag-and-drop",
      description: "Cards move between columns",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "seed-4",
      title: "Search filter",
      description: "Filter cards by title",
      assignee: "R",
    },
  ],
  done: [
    {
      id: "seed-5",
      title: "Project kickoff",
      description: "Align scope with stakeholders",
      assignee: "T",
    },
  ],
};

export function makeCardId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `card-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
