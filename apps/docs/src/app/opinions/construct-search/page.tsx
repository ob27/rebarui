"use client";

import { ConstructSearch, Heading, Stack, Text } from "rebar-ui";
import type { ConstructSearchResult } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const DEMO_RESULTS: ConstructSearchResult[] = [
  { name: "Kanban", group: "Opinions", href: "/opinions/kanban" },
  { name: "Card Kanban", group: "Opinions", href: "/opinions#card-kanban" },
  { name: "Sticky Kanban", group: "Opinions", href: "/opinions#sticky-kanban" },
  { name: "Steps", group: "Synthetics", href: "/synthetics/steps" },
  { name: "Sticky", group: "Synthetics", href: "/synthetics/sticky" },
  { name: "Card", group: "Synthetics", href: "/synthetics/card" },
  { name: "Combobox", group: "Opinions", href: "/opinions/combobox" },
  { name: "CommandPalette", group: "Opinions", href: "/opinions/command-palette" },
  { name: "NavBar", group: "Orders", href: "/orders/nav-bar" },
  { name: "MegaMenu", group: "Orders", href: "/orders/mega-menu" },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<ConstructSearch results={everyConstruct} placeholder="Search constructs..." />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ConstructSearch"] ?? [] },
  {
    type: "doc-section",
    heading: "Real links, not callbacks",
    body: [
      {
        kind: "text",
        text: "Unlike `CommandPalette` (a forced-open Cmd+K modal driving `onSelect` callbacks), this is an inline type-ahead over real navigable results — picking one means going to that construct's own reference page, not running an action. `renderLink` follows the same convention as `NavBar` and `@rebar-ui/placement`'s own `renderLink`: pass your framework's Link component for client-side routing, or leave it as the default plain `<a href>`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Progressive, not a browsable index",
    body: [
      {
        kind: "text",
        text: 'The dropdown only opens once the query is non-empty — this is a search box, not a way to browse all 260+ constructs (each tier\'s own sidebar already does that). `maxResults` (default 8) caps how many matches render per keystroke, grouped by an optional `group` label (e.g. the construct\'s tier) the same way `CommandPalette` groups commands.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Wired into site-header",
    body: [
      {
        kind: "text",
        text: 'The live search box in the top nav of every page on this site (try it now — click it above and type "kanban") is this exact component, fed the full cross-tier construct index and rendered by `@rebar-ui/placement`\'s `site-header` block via its `constructSearch` field.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="construct-search"` on the root; parts: `input`, `list`, `option`, `group-label`, `empty`.',
      },
    ],
  },
];

export default function ConstructSearchPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ConstructSearch</Heading>
      <Text color="secondary">
        A progressive, type-ahead search over every named construct across every tier — real
        navigable results, not a command palette. Try typing &quot;kan&quot; or &quot;chart&quot;
        below.
      </Text>

      <LivePreview>
        <div style={{ maxWidth: 360 }}>
          <ConstructSearch results={DEMO_RESULTS} />
        </div>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
