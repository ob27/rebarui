import { Avatar, Card } from "rebar-ui";
import type { KanbanCardRenderContext } from "rebar-ui";
import type { SprintCard } from "./types";

/** Custom card face for the Sprint Board — swaps in over Kanban's own built-in `Card` rendering
 * (via `renderCard`) only to add the assignee avatar, which `Kanban` has no slot for on its
 * default card. Everything else it needs (title, one-line description, a status tag) is already
 * exactly what the real `Card` component's own `title`/`children`/`labels` props render — this is
 * customization of that existing shape, not a rebuild of it. Drag/touch wiring comes straight from
 * `ctx`, unchanged, same as Kanban's own built-in card uses. */
export function renderBoardCard(card: SprintCard, ctx: KanbanCardRenderContext) {
  const statusTag = card.tags?.[0];
  return (
    <Card
      data-rebar-part="card"
      title={card.title}
      avatar={card.assignee ? <Avatar fallback={card.assignee} size="sm" /> : undefined}
      labels={statusTag ? [{ label: statusTag, tone: statusTag === "Blocked" ? "error" : "info" }] : undefined}
      {...ctx.dragHandlers}
      {...ctx.touchHandlers}
    >
      {card.description}
    </Card>
  );
}
