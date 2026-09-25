import type { ColumnsState } from "./types";

export const IN_PROGRESS_CAP = 4;

export const INITIAL_COLUMNS: ColumnsState = {
  todo: [
    {
      id: "t1",
      title: "Set up CI pipeline",
      description: "Configure GitHub Actions for build + test",
      assignee: "A",
    },
    {
      id: "t2",
      title: "Design onboarding flow",
      description: "Wireframes for new user signup",
      assignee: "J",
    },
    {
      id: "t3",
      title: "Write API docs",
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Refactor auth module",
      description: "Split token refresh logic out of the session handler",
      status: "Blocked",
      assignee: "S",
    },
    {
      id: "p2",
      title: "Implement search filter",
      description: "Debounced input, case-insensitive match",
      status: "Review",
      assignee: "K",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Project kickoff",
      description: "Initial planning meeting",
      assignee: "T",
    },
  ],
};
