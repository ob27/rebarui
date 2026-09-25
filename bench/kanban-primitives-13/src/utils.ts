let counter = 0;

/** A locally-unique id, good enough for in-memory client state (no backend, no persistence). */
export function generateId(prefix = "card"): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function matchesSearch(title: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return title.toLowerCase().includes(q);
}
