/**
 * Figures out where in a column's card list a drop should land, purely from DOM geometry —
 * no drag-and-drop library, per this benchmark condition's constraint.
 *
 * `container` is the column's card-list element; each card renders a `[data-card-id]` wrapper
 * directly inside it. We only consider wrappers that are actually laid out (an element hidden
 * via `display: none` — a search-filtered-out card — has a zero-size rect and would otherwise
 * corrupt the index), and we exclude the card currently being dragged (`excludeId`) since it's
 * still mounted in its source column while the drag is in progress.
 *
 * Returns an index into that *visible, excluding-dragged-card* sequence — i.e. "insert before
 * the Nth visible card", or the visible count to mean "insert at the end."
 */
export function computeDropIndex(
  container: HTMLElement,
  clientY: number,
  excludeId: string | null,
): number {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>("[data-card-id]"),
  ).filter((el) => el.dataset.cardId !== excludeId);

  const visible = candidates.filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  for (let i = 0; i < visible.length; i++) {
    const rect = visible[i].getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) return i;
  }
  return visible.length;
}
