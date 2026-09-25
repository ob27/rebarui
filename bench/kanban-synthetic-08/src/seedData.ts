import type { BoardState } from "./types";

export const SEED_BOARD: BoardState = {
  todo: [
    {
      id: "seed-1",
      title: "Design empty states",
      description: "Cover loading, error, and empty board states",
      assignee: "A",
    },
    {
      id: "seed-2",
      title: "Wire up API client",
      assignee: "R",
    },
  ],
  inprogress: [
    {
      id: "seed-3",
      title: "Fix drag ghost flicker",
      description: "Repro is Safari-only, on Retina displays",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "seed-4",
      title: "Add search debounce",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "seed-5",
      title: "Set up CI pipeline",
      assignee: "J",
    },
  ],
};
