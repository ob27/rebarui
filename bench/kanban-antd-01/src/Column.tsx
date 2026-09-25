import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge, Typography } from "antd";
import { AddCardForm } from "./AddCardForm";
import { SortableCard } from "./SortableCard";
import type { CardData, ColumnDef } from "./types";

const { Text } = Typography;

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  /** `null` means no active search filter — every card is visible. */
  visibleIds: Set<string> | null;
  onAddCard: (title: string) => void;
}

/** One board column: header (title + true count/cap badge, regardless of the
 * active search filter), the "+ Add card" control, and the scrollable card
 * list. The column body itself is the dnd-kit droppable target — dropping
 * anywhere in it (including empty space below the last card) appends to the
 * end. */
export function Column({ def, cards, visibleIds, onAddCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: def.id, data: { columnId: def.id } });

  const capReached = def.cap != null && cards.length >= def.cap;
  const countLabel = def.cap != null ? `${cards.length}/${def.cap}` : `${cards.length}`;
  const cardIds = cards.map((c) => c.id);

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        background: isOver ? "#f0f4ff" : "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        transition: "background-color 120ms ease",
      }}
      data-testid="kanban-column"
      data-column-id={def.id}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text strong>{def.title}</Text>
        <Badge
          count={countLabel}
          color={capReached ? "#faad14" : "#8c8c8c"}
          overflowCount={9999}
          style={{ fontWeight: 500 }}
        />
      </div>

      <AddCardForm disabled={capReached} onAdd={onAddCard} />

      <div ref={setNodeRef} style={{ marginTop: 8, minHeight: 40, flex: 1 }}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <div key={card.id} style={{ display: !visibleIds || visibleIds.has(card.id) ? undefined : "none" }}>
              <SortableCard card={card} columnId={def.id} />
            </div>
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
