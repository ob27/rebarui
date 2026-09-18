"use client";

import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { REBAR_MARK_PATH, REBAR_MARK_VIEWBOX } from "@/data/rebarMark";
import { CONSTRUCT_SEARCH_INDEX } from "@/data/constructSearchIndex";

const BLOCKS: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Rebar UI", href: "/", iconPath: REBAR_MARK_PATH, iconViewBox: REBAR_MARK_VIEWBOX },
    items: [
      { href: "/about/agent", label: "For Agents" },
      {
        href: "/orders",
        label: "Construct Library",
        megaMenu: {
          columns: [
            {
              heading: "",
              items: [
                { label: "Orders", description: "Pick your Plenum", href: "/orders" },
                { label: "Archetypes", description: "Construct studies", href: "/archetypes" },
                { label: "Imitations", description: "Primitive Constructs", href: "/imitations" },
              ],
            },
            {
              heading: "",
              items: [
                { label: "Synthetics", description: "Complex Constructs", href: "/synthetics" },
                { label: "Opinions", description: "Dynamic Constructs", href: "/opinions" },
                { label: "Geneses", description: "Rebar alive", href: "/geneses" },
              ],
            },
          ],
          footer: { label: "Go to the GitHub Repo", href: "https://github.com/ob27/rebarui" },
        },
      },
      {
        href: "/heuristics",
        label: "Philosophy",
        megaMenu: {
          columns: [
            {
              heading: "",
              items: [
                { label: "Heuristics", href: "/heuristics" },
                { label: "Roadmap", href: "/planned/_none" },
                { label: "Rules", href: "/about/agent" },
                { label: "Benchmarks", href: "/about/benchmarks" },
                { label: "About", href: "/about" },
              ],
            },
          ],
        },
      },
    ],
    ariaLabel: "Main",
    trailing: { kind: "text", text: "0.10.0" },
    themeToggle: true,
    constructSearch: { source: "constructSearchIndex", placeholder: "Search constructs..." },
  },
];

export function SiteHeader() {
  return <NextBlockRenderer blocks={BLOCKS} data={{ constructSearchIndex: CONSTRUCT_SEARCH_INDEX }} />;
}
