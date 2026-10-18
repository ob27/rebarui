import type { Tier } from "@/data/tier.types";
import type { ExampleMap } from "./tierExamples.types";
import { IMITATION_EXAMPLES } from "./tierExamples.imitation";
import { ORDER_EXAMPLES } from "./tierExamples.order";
import { SYNTHETIC_A } from "./tierExamples.synthetic.a";
import { SYNTHETIC_B } from "./tierExamples.synthetic.b";
import { OPINION_A } from "./tierExamples.opinion.a";
import { OPINION_B } from "./tierExamples.opinion.b";

/**
 * Every tier cover page's live gallery: construct label (as `tierDocsShellSections` spells it) to a small real example.
 * A construct with no entry renders a plain card (name, category, Docs link); `node apps/docs/scripts/check-tier-examples.mjs`
 * lists which those are. Split by tier and alphabet so each file stays readable.
 */
export const TIER_EXAMPLES: Record<Tier, ExampleMap> = {
  imitation: IMITATION_EXAMPLES,
  synthetic: { ...SYNTHETIC_A, ...SYNTHETIC_B },
  opinion: { ...OPINION_A, ...OPINION_B },
  order: ORDER_EXAMPLES,
  genesis: {},
};
