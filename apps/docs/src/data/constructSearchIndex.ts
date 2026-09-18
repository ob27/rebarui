import type { ConstructSearchResult } from "rebar-ui";
import type { Tier } from "./tier.types";
import { TIER_LABEL, TIER_ROUTE, tierDocsShellSections } from "./tierSections";

const TIERS: Tier[] = ["imitation", "synthetic", "opinion", "order", "genesis"];

/**
 * Every named construct across every tier, as `ConstructSearch` results — built directly from
 * each tier's own `DocsShellSection` list (`tierDocsShellSections`) rather than re-deriving the
 * component/block join a second time, so this index can never disagree with what a tier's own
 * sidebar already shows. Drops each tier's own leading "All <Tier>" entry and any construct with no
 * real reference page (both share the tier's own route as their `href` — nothing worth searching
 * *to* at that point, since it's indistinguishable from just visiting the tier index directly).
 */
export const CONSTRUCT_SEARCH_INDEX: ConstructSearchResult[] = TIERS.flatMap((tier) =>
  tierDocsShellSections(tier)
    .filter((section) => section.href !== TIER_ROUTE[tier])
    .map((section) => ({ name: section.label, group: TIER_LABEL[tier], href: section.href })),
);
