import type { CardData, ColumnDef, ColumnId } from "./types";

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const INITIAL_CARDS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Lint, typecheck and test on every push",
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Draft API schema",
      status: "Review",
      assignee: "R",
    },
  ],
  inprogress: [
    {
      id: "card-3",
      title: "Implement auth flow",
      description: "OAuth handshake plus session refresh",
      status: "Blocked",
      assignee: "M",
    },
    {
      id: "card-4",
      title: "Build dashboard layout",
      assignee: "S",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Project kickoff",
      assignee: "J",
    },
  ],
};
