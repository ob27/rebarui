import type { CardData, ColumnId, ColumnMeta } from "./types";

export const COLUMN_META: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

export const SEED_COLUMNS: Record<ColumnId, CardData[]> = {
  todo: [
    {
      id: "t1",
      title: "Design empty states",
      description: "Cover zero-data and error variants for the board",
      assignee: "R",
    },
    {
      id: "t2",
      title: "Write onboarding copy",
      assignee: "M",
    },
  ],
  inProgress: [
    {
      id: "p1",
      title: "Kanban drag-and-drop",
      description: "Reorder within a column and move across columns",
      status: "Blocked",
      assignee: "T",
    },
    {
      id: "p2",
      title: "Search filter for board",
      assignee: "S",
    },
  ],
  done: [
    {
      id: "d1",
      title: "Set up CI pipeline",
      assignee: "J",
    },
  ],
};

/** Case-insensitive substring match against a card's title. An empty/whitespace-only search
 * matches everything. */
export function matchesSearch(card: CardData, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return card.title.toLowerCase().includes(needle);
}

let nextId = 1000;

/** Monotonically increasing id for cards added at runtime — seed cards use their own short ids
 * (`t1`, `p1`, ...), so starting well above that range keeps them from ever colliding. */
export function createCardId(): string {
  nextId += 1;
  return `c${nextId}`;
}
