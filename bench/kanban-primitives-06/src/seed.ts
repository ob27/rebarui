import type { BoardState } from "./types";

let counter = 0;
export function nextId(): string {
  counter += 1;
  return `card-${Date.now()}-${counter}`;
}

export const INPROGRESS_CAP = 4;

export const seedBoard: BoardState = {
  todo: [
    {
      id: nextId(),
      title: "Write onboarding checklist",
      description: "Draft the first-run checklist for new workspaces",
      assignee: "M",
    },
    {
      id: nextId(),
      title: "Audit sidebar contrast",
      assignee: "J",
    },
  ],
  inprogress: [
    {
      id: nextId(),
      title: "Fix flaky drag-and-drop test",
      description: "Intermittent failure on the reorder assertion",
      status: "Blocked",
      assignee: "K",
    },
    {
      id: nextId(),
      title: "Migrate settings page to new layout",
      status: "Review",
      assignee: "P",
    },
  ],
  done: [
    {
      id: nextId(),
      title: "Set up CI for the docs site",
      assignee: "T",
    },
  ],
};
