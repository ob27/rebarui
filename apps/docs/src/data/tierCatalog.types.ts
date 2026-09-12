import type { Tier } from "./tier.types";

export interface TierCatalogEntry {
  /** Unique across every entry in every tier — e.g. "card-default", "card-editable". */
  slug: string;
  /** Display name shown on the catalog card, e.g. "Card (editable)". */
  label: string;
  kind: "component" | "block";
  tier: Tier;
  /** The real exported name this row documents, e.g. "Card", "nav-bar". Two rows can share one
   * sourceName (the Card rolled-up case) — that's the explicit, intended mechanism, not a bug. */
  sourceName: string;
  href?: string;
  description: string;
  /** "placeholder" is reserved for a genuine future gap once one is found — none of the six
   * originally-flagged "rolled up" cases needed it (see ref/TIERS.md's "Rolled-up cases"), but the
   * field exists so the mechanism is ready when one does. */
  status: "shipped" | "planned" | "placeholder";
  /** Set only on a row that is one of two-or-more tier rows over a single underlying artifact
   * (Card today) — a short note explaining the split, rendered as a caption on the card. */
  rolledUpNote?: string;
}
