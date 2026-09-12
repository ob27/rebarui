import { TierCatalogPage } from "@/components/TierCatalogPage";

export default function OpinionsPage() {
  return (
    <TierCatalogPage
      tier="opinion"
      title="Opinions"
      description="Real internal state — validation, morphing, multi-step flow, drag/reorder, search-and-filter, open/closed with focus management. Several components delegate their entire state machine to a wrapped Radix primitive (Select, Accordion, Tabs, Dialog, Popover, ...) and show zero own useState in their own source — they're still Opinions; you can't determine tier by grepping for state alone. For blocks, Opinion is a mechanical, compiler-checked fact: a block is an Opinion iff its schema type declares a source or onX live-data-binding field (packages/placement/src/opinions.ts), not a judgment call. See /tiers for how this relates to Imitations, Synthetics, and Orders."
    />
  );
}
