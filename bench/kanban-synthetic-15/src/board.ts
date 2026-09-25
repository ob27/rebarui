import type { CardData, ColumnData, ColumnId } from "./types";

/** Moves (or reorders) a card. Returns the same `columns` reference if the move is a no-op or
 * rejected (cap exceeded, dropped onto itself), so callers can skip a re-render. */
export function moveCard(
  columns: ColumnData[],
  cardId: string,
  sourceColumnId: ColumnId,
  destColumnId: ColumnId,
  overCardId: string | null,
  position: "before" | "after",
): ColumnData[] {
  if (overCardId === cardId) return columns;

  const source = columns.find((c) => c.id === sourceColumnId);
  const dest = columns.find((c) => c.id === destColumnId);
  if (!source || !dest) return columns;

  const cardIndex = source.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return columns;
  const card = source.cards[cardIndex];

  const crossColumn = sourceColumnId !== destColumnId;
  if (crossColumn && dest.cap && dest.cards.length >= dest.cap) {
    return columns; // reject: destination is at its soft cap
  }

  const sourceCardsWithout = source.cards.filter((c) => c.id !== cardId);
  let destCards = crossColumn ? dest.cards.slice() : sourceCardsWithout;

  let insertAt = destCards.length;
  if (overCardId) {
    const overIndex = destCards.findIndex((c) => c.id === overCardId);
    if (overIndex !== -1) {
      insertAt = position === "before" ? overIndex : overIndex + 1;
    }
  }
  destCards = [...destCards.slice(0, insertAt), card, ...destCards.slice(insertAt)];

  return columns.map((c) => {
    if (crossColumn) {
      if (c.id === sourceColumnId) return { ...c, cards: sourceCardsWithout };
      if (c.id === destColumnId) return { ...c, cards: destCards };
      return c;
    }
    if (c.id === destColumnId) return { ...c, cards: destCards };
    return c;
  });
}

export function addCard(columns: ColumnData[], columnId: ColumnId, title: string): ColumnData[] {
  return columns.map((c) => {
    if (c.id !== columnId) return c;
    if (c.cap && c.cards.length >= c.cap) return c; // reject: at cap
    const newCard: CardData = {
      id: crypto.randomUUID(),
      title,
      assignee: "?",
    };
    return { ...c, cards: [newCard, ...c.cards] };
  });
}

export function matchesSearch(card: CardData, query: string): boolean {
  if (!query.trim()) return true;
  return card.title.toLowerCase().includes(query.trim().toLowerCase());
}
