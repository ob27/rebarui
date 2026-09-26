/**
 * Figures out where in a column a dropped card should land, purely from the DOM: walk the
 * currently-rendered card elements (each tagged with `data-card-id`) inside `container`, skip the
 * one being dragged (it stays mounted the whole time — nothing here relies on removing it from
 * the DOM), and return the index of the first card whose vertical midpoint is below the pointer.
 * Dropping past every card returns the list's length (append at the end).
 */
export function computeDropIndex(
  container: HTMLElement,
  clientY: number,
  excludeCardId?: string,
): number {
  const cardEls = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]")).filter(
    (el) => el.dataset.cardId !== excludeCardId,
  );

  for (let i = 0; i < cardEls.length; i++) {
    const rect = cardEls[i].getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) return i;
  }
  return cardEls.length;
}
