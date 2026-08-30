import { Box, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { SectionNav } from "@/components/SectionNav";

const ARCHETYPES = [
  { id: "header", label: "header" },
  { id: "banner", label: "banner" },
  { id: "checklist", label: "checklist" },
  { id: "callout", label: "callout" },
  { id: "feature-grid", label: "feature-grid" },
  { id: "pillar-grid", label: "pillar-grid" },
  { id: "form", label: "form" },
  { id: "table", label: "table" },
  { id: "data-list", label: "data-list" },
  { id: "filter-bar", label: "filter-bar" },
  { id: "tabs", label: "tabs" },
  { id: "modal", label: "modal" },
  { id: "hero", label: "hero" },
  { id: "section-header", label: "section-header" },
  { id: "doc-section", label: "doc-section" },
  { id: "props-table", label: "props-table" },
];

function Code({ children }: { children: string }) {
  return (
    <Box
      as="pre"
      style={{
        background: "var(--rebar-color-bg-secondary, #f5f5f5)",
        padding: "var(--rebar-space-md)",
        borderRadius: 4,
        overflowX: "auto",
        fontSize: "var(--rebar-font-size-xs)",
      }}
    >
      <code>{children}</code>
    </Box>
  );
}

function Entry({
  id,
  measured,
  description,
  shape,
  code,
  blocks,
}: {
  id: string;
  measured: boolean;
  description: string;
  shape: string;
  code?: string;
  blocks?: Block[];
}) {
  return (
    <Stack gap="sm" id={id}>
      <Stack direction="row" gap="sm" align="center">
        <Heading level={2} style={{ margin: 0 }}>
          <code>{id}</code>
        </Heading>
        <Text
          size="xs"
          color="secondary"
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {measured ? "measured" : "unmeasured"}
        </Text>
      </Stack>
      <Text size="sm" color="secondary">
        {description}
      </Text>
      <Code>{shape}</Code>
      {code ? <Code>{code}</Code> : null}
      {blocks ? (
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
          }}
        >
          <NextBlockRenderer blocks={blocks} />
        </Box>
      ) : null}
    </Stack>
  );
}

