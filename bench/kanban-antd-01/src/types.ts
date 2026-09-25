export type ColumnId = "todo" | "in-progress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial. Omitted for cards created via the inline
   * "+ Add card" control, which only collects a title. */
  assignee?: string;
}

export interface ColumnDef {
  id: ColumnId;
  title: string;
  cap?: number;
}

export type BoardState = Record<ColumnId, CardData[]>;
