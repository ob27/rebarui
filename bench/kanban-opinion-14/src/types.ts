import type { KanbanCard } from "rebar-ui";

/** A Sprint Board card — everything the real `KanbanCard` shape already covers (title,
 * description, a single status tag via `tags`), plus the one field this board needs that Kanban
 * doesn't model itself: a single-letter assignee initial. Optional so a plain `KanbanCard` (e.g.
 * one Kanban's own "+ Add card" flow creates, which only ever sets `title`) still satisfies this
 * type without a cast. */
export interface SprintCard extends KanbanCard {
  assignee?: string;
}
