// Types + seed data for the Sprint Board. Kept separate from the components/behavior so App.tsx
// stays focused on state + drag-and-drop wiring.

export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review" | null;

export interface SprintCard {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  assignee: string; // single-letter initial
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count, enforced on drop and add-card. `undefined` = no cap. */
  cap?: number;
}

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

let nextId = 1;
export function makeCardId(): string {
  return `card-${nextId++}`;
}

export function seedBoard(): Record<ColumnId, SprintCard[]> {
  return {
    todo: [
      {
        id: makeCardId(),
        title: "Wire up billing webhook",
        description: "Handle Stripe events for plan changes",
        status: null,
        assignee: "R",
      },
      {
        id: makeCardId(),
        title: "Draft Q3 onboarding copy",
        status: null,
        assignee: "M",
      },
    ],
    inprogress: [
      {
        id: makeCardId(),
        title: "Fix flaky checkout test",
        description: "Intermittent timeout on CI runners",
        status: "Blocked",
        assignee: "A",
      },
      {
        id: makeCardId(),
        title: "Refactor auth middleware",
        status: null,
        assignee: "J",
      },
    ],
    done: [
      {
        id: makeCardId(),
        title: "Ship dark mode toggle",
        status: "Review",
        assignee: "S",
      },
    ],
  };
}
