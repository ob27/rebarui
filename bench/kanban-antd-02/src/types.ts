// Shared types for the Sprint Board (see bench/KANBAN_BENCHMARK_SPEC.md).

export type ColumnId = "todo" | "inProgress" | "done";

export type CardStatus = "Blocked" | "Review";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status?: CardStatus;
  /** Single-letter assignee initial, shown in a small round avatar. */
  assignee: string;
}

export type Board = Record<ColumnId, KanbanCard[]>;

export const COLUMN_ORDER: ColumnId[] = ["todo", "inProgress", "done"];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

/** Soft cap on the "In Progress" column — enforced on both drops and adds. */
export const IN_PROGRESS_CAP = 4;

const COLUMN_DROPPABLE_PREFIX = "col:";

/** dnd-kit droppable id for a column's own container (used when dropping into empty space). */
export function columnDroppableId(id: ColumnId): string {
  return `${COLUMN_DROPPABLE_PREFIX}${id}`;
}

/** Extracts the column id back out of a container droppable id, if that's what `overId` is. */
export function columnIdFromDroppable(overId: string): ColumnId | undefined {
  return overId.startsWith(COLUMN_DROPPABLE_PREFIX)
    ? (overId.slice(COLUMN_DROPPABLE_PREFIX.length) as ColumnId)
    : undefined;
}
