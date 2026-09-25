import type { BoardState } from "./types";

let seq = 0;

/** Generates a unique-enough id for a newly added card within this session. */
export function nextId(prefix = "card"): string {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

export const initialBoard: BoardState = {
  todo: [
    {
      id: "seed-todo-1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for lint + test",
      status: null,
      assignee: "A",
    },
    {
      id: "seed-todo-2",
      title: "Draft onboarding docs",
      description: "Outline the first-run experience",
      status: null,
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "seed-inprogress-1",
      title: "Build search filter",
      description: "Client-side substring match across columns",
      status: "Review",
      assignee: "J",
    },
    {
      id: "seed-inprogress-2",
      title: "Fix drag jitter on Safari",
      status: "Blocked",
      assignee: "K",
    },
  ],
  done: [
    {
      id: "seed-done-1",
      title: "Wire up theme package",
      description: "theme-clean tokens applied across primitives",
      status: null,
      assignee: "T",
    },
  ],
};
