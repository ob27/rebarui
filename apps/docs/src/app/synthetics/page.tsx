import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { shippedCategory } from "@/data/shippedCategory";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BlockEntry } from "@/components/BlockEntry";

const CATEGORY_LABEL = { web: "Web", mobile: "Mobile", diagram: "Diagram" } as const;
const CATEGORY_TONE = { web: "info", mobile: "success", diagram: "warning" } as const;

export default function SyntheticsPage() {
  const names = tierComponentNames("synthetic");

  const grid: Block = {
    type: "card-grid",
    items: names.map((name) => {
      const href = HAS_FULL_PAGE[name];
      const category = shippedCategory(name);
      return { title: name, href, linkLabel: "View reference →", tags: [{ label: CATEGORY_LABEL[category], tone: CATEGORY_TONE[category] }] };
    }),
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>Synthetics</Heading>
      <Text color="secondary">
        Static compositions/groupings of primitives with a unified purpose, but still no real
        dynamism — a fixed layout, not a state machine. Most placement-layer blocks land here:
        plain content shapes with nothing bound to live data or a handler. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Imitations, Opinions, and Orders.
      </Text>

      <Heading level={2}>Components ({names.length})</Heading>
      <NextBlockRenderer blocks={[grid]} />

      <Heading level={2}>Blocks (22)</Heading>

      <BlockEntry
        id="header"
        measured
        description="A title bar row — a heading with an optional trailing icon button (e.g. a close ×)."
        shape={`{ type: "header", title: string, action?: Action }`}
        blocks={[{ type: "header", title: "Preview", action: { icon: "close", label: "Close" } }]}
      />

      <BlockEntry
        id="banner"
        measured
        description="An inline alert strip — icon, one line of text, and an optional trailing action button."
        shape={`{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: IconName, text: string, action?: Action }`}
        blocks={[
          { type: "banner", tone: "info", icon: "info", text: "Nothing entered here is saved.", action: { label: "Reset", icon: "refresh" } },
        ]}
      />

      <BlockEntry
        id="checklist"
        measured
        description="A heading followed by a vertical stack of bordered, checkable rows."
        shape={`{ type: "checklist", heading?: string, items: string[] }`}
        blocks={[{ type: "checklist", heading: "Checklist", items: ["First item", "Second item", "Third item"] }]}
      />

      <BlockEntry
        id="callout"
        measured
        description="A toned box with a bold title line and an optional secondary subtitle line below it."
        shape={`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: IconName, title: string, subtitle?: string }`}
        blocks={[{ type: "callout", tone: "warning", icon: "clock", title: "In progress", subtitle: "Some items incomplete." }]}
      />

      <BlockEntry
        id="spin-card"
        measured={false}
        description="A small, centered card showing a real loading overlay (Spin) over a few lines of content — for demonstrating a loading state, not a real data-bound card. Generic rather than one-off: tip, content lines, and card size are all caller-supplied, not hardcoded to any one demo."
        shape={`{ type: "spin-card", tip?: string, items: string[], width?: number, minHeight?: number }`}
        blocks={[{ type: "spin-card", tip: "Fetching", items: ["Project A", "Project B", "Project C"] }]}
      />

      <BlockEntry
        id="error-block"
        measured={false}
        description="A whole-page failure/empty state — status picks a sensible default icon/title/description (default, disconnected, empty, busy), all overridable; action renders a real retry button the same small-secondary way banner/header/callout render theirs. This project's first genuinely Mobile-only block (see ref/BLOCKS.md) — every other antd-mobile-derived pattern shipped so far landed as a packages/core component only, never promoted into a block. fullPage is on by default here, since a dedicated block for this is specifically for the whole-page case; set it false for an inline, one-card failure state."
        shape={`{ type: "error-block", status?: "default"|"disconnected"|"empty"|"busy", title?: string, description?: string, action?: Action, fullPage?: boolean }`}
        blocks={[{ type: "error-block", status: "disconnected", action: { label: "Retry" } }]}
      />

      <BlockEntry
        id="footer"
        measured={false}
        description="Page-bottom chrome: a 'no more results' label (a real Divider with text), a plain content line, a row of links, and a row of chips — every section independently optional. Mirrors how site-header already wraps NavBar for the top of a page; this project's second Mobile block (see ref/BLOCKS.md). No onLinkClick/onChipClick in the schema — a click handler isn't serializable Block[] data."
        shape={`{ type: "footer", label?: string, content?: string, links?: { text: string, href: string }[], chips?: { text: string, type?: "plain"|"link" }[] }`}
        blocks={[
          {
            type: "footer",
            label: "No more results",
            content: "© 2026 Example Inc.",
            links: [{ text: "Terms", href: "#" }, { text: "Privacy", href: "#" }],
            chips: [{ text: "New" }, { text: "Feedback", type: "link" }],
          },
        ]}
      />

      <BlockEntry
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
              { title: "Tested", body: "Playwright-checked on every change." },
            ],
          },
        ]}
      />

      <BlockEntry
        id="pillar-grid"
        measured
        description="A row of cards, each with a title, body copy, and a CTA link — the homepage's three-pillars grid."
        shape={`{ type: "pillar-grid", items: { title: string, body: string, href: string, cta: string }[] }`}
        blocks={[
          {
            type: "pillar-grid",
            items: [
              { title: "Imitations", body: "Static, standalone primitives.", href: "/imitations", cta: "Browse" },
              { title: "Opinions", body: "Real state, real interactivity.", href: "/opinions", cta: "Browse" },
              { title: "Benchmarks", body: "Measured token, speed, and consistency data.", href: "/benchmarks", cta: "Browse" },
            ],
          },
        ]}
      />

      <BlockEntry
        id="hero"
        measured={false}
        description="A centered page-top hero: optional badge, title, subtitle, action buttons, and an optional code snippet. Badge and subtitle support a tiny inline markup (backtick-code, [label](href) links)."
        shape={`{ type: "hero", badge?: string, title: string, subtitle: string, actions?: Action[], codeSnippet?: string }`}
        blocks={[
          {
            type: "hero",
            badge: "v0.5",
            title: "Example Hero",
            subtitle: "A subtitle with `inline code` and a [link](/imitations).",
            actions: [{ label: "Primary action", variant: "primary" }],
          },
        ]}
      />

      <BlockEntry
        id="section-header"
        measured={false}
        description="A centered kicker/title/subtitle block — used between homepage sections."
        shape={`{ type: "section-header", kicker?: string, title: string, subtitle?: string }`}
        blocks={[{ type: "section-header", kicker: "Example kicker", title: "Section title", subtitle: "Section subtitle." }]}
      />

      <BlockEntry
        id="card-grid"
        measured={false}
        description='A wrapping grid of cards — title, optional body copy, optional status tags, optional link — for an index/directory of many similar named things (see the tier pages, all built through this block). Distinct from feature-grid (no link, no tags, meant for a handful of short callouts) and pillar-grid (a fixed small set with a mandatory CTA): card-grid is for an open-ended, possibly large list where each item may or may not have a description, a link, or a status yet.'
        shape={`{ type: "card-grid", items: { title: string, body?: string, href?: string, linkLabel?: string, tags?: { label: string, tone?: Tone }[] }[] }`}
        blocks={[
          {
            type: "card-grid",
            items: [
              { title: "Avatar", body: "Illustrated placeholder art.", href: "#", linkLabel: "View reference →" },
              { title: "Accordion", tags: [{ label: "No reference page", tone: "warning" }] },
              { title: "DatePicker", body: "Calendar popup for picking a date.", tags: [{ label: "Planned", tone: "warning" }] },
            ],
          },
        ]}
      />

      <BlockEntry
        id="persona-card"
        measured={false}
        description='A row of identity cards — avatar + name + optional meta line. Catalogued as "Persona / User Card" and flagged at catalogue time as "arguably an Avatar+Text composition, not a new primitive" — exactly the case for a block: no new component needed, just a fixed layout of two that already ship.'
        shape={`{ type: "persona-card", items: { name: string, meta?: string, avatarSrc?: string, avatarPlaceholder?: boolean }[] }`}
        blocks={[
          {
            type: "persona-card",
            items: [
              { name: "Priya Shah", meta: "Engineering lead", avatarPlaceholder: true },
              { name: "Marcus Webb", meta: "Design", avatarPlaceholder: true },
            ],
          },
        ]}
      />

      <BlockEntry
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

      <BlockEntry
        id="filter-bar"
        measured={false}
        description="A search input plus an optional filter select and a trailing primary action button, all in one row. Presentational only — nothing downstream is wired to it (see 'opinions' for blocks that actually bind to live data)."
        shape={`{ type: "filter-bar", searchPlaceholder?: string, filterLabel?: string, filterOptions?: string[], actionLabel?: string }`}
        blocks={[
          { type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "Active", "Archived"], actionLabel: "New Project" },
        ]}
      />

      <BlockEntry
        id="form"
        measured={false}
        description="A card containing labeled fields (text/email/date/textarea/select/checkbox, each optionally required) and an optional submit button. Presentational only — no validation, no submit handler wired (see the real Form/FormItem components, or ai-chat/table under 'opinions' for blocks that actually bind to live data). Omit submitLabel when nested inside a modal, which supplies its own action buttons."
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

      <BlockEntry
        id="doc-section"
        measured={false}
        description="A heading (level 1, 2, or 3) plus prose/code/list content — the block type every /docs/* page is built from, including each page's own title (level 1) and intro paragraph, not just its subsections. Prose text supports the same tiny inline markup as hero."
        shape={`{ type: "doc-section", heading?: string, level?: 1 | 2 | 3, body: ProseNode[] }
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

      <BlockEntry
        id="props-table"
        measured={false}
        description="A component's full prop reference — Prop/Type/Required/Default columns — rendered from already-generated `PropRow[]` data (see apps/docs/scripts/generate-props.mjs), not read from a file by the Packer itself: this package has no dependency on any one consuming app's build output. Used to build every component reference page's own props table."
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

      <BlockEntry
        id="heuristic"
        measured={false}
        description="One entry of a heuristics/design-principles page: a heading, a bolded one-line rule, doc-section-style rationale prose (same tiny inline markup), and an optional code sample and/or a real nested live Block[] example. Carries its own stable id rather than slugifying one from title, since existing cross-references may already point at a specific hand-picked id. Used to build /docs/heuristics."
        shape={`{ type: "heuristic", id: string, title: string, rule: string, rationale: ProseNode[], code?: string, exampleBlocks?: Block[] }`}
        blocks={[
          {
            type: "heuristic",
            id: "example-heuristic",
            title: "Example heuristic",
            rule: "State the rule in one bolded sentence.",
            rationale: [
              { kind: "text", text: "Then explain *why*, with `inline code` and a [link](/docs/heuristics) where useful." },
            ],
            exampleBlocks: [{ type: "checklist", heading: "Applied here", items: ["The rule", "The rationale", "A live example"] }],
          },
        ]}
      />

      <BlockEntry
        id="iframe"
        measured={false}
        description="A real <iframe> — a required, not optional, title (an embed with no accessible name is a real, common accessibility gap most iframe usage in the wild gets wrong). No default height, since that depends entirely on context — set one explicitly, or nest it in a comparison block (see 'orders'), which measures and applies one automatically."
        shape={`{ type: "iframe", src: string, title: string, height?: number }`}
        blocks={[{ type: "iframe", src: "https://example.com", title: "Example embed" }]}
      />

      <BlockEntry
        id="stats-table"
        measured={false}
        description="A small, static, presentational summary table — headers plus a plain grid of string/number cells, no sorting/selection/pagination. Distinct from table (an Opinion-tier block, since it pairs the real Table component with real search/filters/add-row over live data): this exists for the exact headers-plus-rows-of-cells shape a benchmark results table needs. Renders through the same real Table component underneath, just without the extra props that would invite features this kind of static presentational table doesn't need."
        shape={`{ type: "stats-table", headers: string[], rows: (string | number)[][] }`}
        blocks={[
          {
            type: "stats-table",
            headers: ["Metric", "antd", "rebar-ui"],
            rows: [
              ["Tokens", 31231, 30211],
              ["Wall clock (s)", 42, 18],
            ],
          },
        ]}
      />

      <BlockEntry
        id="gallery"
        measured={false}
        description="A labeled, single-aspect-ratio image carousel — screenshots named ${prefix}-01.png through ${prefix}-NN.png inside dir (a public/ path), per Design Heuristics' carousel rule (one aspect ratio only, no exceptions). count defaults to 15 to match this project's own standard benchmark sample size."
        shape={`{ type: "gallery", label: string, dir: string, prefix: string, count?: number }`}
      />
    </Stack>
  );
}
