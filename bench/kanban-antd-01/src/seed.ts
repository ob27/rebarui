import type { BoardState, CardData, ColumnDef } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

let idCounter = 0;
export function nextId(): string {
  idCounter += 1;
  return `card-${Date.now()}-${idCounter}`;
}

function card(partial: Omit<CardData, "id">): CardData {
  return { id: nextId(), ...partial };
}

export function createInitialBoard(): BoardState {
  return {
    todo: [
      card({
        title: "Set up CI pipeline",
        description: "Lint, typecheck, and test on every push",
        assignee: "T",
      }),
      card({
        title: "Draft onboarding email",
        description: "First-run welcome message for new accounts",
        assignee: "M",
      }),
    ],
    "in-progress": [
      card({
        title: "Fix search debounce",
        description: "Search fires on every keystroke, needs throttling",
        status: "Blocked",
        assignee: "J",
      }),
      card({
        title: "Sprint board column caps",
        description: "Enforce the 4-card soft cap on In Progress",
        status: "Review",
        assignee: "T",
      }),
    ],
    done: [
      card({
        title: "Migrate to antd v6",
        description: "Bumped major version, no visual regressions",
        assignee: "A",
      }),
    ],
  };
}
