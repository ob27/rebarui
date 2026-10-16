import { Avatar, ConstructSearch, Heading, Stack, Text } from "rebar-ui";
import type { ConstructSearchResult } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";

const CODE = `<ConstructSearch results={everyConstruct} placeholder="Search constructs..." maxResults={6} />`;

const RESULTS: ConstructSearchResult[] = [
  { name: "Kanban", group: "Opinions", href: "/opinions/kanban" },
  { name: "Card Kanban", group: "Opinions", href: "/opinions/card-kanban" },
  { name: "Calendar", group: "Opinions", href: "/opinions/calendar" },
  { name: "CalendarHeatmap", group: "Opinions", href: "/opinions/calendar-heatmap" },
  { name: "Card", group: "Synthetics", href: "/synthetics/card" },
  { name: "Steps", group: "Synthetics", href: "/synthetics/steps" },
  { name: "Combobox", group: "Opinions", href: "/opinions/combobox" },
  { name: "CommandPalette", group: "Opinions", href: "/opinions/command-palette" },
  { name: "NavBar", group: "Orders", href: "/orders/nav-bar" },
  { name: "MegaMenu", group: "Orders", href: "/orders/mega-menu" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ConstructSearch"] ?? [] },
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
      <Text color="secondary">A type-ahead search whose results are real links. Try typing &quot;ca&quot;.</Text>

      <DemoStage
        title="Search the library"
        caption="Opens once there is a query; grouped by tier"
        code={CODE}
        widths={false}
        states={[
          { label: "Three results at most", node: <div><ConstructSearch results={RESULTS} maxResults={3} placeholder="Top three only" aria-label="Limited search" /></div> },
          { label: "Custom placeholder", node: <div><ConstructSearch results={RESULTS} placeholder="Find a component" aria-label="Custom search" /></div> },
          { label: "No results to search", node: <div><ConstructSearch results={[]} placeholder="Nothing indexed" aria-label="Empty search" /></div> },
        ]}
      >
        <div style={{ maxWidth: 360 }}>
          <ConstructSearch results={RESULTS} aria-label="Search constructs" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Docs header" caption="The same field in a site header" widths={false}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", border: "1px solid var(--rebar-color-border)", borderRadius: 12, background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" }}>
          <span style={{ fontFamily: "var(--rebar-font-family-display)", fontWeight: 600, fontSize: 18 }}>Tideline docs</span>
          <span style={{ flex: 1, maxWidth: 380 }}>
            <ConstructSearch results={RESULTS} aria-label="Search the docs" placeholder="Search…" />
          </span>
          <span style={{ flex: 1 }} />
          <Avatar {...avatarOf("maya")} />
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
