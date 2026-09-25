// Static shell only — composed from Synthetic-tier `Card`/`Tag`/`Avatar`. All drag behavior is
// wired up by the caller (Column/App) via the pointer handler props; this component itself holds
// no state and knows nothing about drag-and-drop mechanics.

import type { PointerEvent as ReactPointerEvent } from "react";
import { Avatar, Card, Tag } from "rebar-ui";
import type { CardData } from "./types";

export interface KanbanCardProps {
  card: CardData;
  /** True while this exact card is the one currently being dragged — dims it in place while a
   * floating ghost (rendered separately by App) follows the pointer. */
  isDragging: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

export function KanbanCard({ card, isDragging, onPointerDown, onPointerMove, onPointerUp }: KanbanCardProps) {
  return (
    <div
      data-card-id={card.id}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        opacity: isDragging ? 0.35 : 1,
        // Bypasses hit-testing for this element while it's the drag source, so
        // document.elementFromPoint() (used to find the drop target) sees whatever is
        // underneath instead of this card itself. Pointer capture (set on pointerdown) keeps
        // move/up events routed here regardless of this style.
        pointerEvents: isDragging ? "none" : "auto",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <Card
        title={card.title}
        titleLines={2}
        labels={
          card.status
            ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "info" }]
            : undefined
        }
        footer={<Avatar fallback={card.assignee} size="sm" />}
      >
        {card.description}
      </Card>
    </div>
  );
}
