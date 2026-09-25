import type { ColumnsState } from "./types";

export const seedColumns: ColumnsState = {
  todo: [
    {
      id: "c1",
      title: "Design empty states",
      description: "Cover no-results and error variants",
      assignee: "A",
    },
    {
      id: "c2",
      title: "Write onboarding copy",
      assignee: "J",
    },
  ],
  "in-progress": [
    {
      id: "c3",
      title: "Wire up search API",
      description: "Debounce and cancel in-flight requests",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "c4",
      title: "Refactor auth middleware",
      assignee: "R",
    },
  ],
  done: [
    {
      id: "c5",
      title: "Set up CI pipeline",
      assignee: "T",
    },
  ],
};
