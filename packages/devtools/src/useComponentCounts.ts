import { useEffect, useState } from "react";

export interface ComponentCounts {
  total: number;
  byType: Record<string, number>;
}

const EMPTY: ComponentCounts = { total: 0, byType: {} };

function scan(): ComponentCounts {
  const nodes = document.querySelectorAll<HTMLElement>("[data-rebar-component]");
  const byType: Record<string, number> = {};

  nodes.forEach((node) => {
    const type = node.getAttribute("data-rebar-component");
    if (!type || type.startsWith("devtools")) return;
    byType[type] = (byType[type] ?? 0) + 1;
  });

  const total = Object.values(byType).reduce((sum, count) => sum + count, 0);
  return { total, byType };
}

/**
 * Real, computed counts of rebar-ui components currently mounted in the document —
 * found by querying data-rebar-component, not tracked via app-level instrumentation.
 * Only scans while `enabled` (the panel is open) so it costs nothing the rest of the time.
 */
export function useComponentCounts(enabled: boolean): ComponentCounts {
  const [counts, setCounts] = useState<ComponentCounts>(EMPTY);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const update = () => setCounts(scan());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-rebar-component"],
    });

    return () => observer.disconnect();
  }, [enabled]);

  return counts;
}
