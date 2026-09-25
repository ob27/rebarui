export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, shown in a small round avatar. Omitted (no avatar shown) for
   * a card created via the "+ Add card" control, which only captures a title. */
  assignee?: string;
}

export type Board = Record<ColumnId, CardData[]>;

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Soft cap on card count — undefined means uncapped. */
  cap?: number;
}

export const COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];
