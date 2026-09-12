import { TierCatalogPage } from "@/components/TierCatalogPage";

export default function SyntheticsPage() {
  return (
    <TierCatalogPage
      tier="synthetic"
      title="Synthetics"
      description="Static compositions/groupings of primitives with a unified purpose, but still no real dynamism — a fixed layout, not a state machine. Most placement-layer blocks land here: plain content shapes (hero, banner, feature-grid, stats-table, gallery, ...) with nothing bound to live data or a handler. See /tiers for how this relates to Imitations, Opinions, and Orders."
    />
  );
}
