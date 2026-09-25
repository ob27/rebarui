import type { KanbanColumn, KanbanState } from "rebar-ui";
import type { SprintCard } from "./types";

// "In Progress" is the one column with a soft cap — Kanban's own `column.limit` mechanism (not
// anything we reimplement) enforces it for both drag-drop and "+ Add card", and renders the
// "n/limit" badge next to the column title automatically.
const IN_PROGRESS_LIMIT = 4;

const cards: Record<string, SprintCard> = {
  "card-empty-states": {
    id: "card-empty-states",
    title: "Design empty states",
    assignee: "A",
  },
  "card-onboarding-copy": {
    id: "card-onboarding-copy",
    title: "Write onboarding copy",
    description: "Draft first-run copy for the product tour",
    assignee: "J",
  },
  "card-auth-refactor": {
    id: "card-auth-refactor",
    title: "Refactor auth middleware",
    description: "Blocked on infra ticket #482",
    tags: ["Blocked"],
    assignee: "K",
  },
  "card-drag-polish": {
    id: "card-drag-polish",
    title: "Board drag-and-drop polish",
    assignee: "T",
  },
  "card-ci-pipeline": {
    id: "card-ci-pipeline",
    title: "Set up CI pipeline",
    description: "Lint, typecheck, and test on every push",
    tags: ["Review"],
    assignee: "M",
  },
};

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-section", cardIds: ["card-empty-states", "card-onboarding-copy"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    limit: IN_PROGRESS_LIMIT,
    sections: [{ id: "in-progress-section", cardIds: ["card-auth-refactor", "card-drag-polish"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-section", cardIds: ["card-ci-pipeline"] }],
  },
];

export const initialBoard: KanbanState = { columns, cards };
