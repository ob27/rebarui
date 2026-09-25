import type { CardData, ColumnId } from "./types";

let idCounter = 0;
export function makeId(): string {
  idCounter += 1;
  return `card-${idCounter}`;
}

export function makeSeedCards(): Record<ColumnId, CardData[]> {
  return {
    todo: [
      {
        id: makeId(),
        title: "Set up CI pipeline",
        description: "GitHub Actions for lint + test",
        assignee: "A",
      },
      { id: makeId(), title: "Design empty states", assignee: "R" },
    ],
    inprogress: [
      {
        id: makeId(),
        title: "Refactor auth module",
        description: "Split token refresh out of context",
        status: "Blocked",
        assignee: "J",
      },
      { id: makeId(), title: "Sprint board search", assignee: "M" },
    ],
    done: [{ id: makeId(), title: "Upgrade to React 19", assignee: "T" }],
  };
}
