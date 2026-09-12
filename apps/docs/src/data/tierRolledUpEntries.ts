/**
 * Manual overrides/additions for components that span two tiers depending on configuration (see
 * ref/TIERS.md's "Rolled-up cases"). Of the six cases the plan for this considered, only `Card`
 * genuinely needs two catalog rows over one artifact — everything else already has real,
 * separately-named artifacts and needs cross-referencing, not a second row here.
 *
 * `tierCatalog.ts` splices these in, replacing the single auto-generated "Card" row with both of
 * these.
 */
import type { TierCatalogEntry } from "./tierCatalog.types";

export const TIER_ROLLED_UP_ENTRIES: TierCatalogEntry[] = [
  {
    slug: "card-default",
    label: "Card",
    kind: "component",
    tier: "synthetic",
    sourceName: "Card",
    href: "/components/card",
    description: "A static slot composition (cover/avatar/title/labels/footer) — no state of its own.",
    status: "shipped",
    rolledUpNote:
      "One export, two tiers depending on config: plain Card is a Synthetic; editable Card (below) is an Opinion. Not split into two components — editable is a prop-level variant, not a different interaction pattern.",
  },
  {
    slug: "card-editable",
    label: "Card (editable)",
    kind: "component",
    tier: "opinion",
    sourceName: "Card",
    href: "/components/card#editable",
    description: "The same Card, with editable set — grafts real click-to-edit state via Editable.",
    status: "shipped",
    rolledUpNote:
      "Same underlying export as the plain Card row above — editable is a configuration, not a second component.",
  },
];

/** Every auto-generated row whose `sourceName` appears here gets removed before these are spliced
 * in, so a plain, un-configured "Card" entry never appears twice. */
export const ROLLED_UP_SOURCE_NAMES = new Set(TIER_ROLLED_UP_ENTRIES.map((e) => e.sourceName));
