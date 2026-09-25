import type { KanbanColumn } from "rebar-ui";
import type { SprintCard } from "./types";

/** "In Progress" soft cap — Kanban itself rejects a drag/add past this, and renders the
 * "count/cap" badge next to the column title whenever a `limit` is set. */
export const IN_PROGRESS_LIMIT = 4;

export const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-cards", cardIds: ["todo-1", "todo-2"] }],
  },
  {
    id: "in-progress",
    title: "In Progress",
    limit: IN_PROGRESS_LIMIT,
    sections: [{ id: "in-progress-cards", cardIds: ["prog-1", "prog-2"] }],
  },
  {
    id: "done",
    title: "Done",
    sections: [{ id: "done-cards", cardIds: ["done-1"] }],
  },
];

export const initialCards: Record<string, SprintCard> = {
  "todo-1": {
    id: "todo-1",
    title: "Wire up billing webhook",
    description: "Stripe -> internal ledger sync",
    assignee: "P",
  },
  "todo-2": {
    id: "todo-2",
    title: "Write release notes",
    assignee: "K",
  },
  "prog-1": {
    id: "prog-1",
    title: "Refactor auth middleware",
    description: "Blocked on infra team's token rotation",
    assignee: "N",
    status: "Blocked",
  },
  "prog-2": {
    id: "prog-2",
    title: "Sprint board polish pass",
    description: "Empty states + loading skeletons",
    assignee: "S",
    status: "Review",
  },
  "done-1": {
    id: "done-1",
    title: "Upgrade to React 19",
    assignee: "P",
  },
};
