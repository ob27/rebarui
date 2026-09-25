import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CardItem from "./CardItem";
import AddCardControl from "./AddCardControl";
import type { CardData, ColumnMeta } from "./types";

interface ColumnProps {
  meta: ColumnMeta;
  cards: CardData[];
  visibleIds: Set<string>;
  atCap: boolean;
  onAddCard: (title: string) => void;
}

export default function Column({ meta, cards, visibleIds, atCap, onAddCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: meta.id });

  const countLabel = meta.cap ? `${cards.length}/${meta.cap}` : `${cards.length}`;

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        background: isOver ? "rgba(0,0,0,0.03)" : "transparent",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        minHeight: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        <span>{meta.title}</span>
        <span style={{ color: "rgba(0,0,0,0.45)", fontWeight: 400, fontSize: 13 }}>{countLabel}</span>
      </div>

      <div ref={setNodeRef} style={{ flex: 1, minHeight: 40 }}>
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} hidden={!visibleIds.has(card.id)} />
          ))}
        </SortableContext>
      </div>

      <AddCardControl disabled={atCap} onAdd={onAddCard} />
    </div>
  );
}
