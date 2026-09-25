import type { CardData, ColumnId } from "./types";

export const initialColumns: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "card-1",
      title: "Set up CI pipeline",
      description: "Lint, typecheck, and test on every PR",
      status: null,
      assignee: "T",
    },
    {
      id: "card-2",
      title: "Draft onboarding email copy",
      status: null,
      assignee: "M",
    },
  ],
  inprogress: [
    {
      id: "card-3",
      title: "Sprint board drag-and-drop",
      description: "Cross-column move + reorder within a column",
      status: "Blocked",
      assignee: "A",
    },
    {
      id: "card-4",
      title: "Search filter across columns",
      status: "Review",
      assignee: "T",
    },
  ],
  done: [
    {
      id: "card-5",
      title: "Project kickoff",
      description: "Aligned on scope and timeline with stakeholders",
      status: null,
      assignee: "M",
    },
  ],
};

let nextId = 6;
export function makeCardId(): string {
  return `card-${nextId++}`;
}
