import type { CardData, ColumnDef, ColumnId } from "./types";

let idCounter = 0;
export function nextId(): string {
  idCounter += 1;
  return `card-${idCounter}`;
}

export const COLUMN_DEFS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export function seedCards(): Record<ColumnId, CardData[]> {
  return {
    todo: [
      {
        id: nextId(),
        title: "Design onboarding flow",
        description: "Wireframe the first-run experience",
        assignee: "A",
      },
      { id: nextId(), title: "Set up CI pipeline", assignee: "T" },
    ],
    inProgress: [
      {
        id: nextId(),
        title: "Fix payment webhook retries",
        description: "Idempotency keys keep colliding",
        status: "Blocked",
        assignee: "M",
      },
      { id: nextId(), title: "Write API docs for v2 endpoints", assignee: "J" },
    ],
    done: [{ id: nextId(), title: "Migrate database to Postgres 16", assignee: "R" }],
  };
}
