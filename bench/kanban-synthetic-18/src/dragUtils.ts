/**
 * Computes the insertion index for a drop, among the cards currently rendered in `container`
 * (excluding the card being dragged, identified by `excludeId` via its `data-card-id` attribute).
 * Compares the pointer's Y position against each candidate card's vertical midpoint so a drop
 * above a card's midpoint inserts before it, and below inserts after — the classic reorder-by-drag
 * approach. The returned index is relative to the "other cards" list, so it can be spliced
 * directly into a column array that has already had the dragged card removed from it.
 */
export function computeDropIndex(container: HTMLElement, clientY: number, excludeId: string): number {
  const cardEls = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]")).filter(
    (el) => el.dataset.cardId !== excludeId,
  );

  for (let i = 0; i < cardEls.length; i++) {
    const rect = cardEls[i].getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) {
      return i;
    }
  }
  return cardEls.length;
}
