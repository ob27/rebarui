import type { BoardState } from "./types";

let seq = 0;
function id(): string {
  seq += 1;
  return `seed-${seq}`;
}

export function createSeedBoard(): BoardState {
  return {
    todo: [
      { id: id(), title: "Write onboarding docs", description: "Cover the new signup flow", assignee: "A" },
      { id: id(), title: "Set up staging DB", assignee: "R" },
    ],
    inprogress: [
      {
        id: id(),
        title: "Fix flaky checkout test",
        description: "Intermittent timeout on CI",
        status: "Blocked",
        assignee: "M",
      },
      { id: id(), title: "Redesign settings page", assignee: "S" },
    ],
    done: [{ id: id(), title: "Ship dark mode", assignee: "T" }],
  };
}
