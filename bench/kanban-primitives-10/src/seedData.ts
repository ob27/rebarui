import type { BoardState } from "./types";

export function createSeedBoard(): BoardState {
  return {
    todo: [
      {
        id: "seed-1",
        title: "Set up CI pipeline",
        description: "GitHub Actions build + test",
        assignee: "T",
      },
      {
        id: "seed-2",
        title: "Write onboarding docs",
        assignee: "R",
      },
    ],
    inprogress: [
      {
        id: "seed-3",
        title: "Refactor auth module",
        description: "Split login/session logic",
        status: "Blocked",
        assignee: "A",
      },
      {
        id: "seed-4",
        title: "Design empty states",
        assignee: "M",
      },
    ],
    done: [
      {
        id: "seed-5",
        title: "Ship v1 landing page",
        assignee: "T",
      },
    ],
  };
}
