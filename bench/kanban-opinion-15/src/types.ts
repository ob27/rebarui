import type { KanbanCard } from "rebar-ui";

/**
 * The spec's card shape layered on top of `KanbanCard` — an assignee initial and an optional
 * lifecycle-status tag, alongside the id/title/description `KanbanCard` already provides.
 * `Record<string, SprintCard>` is still assignable to `Kanban`'s `cards: Record<string,
 * KanbanCard>` prop since every `SprintCard` is-a `KanbanCard`.
 */
export interface SprintCard extends KanbanCard {
  /** A single letter, rendered in a small round `Avatar`. */
  assignee: string;
  /** The one lifecycle-status tag a card may carry — omit entirely for "no tag at all". */
  status?: "Blocked" | "Review";
}
