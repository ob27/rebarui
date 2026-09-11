"use client";

import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { REBAR_MARK_PATH, REBAR_MARK_VIEWBOX } from "@/data/rebarMark";

const BLOCKS: Block[] = [
  {
    type: "site-header",
    // iconPath (not iconSrc) — a real inline <svg fill="currentColor">, so the mark inherits the
    // ambient text color and reacts live to the light/dark toggle above; iconSrc (an <img>-loaded
    // external file) fundamentally can't, since it has no visibility into this page's own DOM/CSS.
    logo: { label: "Rebar UI", href: "/", iconPath: REBAR_MARK_PATH, iconViewBox: REBAR_MARK_VIEWBOX },
    items: [
      { href: "/docs", label: "Docs" },
      { href: "/components", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/about", label: "About" },
    ],
    ariaLabel: "Main",
    // Deliberately a literal string, not derived from packages/core/package.json's real semver
    // ("0.2.0") — the desired display wording ("0.02 Open Beta") doesn't match that format.
    trailing: { kind: "text", text: "0.02 Open Beta" },
    themeToggle: true,
  },
];

// The header's "Theme" popover and DevTools' own panel (🔧, bottom-right) both write the same
// data-rebar-theme/data-theme attributes, and each only reads the current value once, on its own
// mount — a real, known gap: changing the theme via one doesn't refresh the other's displayed
// selection until it remounts. Not resolved here; flagging it rather than hiding it.
export function SiteHeader() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
