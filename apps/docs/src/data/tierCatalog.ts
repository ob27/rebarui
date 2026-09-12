/**
 * The full tier catalog: every shipped component and every block, each tagged with its tier (see
 * ref/TIERS.md). Generated from the same sources `/components` and `/blocks` already use
 * (`component-props.json`, `HAS_FULL_PAGE`, the real `Block["type"]` union) plus the one genuine
 * "rolled up" case (`Card`, see `tierRolledUpEntries.ts`) spliced in over the auto-generated row.
 */
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { HAS_FULL_PAGE } from "./hasFullPage";
import { componentTier } from "./componentTier";
import { BLOCK_TIER, blockTier } from "./blockTier";
import { ROLLED_UP_SOURCE_NAMES, TIER_ROLLED_UP_ENTRIES } from "./tierRolledUpEntries";
import type { TierCatalogEntry } from "./tierCatalog.types";

// `componentTier` throws on any unclassified name (see componentTier.ts), and the `.map()` below
// calls it for every real shipped component eagerly, at module load — since this module is
// imported by every one of the four tier catalog pages, `next build`'s prerender step already
// exercises that check for real, so a coverage gap fails the build. The block-side equivalent
// (blockTier.ts's "opinion" entries matching @rebar-ui/placement's real OpinionBlockType) is a
// compile-time-only check instead — see blockTier.ts's own doc comment for why.

function slugifyName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const componentEntries: TierCatalogEntry[] = Object.keys(componentProps)
  .filter((name) => !ROLLED_UP_SOURCE_NAMES.has(name))
  .sort()
  .map((name) => ({
    slug: `component-${slugifyName(name)}`,
    label: name,
    kind: "component",
    tier: componentTier(name),
    sourceName: name,
    href: HAS_FULL_PAGE[name],
    description: "",
    status: "shipped",
  }));

const blockEntries: TierCatalogEntry[] = (Object.keys(BLOCK_TIER) as Block["type"][])
  .sort()
  .map((type) => ({
    slug: `block-${type}`,
    label: type,
    kind: "block",
    tier: blockTier(type),
    sourceName: type,
    href: `/blocks#${type}`,
    description: "",
    status: "shipped",
  }));

export const TIER_CATALOG: TierCatalogEntry[] = [
  ...componentEntries,
  ...blockEntries,
  ...TIER_ROLLED_UP_ENTRIES,
];

export function tierCatalogFor(tier: TierCatalogEntry["tier"]): {
  components: TierCatalogEntry[];
  blocks: TierCatalogEntry[];
} {
  const entries = TIER_CATALOG.filter((e) => e.tier === tier);
  return {
    components: entries.filter((e) => e.kind === "component"),
    blocks: entries.filter((e) => e.kind === "block"),
  };
}

/** Shared `card-grid` item shape for every tier page — one card per catalog entry, linking out to
 * its real reference page (a component) or its entry on `/blocks` (a block), with the rolled-up
 * note (if any) folded into the body so the Card/editable split is visible without a second click. */
export function tierEntriesToCardGridItems(entries: TierCatalogEntry[]) {
  return entries.map((entry) => ({
    title: entry.label,
    body: entry.rolledUpNote,
    href: entry.href,
    linkLabel: entry.href ? "View →" : undefined,
    tags: entry.status !== "shipped" ? [{ label: entry.status, tone: "warning" as const }] : undefined,
  }));
}
