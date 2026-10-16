import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `{
  type: "mega-menu",
  columns: [
    { heading: "Projects", items: [{ label: "Harbour rebrand", description: "Brand", href: "/harbour" }] },
  ],
  footer: { label: "All projects", href: "/projects" },
}`;

const item = (id: string) => {
  const p = PROJECTS.find((x) => x.id === id)!;
  return { label: p.name, description: `${p.kicker}, due ${p.due}`, href: `#${p.id}` };
};

const MAIN: Construct[] = [
  {
    type: "mega-menu",
    columns: [
      { heading: "Projects", items: [item("harbour"), item("mobile"), item("signage")] },
      { heading: "Research", items: [item("interviews"), { label: "Interview log", description: "Twelve calls", href: "#log" }] },
      { heading: "Team", items: [{ label: "Maya Chen", href: "#maya" }, { label: "Jonas Weber", href: "#jonas" }, { label: "Priya Nair", href: "#priya" }, { label: "Leo Santos", href: "#leo" }] },
    ],
    footer: { label: "See all projects", href: "#projects" },
  },
];

const SINGLE: Construct[] = [
  { type: "mega-menu", columns: [{ heading: "", items: [item("rota"), { label: "Payroll cut-off", description: "28 Oct", href: "#payroll" }] }] },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `{
  type: "mega-menu",
  columns: { heading: string, items: { label: string; description?: string; href: string; icon?: IconName; external?: boolean }[] }[],
  footer?: { label: string; href: string },
}`,
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Dismissal",
    body: [{ kind: "text", text: "Clicking a link closes the popover. The host (usually NavBar) owns `open` / `onOpenChange`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-placement-block="mega-menu"` on the panel root, `data-rebar-part="mega-trigger"` on the trigger button.' }],
  },
];

export default function MegaMenuPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>MegaMenu</Heading>
      <Text color="secondary">A multi-column navigation panel for dense site maps, shown inside a Popover.</Text>

      <DemoStage
        title="Projects menu"
        caption="Three columns and a footer link"
        code={CODE}
        states={[{ label: "One column, no footer", node: <NextBlockRenderer blocks={SINGLE} /> }]}
      >
        <NextBlockRenderer blocks={MAIN} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Site header" caption="The panel opened from a nav item" widths={false}>
        <NextBlockRenderer
          blocks={[
            {
              type: "site-header",
              logo: { label: "Tideline", href: "#" },
              items: [
                {
                  label: "Projects",
                  href: "#",
                  megaMenu: { columns: [{ heading: "Open", items: [item("harbour"), item("mobile")] }], footer: { label: "See all projects", href: "#" } },
                },
                { label: "Calendar", href: "#" },
                { label: "Files", href: "#" },
              ],
              trailing: { kind: "avatar", name: "Maya Chen", href: "#", placeholder: true },
            },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
