import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CONSTRUCT_SEARCH_INDEX } from "@/data/constructSearchIndex";

const FIELDS_BLOCKS: Construct[] = [
  {
    type: "props-table",
    heading: "Fields",
    rows: [
      {
        name: "logo",
        type: "{ label: string, href?: string, iconSrc?: string, iconPath?: string, iconViewBox?: string }",
        required: true,
        defaultValue: null,
        description: "iconPath (an inline SVG path) reacts to a light/dark toggle; iconSrc (a plain <img>) can't. iconPath wins if both are set.",
      },
      {
        name: "items",
        type: "NavBarItem[]",
        required: true,
        defaultValue: null,
        description: "Each item is { label, href, megaMenu? } — set megaMenu to turn an item into a dropdown trigger instead of a plain link.",
      },
      {
        name: "ariaLabel",
        type: "string",
        required: false,
        defaultValue: '"Main"',
        description: null,
      },
      {
        name: "trailing",
        type: '{ kind: "text", text } | { kind: "login", label?, href? } | { kind: "avatar", name, avatarSrc?, href?, placeholder? }',
        required: false,
        defaultValue: null,
        description: "Right-aligned content pushed to the header's far edge. Omit for a header that just ends after the nav.",
      },
      {
        name: "themeToggle",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: 'Adds a "Theme" popover alongside trailing (not instead of it) — independent of it entirely.',
      },
      {
        name: "constructSearch",
        type: "{ source: string, placeholder?: string }",
        required: false,
        defaultValue: null,
        description: "source is a key into BlockRenderer's data prop, resolving to a ConstructSearchResult[] — generated data, not literal inline content. Unresolved renders no search box.",
      },
    ],
  },
];

const BASIC_EXAMPLE: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Acme", href: "#" },
    items: [
      { label: "Docs", href: "#" },
      { label: "Pricing", href: "#" },
    ],
    trailing: { kind: "avatar", name: "Jane Doe", href: "#", placeholder: true },
  },
];

const MEGA_MENU_EXAMPLE: Construct[] = [
  {
    type: "site-header",
    logo: {
      label: "Acme",
      href: "#",
      iconPath: "M12 2 2 7l10 5 10-5-10-5Zm0 8-10 5 10 5 10-5-10-5Z",
    },
    items: [
      {
        label: "Products",
        href: "#",
        megaMenu: {
          columns: [
            {
              heading: "Platform",
              items: [
                { label: "Dashboard", description: "Live metrics", href: "#" },
                { label: "Automations", description: "Rules and triggers", href: "#" },
              ],
            },
          ],
          footer: { label: "See all products", href: "#" },
        },
      },
      { label: "Pricing", href: "#" },
    ],
    trailing: { kind: "text", text: "v2.4.0" },
  },
];

const LOGIN_EXAMPLE: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Acme", href: "#" },
    items: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
    ],
    trailing: { kind: "login", label: "Sign in", href: "#" },
  },
];

const THEME_AND_SEARCH_EXAMPLE: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Acme", href: "#" },
    items: [
      { label: "Docs", href: "#" },
      { label: "Pricing", href: "#" },
    ],
    themeToggle: true,
    constructSearch: { source: "demoSearchIndex", placeholder: "Search..." },
    trailing: { kind: "avatar", name: "Jane Doe", href: "#", placeholder: true },
  },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [{ kind: "text", text: "A real site nav bar: logo (optionally linked, optionally with an icon image or an inline theme-reactive SVG path), a nav-bar capped at half the header's own width per the 'Nav overflow' heuristic (the logo and trailing content always keep guaranteed room), an optional theme toggle, an optional live construct-search box, and optional trailing content pushed to the far edge — plain text (a version string), a login action, or a signed-in user's avatar. This project's own site header (above) is exactly this block, not hand-authored — see it at real scale there, with every one of these fields turned on at once." }],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "site-header", logo: { label: string, href?: string, iconSrc?: string, iconPath?: string, iconViewBox?: string }, items: NavBarItem[], ariaLabel?: string, trailing?: { kind: "text", text: string } | { kind: "login", label?: string, href?: string } | { kind: "avatar", name: string, avatarSrc?: string, href?: string, placeholder?: boolean }, themeToggle?: boolean, constructSearch?: { source: string, placeholder?: string } }` }],
  },
];

const BASIC_HEADING_BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Example: basic", body: [{ kind: "text", text: "logo + items + an avatar trailing." }] },
];

const MEGA_MENU_HEADING_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Example: icon logo, mega-menu item, text trailing",
    body: [{ kind: "text", text: "logo.iconPath (inline SVG, reacts to light/dark), a nav item with megaMenu turning it into a dropdown, and a plain text trailing instead of an avatar." }],
  },
];

const LOGIN_HEADING_BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Example: login trailing", body: [{ kind: "text", text: 'trailing.kind = "login" for a signed-out header.' }] },
];

const THEME_AND_SEARCH_HEADING_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Example: themeToggle + constructSearch",
    body: [
      {
        kind: "text",
        text: "themeToggle and constructSearch are both independent, opt-in additions — combinable with any trailing kind, as this project's own header does. constructSearch.source resolves against whatever NextBlockRenderer's own data prop supplies (here, this exact page's own construct index) rather than literal inline data.",
      },
    ],
  },
];

export default function SiteHeaderPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Site Header</Heading>
      <Text color="secondary">{"A real site nav bar: logo, a nav-bar capped at half the header's own width, an optional theme toggle, an optional live construct-search box, and optional trailing content pushed to the far edge — plain text, a login action, or a signed-in user's avatar. This project's own site header (above) is exactly this block, not hand-authored."}</Text>
      <NextBlockRenderer blocks={BLOCKS} />
      <NextBlockRenderer blocks={FIELDS_BLOCKS} />
      <NextBlockRenderer blocks={BASIC_HEADING_BLOCKS} />
      <NextBlockRenderer blocks={BASIC_EXAMPLE} />
      <NextBlockRenderer blocks={MEGA_MENU_HEADING_BLOCKS} />
      <NextBlockRenderer blocks={MEGA_MENU_EXAMPLE} />
      <NextBlockRenderer blocks={LOGIN_HEADING_BLOCKS} />
      <NextBlockRenderer blocks={LOGIN_EXAMPLE} />
      <NextBlockRenderer blocks={THEME_AND_SEARCH_HEADING_BLOCKS} />
      <NextBlockRenderer blocks={THEME_AND_SEARCH_EXAMPLE} data={{ demoSearchIndex: CONSTRUCT_SEARCH_INDEX }} />
    </Stack>
  );
}
