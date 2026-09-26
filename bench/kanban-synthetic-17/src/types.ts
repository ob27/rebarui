export type ColumnId = "todo" | "in-progress" | "done";

export type StatusTag = "Blocked" | "Review" | null;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status: StatusTag;
  assignee: string; // single-letter initial
}

export interface ColumnData {
  id: ColumnId;
  title: string;
  cap?: number;
}

export const COLUMNS: ColumnData[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const SEED_CARDS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Add lint + test workflow",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Design onboarding flow",
      description: "First-run experience for new users",
      status: null,
      assignee: "M",
    },
  ],
  "in-progress": [
    {
      id: "card-3",
      title: "Fix login redirect bug",
      description: "Users land on 404 after SSO",
      status: "Blocked",
      assignee: "J",
    },
    {
      id: "card-4",
      title: "Write API docs",
      status: null,
      assignee: "S",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Migrate database schema",
      description: "Add index on user_id",
      status: null,
      assignee: "T",
    },
  ],
};
