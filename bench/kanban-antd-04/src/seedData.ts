import type { BoardState } from "./types";

let idCounter = 0;

export function makeId(): string {
  idCounter += 1;
  return `card-${idCounter}-${Date.now().toString(36)}`;
}

export function seedBoard(): BoardState {
  return {
    todo: [
      {
        id: makeId(),
        title: "Set up CI pipeline",
        description: "GitHub Actions for lint + test",
        assignee: "T",
      },
      {
        id: makeId(),
        title: "Design empty states",
        description: "For board and search results",
        assignee: "R",
      },
    ],
    inProgress: [
      {
        id: makeId(),
        title: "Drag-and-drop reorder",
        description: "Cross-column + within-column moves",
        status: "Blocked",
        assignee: "A",
      },
      {
        id: makeId(),
        title: "Search filter",
        description: "Case-insensitive title substring match",
        assignee: "M",
      },
    ],
    done: [
      {
        id: makeId(),
        title: "Project scaffold",
        description: "Vite + antd + TypeScript",
        assignee: "T",
      },
    ],
  };
}
