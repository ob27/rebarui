"use client";

import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { REBAR_MARK_PATH, REBAR_MARK_VIEWBOX } from "@/data/rebarMark";

const BLOCKS: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Rebar UI", href: "/", iconPath: REBAR_MARK_PATH, iconViewBox: REBAR_MARK_VIEWBOX },
    items: [
      {
        href: "/imitations",
        label: "Framework",
        megaMenu: {
          columns: [
            {
              heading: "Imitations",
              items: [
                { label: "Button", description: "Real <button> element", href: "/imitations/button" },
                { label: "Input", description: "Text input field", href: "/imitations/input" },
                { label: "Checkbox", description: "Toggle control", href: "/imitations/checkbox" },
                { label: "Badge", description: "Status indicator", href: "/imitations/badge" },
                { label: "Skeleton", description: "Loading placeholder", href: "/imitations/skeleton" },
              ],
            },
            {
              heading: "Synthetics",
              items: [
                { label: "Hero", description: "Page-top banner", href: "/synthetics/hero" },
                { label: "Card Grid", description: "Wrapping card layout", href: "/synthetics/card-grid" },
                { label: "Checklist", description: "Static item list", href: "/synthetics/checklist" },
                { label: "Callout", description: "Bordered notice card", href: "/synthetics/callout" },
                { label: "Feature Grid", description: "Title+body pairs", href: "/synthetics/feature-grid" },
              ],
            },
            {
              heading: "Opinions",
              items: [
                { label: "Table", description: "Sortable data table", href: "/opinions/table" },
                { label: "Dialog", description: "Modal dialog", href: "/opinions/dialog" },
                { label: "Accordion", description: "Collapsible sections", href: "/opinions/accordion" },
                { label: "Combobox", description: "Type-to-filter select", href: "/opinions/combobox" },
                { label: "Calendar", description: "Date picker", href: "/opinions/calendar" },
              ],
            },
            {
              heading: "Archetypes",
              items: [
                { label: "The Button", description: "Lever to digital", href: "/archetypes/the-button" },
              ],
            },
          ],
          footer: { label: "Browse all constructs", href: "/imitations" },
        },
      },
      { href: "/orders", label: "Orders" },
      { href: "/geneses", label: "Geneses" },
      { href: "/about", label: "About" },
    ],
    ariaLabel: "Main",
    trailing: { kind: "text", text: "0.10.0" },
    themeToggle: true,
  },
];

export function SiteHeader() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
