import { TierCatalogPage } from "@/components/TierCatalogPage";

export default function OrdersPage() {
  return (
    <TierCatalogPage
      tier="order"
      title="Orders"
      description="Macro/page-level structural governance — components and blocks that arrange other things at a page or app scale (nav bars, sidebars, tab strips that swap whole panels, page-level overlay/panel systems, page indexes) rather than carrying their own data-shaped state. Read literally, Order looks like a fourth rung of the same Imitation→Synthetic→Opinion complexity ladder; it isn't — it's a different axis (macro governance vs. behavioral complexity), which is why it covers only ~8 of the 39 blocks rather than the whole placement layer. See ref/ARCHITECTURE.md and /tiers for the full nuance."
    />
  );
}
