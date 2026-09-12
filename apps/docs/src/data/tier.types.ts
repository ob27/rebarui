/**
 * The four-tier classification (see ref/TIERS.md): Imitations -> Synthetics -> Opinions -> Orders.
 * Orthogonal to the existing component/block split and to Web/Mobile/Diagram (components) /
 * Global/Web/Mobile (blocks) — every combination of tier and category is legal.
 */
export type Tier = "imitation" | "synthetic" | "opinion" | "order";

/** A block is always at least a fixed composition of components (see robot.md's own
 * component/block test) — Imitation never applies to one. */
export type BlockTier = Exclude<Tier, "imitation">;