export default function ArchetypesPage() {
  return (
    <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
      <Stack gap="lg" style={{ flex: 1, minWidth: 0 }}>
        <Stack gap="sm">
          <Heading level={1}>The archetype library</Heading>
          <Text color="secondary">
            Every block type the <strong>RebarUI DSL Packer</strong> (
            <code>@rebar-ui/placement</code>&apos;s <code>BlockRenderer</code>) understands, in
            one place — the complete vocabulary an LLM (or a developer) picks from when authoring
            a <code>Block[]</code> document. &quot;Measured&quot; means the archetype has real
            n=15 <a href="/benchmarks" className="rebar-link">benchmark</a> data behind it; &quot;unmeasured&quot; means
            it&apos;s real, tested, and shipped, but hasn&apos;t been through that rigor yet. See{" "}
            <a href="/docs/heuristics" className="rebar-link">Design Heuristics</a> for *why* the Packer renders things
            this way — this page is the *what*.
          </Text>
        </Stack>

        <Entry
          id="header"
          measured
          description="A title bar row — a heading with an optional trailing icon button (e.g. a close ×)."
          shape={`{ type: "header", title: string, action?: Action }`}
          blocks={[{ type: "header", title: "Preview", action: { icon: "close", label: "Close" } }]}
        />

        <Entry
          id="banner"
          measured
          description="An inline alert strip — icon, one line of text, and an optional trailing action button."
          shape={`{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: IconName, text: string, action?: Action }`}
          blocks={[
            { type: "banner", tone: "info", icon: "info", text: "Nothing entered here is saved.", action: { label: "Reset", icon: "refresh" } },
          ]}
        />

        <Entry
          id="checklist"
          measured
          description="A heading followed by a vertical stack of bordered, checkable rows."
          shape={`{ type: "checklist", heading?: string, items: string[] }`}
          blocks={[{ type: "checklist", heading: "Checklist", items: ["First item", "Second item", "Third item"] }]}
        />

        <Entry
          id="callout"
          measured
          description="A toned box with a bold title line and an optional secondary subtitle line below it."
          shape={`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: IconName, title: string, subtitle?: string }`}
          blocks={[{ type: "callout", tone: "warning", icon: "clock", title: "In progress", subtitle: "Some items incomplete." }]}
        />

        <Entry
          id="feature-grid"
          measured
          description="A wrapping row of small title+body pairs — no links, no images, just short feature copy."
          shape={`{ type: "feature-grid", items: { title: string, body: string }[] }`}
          blocks={[
            {
              type: "feature-grid",
              items: [
                { title: "Headless", body: "Radix underneath." },
                { title: "Replaceable", body: "CSS-variable theming." },
              ],
            },
          ]}
        />

        <Entry
          id="pillar-grid"
          measured
          description="A row of cards, each with a title, body copy, and a CTA link — the homepage's three-pillars grid."
          shape={`{ type: "pillar-grid", items: { title: string, body: string, href: string, cta: string }[] }`}
          blocks={[
            {
              type: "pillar-grid",
              items: [{ title: "Components", body: "The reference.", href: "/components", cta: "Browse" }],
            },
          ]}
        />

        <Entry
          id="form"
          measured={false}
          description="A card containing labeled fields (text/email/date/textarea/select/checkbox) and an optional submit button. Omit submitLabel when the form is nested inside a modal, which supplies its own action buttons."
          shape={`{ type: "form", heading?: string, fields: FormField[], submitLabel?: string }`}
          blocks={[
            {
              type: "form",
              heading: "Account Settings",
              fields: [{ kind: "text", label: "Display name", placeholder: "e.g. Jane Doe" }],
              submitLabel: "Save changes",
            },
          ]}
        />

        <Entry
          id="table"
          measured={false}
          description="A bordered data table with exactly the columns you give it — no hidden 'show all fields' default. Rows may carry a per-row action button."
          shape={`{ type: "table", columns: string[], rows: { cells: string[], actionLabel?: string }[] }`}
          blocks={[
            {
              type: "table",
              columns: ["Team", "Lead"],
              rows: [{ cells: ["Engineering", "Priya Shah"], actionLabel: "Select" }],
            },
          ]}
        />

        <Entry
          id="data-list"
          measured={false}
          description="A vertical stack of title+badge rows — a lighter-weight alternative to table for a simple list of named items."
          shape={`{ type: "data-list", items: { title: string, badge?: string }[] }`}
          blocks={[
            {
              type: "data-list",
              items: [
                { title: "Marketing Site Redesign", badge: "Active" },
                { title: "Legacy API Migration", badge: "Archived" },
              ],
            },
          ]}
        />

        <Entry
          id="filter-bar"
          measured={false}
          description="A search input plus an optional filter select and a trailing primary action button, all in one row."
          shape={`{ type: "filter-bar", searchPlaceholder?: string, filterLabel?: string, filterOptions?: string[], actionLabel?: string }`}
          blocks={[
            { type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "Active", "Archived"], actionLabel: "New Project" },
          ]}
        />

        <Entry
          id="tabs"
          measured={false}
          description="Real Tabs (Radix underneath) — each tab holds its own nested Block[], rendered recursively, so any other archetype can live inside a tab panel."
          shape={`{ type: "tabs", tabs: { label: string, blocks: Block[] }[] }`}
          blocks={[
            {
              type: "tabs",
              tabs: [
                { label: "Team", blocks: [{ type: "callout", tone: "info", title: "Team panel" }] },
                { label: "Details", blocks: [{ type: "callout", tone: "info", title: "Details panel" }] },
              ],
            },
          ]}
        />

        <Stack gap="sm" id="modal">
          <Stack direction="row" gap="sm" align="center">
            <Heading level={2} style={{ margin: 0 }}>
              <code>modal</code>
            </Heading>
            <Text
              size="xs"
              color="secondary"
              style={{ padding: "2px 8px", borderRadius: 999, border: "1px solid var(--rebar-color-border, #e0e0e0)", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              unmeasured
            </Text>
          </Stack>
          <Text size="sm" color="secondary">
            A real Dialog (Radix underneath), holding its own nested <code>Block[]</code>, with
            confirm/cancel footer actions. Renders <strong>forced open</strong> — a convention
            for static-render/screenshot contexts (see <a href="/benchmarks#tiers" className="rebar-link">the tier
            benchmarks</a>), not for a normal live page. No live example here on purpose: a
            forced-open modal on a page with other content around it covers the whole page as a
            fixed overlay (learned the hard way, twice — see the{" "}
            <a href="/docs/heuristics#control" className="rebar-link">User control and freedom</a> heuristic). See it
            live, properly triggered and closable three ways, on the{" "}
            <a href="/components/dialog" className="rebar-link">Dialog reference page</a>.
          </Text>
          <Code>{`{ type: "modal", title: string, blocks: Block[], confirmLabel?: string, cancelLabel?: string }`}</Code>
        </Stack>

        <Entry
          id="hero"
          measured={false}
          description="A centered page-top hero: optional badge, title, subtitle, action buttons, and an optional code snippet. Badge and subtitle support a tiny inline markup (backtick-code, [label](href) links)."
          shape={`{ type: "hero", badge?: string, title: string, subtitle: string, actions?: Action[], codeSnippet?: string }`}
          blocks={[
            {
              type: "hero",
              badge: "v0.1",
              title: "Example Hero",
              subtitle: "A subtitle with `inline code` and a [link](/components).",
              actions: [{ label: "Primary action", variant: "primary" }],
            },
          ]}
        />

        <Entry
          id="section-header"
          measured={false}
          description="A centered kicker/title/subtitle block — used between homepage sections."
          shape={`{ type: "section-header", kicker?: string, title: string, subtitle?: string }`}
          blocks={[{ type: "section-header", kicker: "Example kicker", title: "Section title", subtitle: "Section subtitle." }]}
        />

        <Entry
          id="doc-section"
          measured={false}
          description="A heading (level 2 or 3) plus prose/code/list content — the archetype this page and every /docs/* page are (or will be) built from. Prose text supports the same tiny inline markup as hero."
          shape={`{ type: "doc-section", heading?: string, level?: 2 | 3, body: ProseNode[] }
// ProseNode = { kind: "text", text: string }
//           | { kind: "code", code: string }
//           | { kind: "list", items: string[], ordered?: boolean }`}
          blocks={[
            {
              type: "doc-section",
              heading: "Example",
              body: [
                { kind: "text", text: "A paragraph with `inline code` and a [link](/docs)." },
                { kind: "list", items: ["First point", "Second point"] },
              ],
            },
          ]}
        />

        <Entry
          id="props-table"
          measured={false}
          description="A component's full prop reference — Prop/Type/Required/Default columns — rendered from already-generated `PropRow[]` data (see apps/docs/scripts/generate-props.mjs), not read from a file by the renderer itself: this package has no dependency on any one consuming app's build output. Used to rebuild this project's own /components/* reference pages through the Packer."
          shape={`{ type: "props-table", heading?: string, rows: PropRow[] }
// PropRow = { name: string, type: string, required: boolean, defaultValue: string | null, description: string | null }`}
          blocks={[
            {
              type: "props-table",
              heading: "Example props",
              rows: [
                { name: "variant", type: '"primary" | "secondary"', required: false, defaultValue: '"secondary"', description: null },
                { name: "onClick", type: "() => void", required: true, defaultValue: null, description: null },
              ],
            },
          ]}
        />
      </Stack>
      <SectionNav sections={ARCHETYPES} />
    </Stack>
  );
}
