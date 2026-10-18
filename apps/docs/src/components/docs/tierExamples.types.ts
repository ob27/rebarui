import type { ReactNode } from "react";

/** One construct's live example on its tier's cover page. */
export interface ExampleSpec {
  /** The real component(s), fed from the Tideline fixtures. Must render without any prop the reader has to supply. */
  node: ReactNode;
  /** Span the full row of the gallery instead of one column. For examples that need width: tables, boards, shells. */
  wide?: boolean;
}

/** Construct label (exactly as `tierDocsShellSections` spells it, e.g. "Button", "Card Grid") to its example. */
export type ExampleMap = Record<string, ExampleSpec>;

export const ex = (node: ReactNode, opts: { wide?: boolean } = {}): ExampleSpec => ({ node, ...opts });
