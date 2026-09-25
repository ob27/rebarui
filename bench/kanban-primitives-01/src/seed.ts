import type { BoardState, CardData, ColumnDef } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

let idCounter = 0;

/** Deterministic-enough unique id generator — no backend/persistence needed, so a plain counter
 * (rather than crypto.randomUUID) keeps ids short and readable in the DOM for debugging/tests. */
export function nextId(): string {
  idCounter += 1;
  return `card-${idCounter}`;
}

function seedCard(data: Omit<CardData, "id">): CardData {
  return { id: nextId(), ...data };
}

export function createInitialBoard(): BoardState {
  return {
    todo: [
      seedCard({
        title: "Design onboarding flow",
        description: "Sketch the first-run experience for new teams",
        assignee: "R",
      }),
      seedCard({
        title: "Write API docs for billing",
        assignee: "T",
      }),
    ],
    "in-progress": [
      seedCard({
        title: "Fix flaky checkout test",
        description: "Needs staging environment access",
        tag: "Blocked",
        assignee: "J",
      }),
      seedCard({
        title: "Refactor auth middleware",
        tag: "Review",
        assignee: "M",
      }),
    ],
    done: [
      seedCard({
        title: "Set up CI pipeline",
        assignee: "R",
      }),
    ],
  };
}
