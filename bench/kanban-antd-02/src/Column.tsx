import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Empty, Flex, Typography } from "antd";
import AddCardForm from "./AddCardForm";
import CardItem from "./CardItem";
import { columnDroppableId, type ColumnId, type KanbanCard } from "./types";

const { Text } = Typography;

interface ColumnProps {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
  /** Set of card ids currently matching the search query (all ids when there's no query). */
  matchingIds: Set<string>;
  cap?: number;
  onAddCard: (title: string) => void;
}

export default function Column({ id, title, cards, matchingIds, cap, onAddCard }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: columnDroppableId(id) });
  const atCap = cap !== undefined && cards.length >= cap;
  const visibleCount = cards.filter((c) => matchingIds.has(c.id)).length;
  const noVisibleCards = visibleCount === 0;

  return (
    <Flex
      vertical
      gap={8}
      style={{
        background: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        width: 300,
        flexShrink: 0,
        maxHeight: "100%",
      }}
    >
      <Flex justify="space-between" align="center">
        <Text strong>{title}</Text>
        <Text type={atCap ? "danger" : "secondary"}>
          {cap !== undefined ? `${cards.length}/${cap}` : cards.length}
        </Text>
      </Flex>

      <div ref={setNodeRef} style={{ flex: 1, minHeight: 40, overflowY: "auto" }}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} hidden={!matchingIds.has(card.id)} />
          ))}
        </SortableContext>
        {noVisibleCards ? (
          <Empty
            description={cards.length === 0 ? "No cards" : "No matches"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: "12px 0" }}
          />
        ) : null}
      </div>

      <AddCardForm disabled={atCap} onAdd={onAddCard} />
    </Flex>
  );
}
