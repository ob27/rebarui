import type { BoardState } from "./types";

let nextId = 1;
export function makeId(): string {
  return `card-${nextId++}`;
}

export function seedBoard(): BoardState {
  return {
    todo: [
      {
        id: makeId(),
        title: "Write onboarding docs",
        description: "Cover the first-run setup flow",
        assignee: "T",
      },
      {
        id: makeId(),
        title: "Audit unused dependencies",
        assignee: "R",
      },
    ],
    inProgress: [
      {
        id: makeId(),
        title: "Fix flaky checkout test",
        description: "Intermittent timeout on CI only",
        status: "Blocked",
        assignee: "M",
      },
      {
        id: makeId(),
        title: "Redesign settings page",
        status: "Review",
        assignee: "J",
      },
    ],
    done: [
      {
        id: makeId(),
        title: "Upgrade build pipeline",
        assignee: "R",
      },
    ],
  };
}
