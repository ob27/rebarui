import type { CardData, ColumnId } from "./types";

let nextId = 1000;
export function makeId(): string {
  nextId += 1;
  return `card-${nextId}`;
}

export const initialCards: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Write onboarding docs",
      description: "Cover the first-run setup flow",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Design empty states",
      description: "Board, list, and search results",
      status: null,
      assignee: "R",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Fix drag ghost offset",
      description: "Cursor jumps on fast drags",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "card-4",
      title: "Column cap enforcement",
      description: "Reject drops past 4 cards",
      status: null,
      assignee: "J",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Seed data for board",
      description: "Two todo, two in-progress, one done",
      status: null,
      assignee: "T",
    },
  ],
};
