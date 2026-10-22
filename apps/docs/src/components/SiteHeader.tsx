"use client";
import { MobileHeader } from "@/components/MobileHeader";

import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { REBAR_MARK_PATH, REBAR_MARK_VIEWBOX } from "@/data/rebarMark";
import { CONSTRUCT_SEARCH_INDEX } from "@/data/constructSearchIndex";

const BLOCKS: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Rebar UI", href: "/", iconPath: REBAR_MARK_PATH, iconViewBox: REBAR_MARK_VIEWBOX },
    items: [
      {
        href: "/opinions",
        label: "Constructs",
        megaMenu: {
          columns: [
            {
              heading: "",
              items: [
                { label: "Imitations", description: "Familiar parts", href: "/imitations" },
                { label: "Synthetics", description: "Parts combined", href: "/synthetics" },
                { label: "Opinions", description: "Our own take", href: "/opinions" },
              ],
            },
            {
              heading: "",
              items: [
                { label: "Orders", description: "Whole layouts", href: "/orders" },
                { label: "Archetypes", description: "Construct studies", href: "/archetypes" },
              ],
            },
          ],
        },
      },
      { href: "/geneses", label: "Geneses" },
      {
        href: "/about",
        label: "Docs",
        megaMenu: {
          columns: [
            {
              heading: "",
              items: [
                { label: "For agents", href: "/about/agent" },
                { label: "Heuristics", href: "/heuristics" },
                { label: "Benchmarks", href: "/about/benchmarks" },
                { label: "Roadmap", href: "/roadmap" },
                { label: "Install", href: "/about/install" },
                { label: "Version log", href: "/about/version-log" },
                { label: "About", href: "/about" },
              ],
            },
          ],
          footer: { label: "Source on GitHub", href: "https://github.com/ob27/rebarui" },
        },
      },
    ],
    ariaLabel: "Main",
    trailing: { kind: "text", text: "1.1" },
    themeToggle: { sections: ["mode", "bionic"] },
    constructSearch: { source: "constructSearchIndex", placeholder: "Search constructs" },
  },
];

// Two headers, one visible at a time (CSS switches at 900px): the full navigation block on a desktop, a logo and Menu button on a phone,
// because the block's links, search and theme controls cannot fit a narrow screen and never wrapped or collapsed.
export function SiteHeader() {
  return (
    <>
      <div className="cs-header-desktop">
        <NextBlockRenderer blocks={BLOCKS} data={{ constructSearchIndex: CONSTRUCT_SEARCH_INDEX }} />
      </div>
      <MobileHeader />
    </>
  );
}
