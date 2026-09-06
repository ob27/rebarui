"use client";

import type { Block } from "@rebar-ui/placement";
import corePackageJson from "../../../../packages/core/package.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "site-header",
    logo: { label: "Rebar UI", href: "/", iconSrc: "/rebar-icon.svg" },
    items: [
      { href: "/docs", label: "Docs" },
      { href: "/components", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/about", label: "About" },
    ],
    ariaLabel: "Main",
    trailing: { kind: "text", text: `v${corePackageJson.version}` },
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
