/**
 * The mechanical "is this block an Opinion?" test (see ref/TIERS.md — the four-tier
 * Imitation/Synthetic/Opinion/Order classification). A block counts as an Opinion iff its own
 * schema variant declares a `source` field or an `on<Verb>` handler field — computed directly off
 * `Block`'s own shape in schema.ts, not a hand-maintained list that can drift out of sync with it.
 */
import type { Block } from "./schema";

type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;
type LiveKey<B> = Extract<keyof B, "source" | `on${string}`>;

/** Every `Block["type"]` string whose own variant declares at least one live binding field. */
export type OpinionBlockType = {
  [T in Block["type"]]: LiveKey<BlockOf<T>> extends never ? never : T;
}[Block["type"]];

/** Runtime mirror of `OpinionBlockType`, for callers that need an actual array/set rather than a
 * type (e.g. the docs site's tier catalog). Kept honest by the exhaustiveness check below — this
 * file fails to compile if it ever drifts out of sync with `OpinionBlockType`. */
export const OPINION_BLOCK_TYPES = [
  "ai-chat",
  "table",
  "form",
  "goal-tracker",
  "card-kanban",
  "sticky-kanban",
  "wizard",
  "scatter-chart",
  "line-chart",
  "stacked-bar-chart",
] as const satisfies readonly OpinionBlockType[];

// Compile-time exhaustiveness check: if `OpinionBlockType` ever includes a type string missing
// from the array above (a `source`/`onX` field added to some other block variant without updating
// this file), `Exclude<...>` becomes non-`never` and this assignment fails to type-check — a build
// break, not a silent drift.
type _AssertOpinionListExhaustive = Exclude<OpinionBlockType, (typeof OPINION_BLOCK_TYPES)[number]> extends never
  ? true
  : never;
const _opinionListExhaustive: _AssertOpinionListExhaustive = true;
void _opinionListExhaustive;

export function isOpinionBlockType(type: Block["type"]): type is OpinionBlockType {
  return (OPINION_BLOCK_TYPES as readonly string[]).includes(type);
}
