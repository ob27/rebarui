import { Avatar, Card } from "rebar-ui";
import type { KanbanCard, KanbanCardRenderContext } from "rebar-ui";
import type { SprintCard } from "./types";

/**
 * `Kanban`'s `renderCard` replacement — swaps in the spec's exact card face (title, optional
 * one-line description, optional lifecycle-status tag, single-letter assignee avatar) while
 * leaving column/section layout, drag-and-drop, limits, sort, and search filtering to `Kanban`
 * itself. `ctx.dragHandlers`/`ctx.touchHandlers` are spread onto the rendered `Card` so mouse drag
 * and the touch drag/long-press-to-edit parity both keep working exactly as they would on
 * Kanban's own built-in card.
 */
export function renderSprintCard(card: KanbanCard, ctx: KanbanCardRenderContext) {
  const sprintCard = card as SprintCard;
  const tone: "error" | "info" = sprintCard.status === "Blocked" ? "error" : "info";
  const labels = sprintCard.status ? [{ label: sprintCard.status, tone }] : undefined;

  return (
    <Card
      data-rebar-part="card"
      title={sprintCard.title}
      labels={labels}
      footer={<Avatar fallback={sprintCard.assignee} size="sm" />}
      {...ctx.dragHandlers}
      {...ctx.touchHandlers}
    >
      {sprintCard.description}
    </Card>
  );
}
