import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardItem } from "./CardItem";
import type { CardData, ColumnId } from "./types";

interface SortableCardProps {
  card: CardData;
  columnId: ColumnId;
}

/** Wires a `CardItem` up to dnd-kit's sortable preset: draggable within its own
 * column and droppable-over for cross-column moves. `data.columnId` is how
 * `App`'s drag handlers know which column a card currently lives in without a
 * separate lookup table. */
export function SortableCard({ card, columnId }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { columnId, card },
  });

  return (
    <CardItem
      ref={setNodeRef}
      card={card}
      dragHandleProps={{ ...attributes, ...listeners }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    />
  );
}
