import { TierCatalogPage } from "@/components/TierCatalogPage";

export default function ImitationsPage() {
  return (
    <TierCatalogPage
      tier="imitation"
      title="Imitations"
      description="Static, standalone primitives — no composition of other named components, no real state machine beyond mirroring one caller-controlled value for the controlled/uncontrolled convention (see packages/core/robot.md). A block is always at least a fixed composition of components, so this tier is components-only — see /tiers for how this relates to Synthetics, Opinions, and Orders."
    />
  );
}
