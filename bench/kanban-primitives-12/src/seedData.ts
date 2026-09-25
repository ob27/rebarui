import type { BoardState } from "./types";

export const initialBoard: BoardState = {
  todo: [
    {
      id: "card-1",
      title: "Set up staging environment",
      description: "Mirror prod config, point at the seeded test database",
      status: null,
      assignee: "R",
    },
    {
      id: "card-2",
      title: "Write onboarding checklist",
      description: "Doc the first-week steps for a new engineer",
      status: null,
      assignee: "M",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Fix drag ghost flicker on Safari",
      description: "Repro only happens with trackpad, not mouse",
      status: "Blocked",
      assignee: "T",
    },
    {
      id: "card-4",
      title: "Add rate limiting to /api/search",
      description: "Cap at 30 req/min per IP",
      status: null,
      assignee: "A",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Migrate CI to new runner image",
      description: "Cut build time from ~9min to ~4min",
      status: "Review",
      assignee: "R",
    },
  ],
};
