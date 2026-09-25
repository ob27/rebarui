import type { CardData, ColumnId } from "./types";

let nextId = 1000;
export function makeId(): string {
  nextId += 1;
  return `card-${nextId}`;
}

export const SEED_DATA: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Design empty states",
      description: "Cover no-results and zero-card columns",
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Write onboarding copy",
      assignee: "J",
    },
  ],
  inProgress: [
    {
      id: "card-3",
      title: "Wire up search filter",
      description: "Debounce input, filter across columns",
      status: "Review",
      assignee: "T",
    },
    {
      id: "card-4",
      title: "Fix drag ghost styling",
      status: "Blocked",
      assignee: "M",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Set up project scaffold",
      assignee: "T",
    },
  ],
};
