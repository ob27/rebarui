export type ColumnId = "todo" | "inprogress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial shown in the avatar. */
  assignee: string;
}

export type BoardState = Record<ColumnId, CardData[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inprogress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

/** Soft caps — only "In Progress" has one. Absence of an entry means uncapped. */
export const COLUMN_CAPS: Partial<Record<ColumnId, number>> = {
  inprogress: 4,
};
