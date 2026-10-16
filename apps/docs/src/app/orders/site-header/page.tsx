import { Box, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CONSTRUCT_SEARCH_INDEX } from "@/data/constructSearchIndex";
import { project } from "@/fixtures/tideline";

const CODE = `{
  type: "site-header",
  logo: { label: "Tideline", href: "/" },
  items: [{ label: "Projects", href: "/projects" }, { label: "Calendar", href: "/calendar" }],
  trailing: { kind: "avatar", name: "Maya Chen", href: "/me", placeholder: true },
  themeToggle: true,
}`;

const FIELDS_BLOCKS: Construct[] = [
  {
    type: "props-table",
    heading: "Fields",
    rows: [
      { name: "logo", type: "{ label: string, href?: string, iconSrc?: string, iconPath?: string, iconViewBox?: string }", required: true, defaultValue: null, description: "iconPath (an inline SVG path) reacts to a light/dark toggle; iconSrc (a plain <img>) can't. iconPath wins if both are set." },
      { name: "items", type: "NavBarItem[]", required: true, defaultValue: null, description: "Each item is { label, href, megaMenu? }. Set megaMenu to turn an item into a dropdown trigger." },
      { name: "ariaLabel", type: "string", required: false, defaultValue: '"Main"', description: null },
      { name: "trailing", type: '{ kind: "text", text } | { kind: "login", label?, href? } | { kind: "avatar", name, avatarSrc?, href?, placeholder? }', required: false, defaultValue: null, description: "Right-aligned content at the header's far edge." },
      { name: "themeToggle", type: "boolean", required: false, defaultValue: "false", description: 'Adds a "Theme" popover alongside trailing.' },
      { name: "constructSearch", type: "{ source: string, placeholder?: string }", required: false, defaultValue: null, description: "source is a key into the renderer's data prop, resolving to a ConstructSearchResult[]. Unresolved renders no search box." },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "site-header", logo: {...}, items: NavBarItem[], ariaLabel?: string, trailing?: {...}, themeToggle?: boolean, constructSearch?: {...} }` }],
  },
];

const MAIN: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Tideline", href: "#", iconPath: "M12 2 2 7l10 5 10-5-10-5Zm0 8-10 5 10 5 10-5-10-5Z" },
    items: [
      {
        label: "Projects",
        href: "#",
        megaMenu: {
          columns: [
            {
              heading: "Open",
              items: [
                { label: "Harbour rebrand", description: "Brand, due 24 Oct", href: "#" },
                { label: "Tideline mobile", description: "Product, due 7 Nov", href: "#" },
              ],
            },
          ],
          footer: { label: "See all projects", href: "#" },
        },
      },
      { label: "Calendar", href: "#" },
      { label: "Files", href: "#" },
    ],
    trailing: { kind: "avatar", name: "Maya Chen", href: "#", placeholder: true },
  },
];

const LOGIN: Construct[] = [
  { type: "site-header", logo: { label: "Tideline", href: "#" }, items: [{ label: "Docs", href: "#" }], trailing: { kind: "login", label: "Sign in", href: "#" } },
];
const TEXT: Construct[] = [
  { type: "site-header", logo: { label: "Tideline", href: "#" }, items: [{ label: "Docs", href: "#" }], trailing: { kind: "text", text: "v0.9.0" } },
];
const NO_TRAIL: Construct[] = [{ type: "site-header", logo: { label: "Tideline", href: "#" }, items: [{ label: "Docs", href: "#" }, { label: "Blog", href: "#" }] }];

const FULL: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Tideline", href: "#" },
    items: [{ label: "Projects", href: "#" }, { label: "Calendar", href: "#" }],
    themeToggle: true,
    constructSearch: { source: "demoSearchIndex", placeholder: "Search..." },
    trailing: { kind: "avatar", name: "Maya Chen", href: "#", placeholder: true },
  },
];

function Surface({ children }: { children: React.ReactNode }) {
  return <Box style={{ background: "var(--rebar-color-bg-primary)", border: "1px solid var(--rebar-color-border)", borderRadius: 8, padding: "0 var(--rebar-space-sm)" }}>{children}</Box>;
}

export default function SiteHeaderPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Site Header</Heading>
      <Text color="secondary">A site nav bar: logo, links, an optional theme toggle and search, and trailing content.</Text>

      <DemoStage
        title="App header"
        caption="Logo, a mega-menu item and a signed-in avatar"
        code={CODE}
      >
        <Stack gap="md">
          <Surface><NextBlockRenderer blocks={MAIN} /></Surface>
          <Text size="xs" color="secondary">Signed out</Text>
          <Surface><NextBlockRenderer blocks={LOGIN} /></Surface>
          <Text size="xs" color="secondary">Text trailing</Text>
          <Surface><NextBlockRenderer blocks={TEXT} /></Surface>
          <Text size="xs" color="secondary">No trailing content</Text>
          <Surface><NextBlockRenderer blocks={NO_TRAIL} /></Surface>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="Theme toggle and live search turned on" widths={false}>
        <Stack gap="md">
          <Surface><NextBlockRenderer blocks={FULL} data={{ demoSearchIndex: CONSTRUCT_SEARCH_INDEX }} /></Surface>
          <Heading level={3}>{harbour.name}</Heading>
          <Text color="secondary">{harbour.summary}</Text>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={FIELDS_BLOCKS} />
    </Stack>
  );
}
