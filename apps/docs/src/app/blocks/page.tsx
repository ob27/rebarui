import type { ReactNode } from "react";
import { Alert, Box, CodeBlock, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCK_TYPES = [
  { id: "header", label: "header" },
  { id: "nav-bar", label: "nav-bar" },
  { id: "site-header", label: "site-header" },
  { id: "nav-index", label: "nav-index" },
  { id: "page-index", label: "page-index" },
  { id: "banner", label: "banner" },
  { id: "checklist", label: "checklist" },
  { id: "goal-tracker", label: "goal-tracker" },
  { id: "ai-chat", label: "ai-chat" },
  { id: "callout", label: "callout" },
  { id: "spin-card", label: "spin-card" },
  { id: "feature-grid", label: "feature-grid" },
  { id: "pillar-grid", label: "pillar-grid" },
  { id: "hero", label: "hero" },
  { id: "section-header", label: "section-header" },
  { id: "card-grid", label: "card-grid" },
  { id: "persona-card", label: "persona-card" },
  { id: "table", label: "table" },
  { id: "data-list", label: "data-list" },
  { id: "filter-bar", label: "filter-bar" },
  { id: "form", label: "form" },
  { id: "tabs", label: "tabs" },
  { id: "modal", label: "modal" },
  { id: "wizard", label: "wizard" },
  { id: "card-kanban", label: "card-kanban" },
  { id: "sticky-kanban", label: "sticky-kanban" },
  { id: "doc-section", label: "doc-section" },
  { id: "props-table", label: "props-table" },
  { id: "heuristic", label: "heuristic" },
  { id: "iframe", label: "iframe" },
  { id: "comparison", label: "comparison" },
  { id: "scatter-chart", label: "scatter-chart" },
  { id: "line-chart", label: "line-chart" },
  { id: "stacked-bar-chart", label: "stacked-bar-chart" },
];


function Kicker({ children }: { children: string }) {
  return (
    <Text
      size="xs"
      color="secondary"
      style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "var(--rebar-font-weight-semibold)" }}
    >
      {children}
    </Text>
  );
}

function GroupHeading({ children }: { children: string }) {
  return (
    <Heading level={2} style={{ marginTop: "var(--rebar-space-lg)" }}>
      {children}
    </Heading>
  );
}

function Entry({
  id,
  measured,
  description,
  shape,
  code,
  blocks,
  demoMaxWidth,
}: {
  id: string;
  measured: boolean;
  description: ReactNode;
  shape: string;
  code?: string;
  blocks?: Block[];
  /** Caps the live-example box's width — for a block whose behavior only shows up when it's
      genuinely width-constrained (nav-bar's overflow collapse), rather than relying on a reader
      manually narrowing their browser to see it. */
  demoMaxWidth?: number;
}) {
  return (
    <Stack
      gap="sm"
      id={id}
      style={{
        borderTop: "1px solid var(--rebar-color-border, #e0e0e0)",
        paddingTop: "var(--rebar-space-lg)",
      }}
    >
      <Stack direction="row" gap="sm" align="center">
        <Heading level={3} style={{ margin: 0 }}>
          <code>{id}</code>
        </Heading>
        <Tag tone={measured ? "success" : "warning"} style={{ textTransform: "uppercase" }}>
          {measured ? "measured" : "unmeasured"}
        </Tag>
      </Stack>
      <Text size="sm" color="secondary">
        {description}
      </Text>
      <Stack gap="xs">
        <Kicker>Shape</Kicker>
        <CodeBlock code={shape} language="ts" />
        {code ? <CodeBlock code={code} language="tsx" /> : null}
      </Stack>
      {blocks ? (
        <Stack gap="xs">
          <Kicker>Example</Kicker>
          <Box
            style={{
              border: "1px solid var(--rebar-color-border, #e0e0e0)",
              borderRadius: 4,
              padding: "var(--rebar-space-lg)",
              maxWidth: demoMaxWidth,
            }}
          >
            <NextBlockRenderer blocks={blocks} />
          </Box>
        </Stack>
      ) : null}
    </Stack>
  );
}

export default function BlocksPage() {
  return (
    <Box as="main" style={{ maxWidth: 960, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
        <Stack gap="lg" style={{ flex: 1, minWidth: 0 }}>
        <Stack gap="sm">
          <Heading level={1}>Blocks</Heading>
          <Text color="secondary">
            Every block type the <strong>RebarUI DSL Packer</strong> (
            <code>@rebar-ui/placement</code>&apos;s <code>BlockRenderer</code>) understands, in
            one place — the complete vocabulary an LLM (or a developer) picks from when authoring
            a <code>Block[]</code> document. A block is a super-component made of{" "}
            <a href="/components" className="rebar-link">components</a> — a named, pre-decided
            layout pattern (a form, a card grid, a nav) rather than a single interactive control.
            &quot;Measured&quot; means the block has real n=15{" "}
            <a href="/benchmarks" className="rebar-link">benchmark</a> data behind it;
            &quot;unmeasured&quot; means it&apos;s real, tested, and shipped, but hasn&apos;t been
            through that rigor yet. See{" "}
            <a href="/docs/heuristics" className="rebar-link">Design Heuristics</a> for <em>why</em> the
            Packer renders things this way — this page is the <em>what</em>.
          </Text>
        </Stack>

        <Alert type="warning" title="Blocks are meant to be authored as data, not imported directly">
          <Text size="sm">
            Every block is a real, exported <code>rebar-ui</code> component underneath (e.g.{" "}
            <code>nav-index</code> is just <code>NavIndex</code>) — nothing stops you from
            importing one and hand-placing it like any other component in a normal UI library.
            But the entire point of a block is that an LLM (or a developer) only supplies a{" "}
            <code>Block[]</code> document — plain data, no JSX, no layout decisions — and{" "}
            <code>BlockRenderer</code> decides everything else, every time, the same way. That
            data-in/deterministic-render split is what the{" "}
            <a href="/benchmarks" className="rebar-link">measured token, speed, and
            consistency wins</a> actually come from. Reach for a block directly and you still get
            a working component — you just give up the automation and the numbers behind it,
            the same tradeoff as hand-placing any other library&apos;s component instead of
            letting a design system own the layout.
          </Text>
        </Alert>

        <GroupHeading>Navigation</GroupHeading>

        <Entry
          id="header"
          measured
          description="A title bar row — a heading with an optional trailing icon button (e.g. a close ×)."
          shape={`{ type: "header", title: string, action?: Action }`}
          blocks={[{ type: "header", title: "Preview", action: { icon: "close", label: "Close" } }]}
        />

        <Entry
          id="nav-bar"
          measured={false}
          description={
            'A horizontal site nav that measures its own available width and collapses items that would push it past that width into a trailing "More" popover instead of wrapping or clipping — see the "Nav overflow" rule on Design Heuristics. Drag the demo box\'s own bottom-right corner to actually resize it live — resizable is off by default (a real site header should never be user-resizable); it\'s only on here to demonstrate the collapse.'
          }
          shape={`{ type: "nav-bar", items: { label: string, href: string }[], ariaLabel?: string, resizable?: boolean }`}
          blocks={[
            {
              type: "nav-bar",
              ariaLabel: "Example",
              resizable: true,
              items: [
                { label: "Docs", href: "#" },
                { label: "Components", href: "#" },
                { label: "Blocks", href: "#" },
                { label: "Benchmarks", href: "#" },
                { label: "About", href: "#" },
              ],
            },
          ]}
        />

        <Entry
          id="site-header"
          measured={false}
          description="A real site nav bar: logo (optionally linked, optionally with an icon image), a nav-bar capped at half the header's own width per the 'Nav overflow' heuristic (the logo and trailing content always keep guaranteed room), and optional trailing content pushed to the far edge — plain text (a version string), a login action, or a signed-in user's avatar. This project's own site header (above) is exactly this block, not hand-authored — see it at real scale there."
          shape={`{ type: "site-header", logo: { label: string, href?: string, iconSrc?: string }, items: { label: string, href: string }[], ariaLabel?: string, trailing?: { kind: "text", text: string } | { kind: "login", label?: string, href?: string } | { kind: "avatar", name: string, avatarSrc?: string, href?: string, placeholder?: boolean } }`}
          blocks={[
            {
              type: "site-header",
              logo: { label: "Acme", href: "#" },
              items: [
                { label: "Docs", href: "#" },
                { label: "Pricing", href: "#" },
              ],
              trailing: { kind: "avatar", name: "Jane Doe", href: "#", placeholder: true },
            },
          ]}
        />

        <Entry
          id="nav-index"
          measured={false}
          description={
            <>
              A vertical link index — once the list passes 12 items, a search box appears, plus a
              real MultiSelect checklist for category and, once items carry more than one distinct
              status, a second, independent one for status (never hand-rolled chip buttons or a
              SegmentedControl toggle, which can&apos;t express &quot;show more than one value at
              once&quot; at all). The cross-page counterpart to page-index below (this one links to
              other pages; that one links to headings on the current one). See &quot;Design
              Heuristics&quot; #11 (IA as pyramid), #41 (status is a pill, not label text), and #42
              (a filter dimension&apos;s control matches how many values it has, in three tiers). A
              narrow side-rail control, not center-column content — see it working at real scale,
              filtering the full component catalog, on the{" "}
              <a href="/components" className="rebar-link">/components</a> sidebar rather than as a
              cramped inline sample here.
            </>
          }
          shape={`{
  type: "nav-index",
  items: { label: string, href: string, category?: string, status?: string }[],
  categoryLabels?: Record<string, string>,
  statusLabels?: Record<string, string>,
  unstatusedLabel?: string,
  searchPlaceholder?: string,
  ariaLabel?: string,
}`}
        />

        <Entry
          id="page-index"
          measured={false}
          description={
            <>
              An in-page content index — tracks which heading is currently in view and highlights
              it (the &quot;beacon&quot;), scrolling itself to keep that highlight visible as you
              scroll the page, easing rather than snapping (#46), never fighting a manual scroll of
              the rail itself for 5s (#44). Fades into a scroll &quot;mist&quot; at whichever edge
              still has more headings below the fold (#43), stays a bounded, fixed-height rail
              regardless of how many headings exist (#45), and gains its own search box once the
              list passes 12 headings (#11). By default takes no sections prop: the Packer derives
              them itself by scanning the document&apos;s own doc-section blocks for a heading,
              slugifying each into an anchor id it assigns to that section&apos;s own Heading —
              place one page-index block, get an index of whatever headings actually exist, nothing
              to keep in sync by hand. A page whose content isn&apos;t doc-section-shaped can pass
              an explicit sections list instead (see the shape below). A narrow, sticky side-rail,
              not center-column content — see it working for real, at full 46-heading scale, on{" "}
              <a href="/docs/heuristics" className="rebar-link">/docs/heuristics</a> rather than as
              a cramped inline sample here.
            </>
          }
          shape={`{ type: "page-index", searchPlaceholder?: string, sections?: { id: string, label: string }[] }`}
        />

        <GroupHeading>Feedback &amp; content</GroupHeading>

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
          id="goal-tracker"
          measured={false}
          description="A hierarchical goal/OKR tracker: one Aspiration, several Focus Areas, each holding several Goals — all three levels inline-editable, goals toggle complete with a celebratory confetti burst (TodoItem underneath), and Add/Delete affordances mutate the board locally, the same 'seed local state from the block's own literal data' convention card-kanban uses. Reclassified from a standalone GoalTracker component into this block — the real reusable primitive was the smaller checkable-row control (now TodoItem), not the whole hierarchy; see the Design Heuristics component-vs-block test."
          shape={`{ type: "goal-tracker", aspiration: string, focusAreas: GoalTrackerFocusAreaData[], celebration?: "none" | "small" | "big" }
// GoalTrackerFocusAreaData = { id: string, text: string, goals: GoalTrackerGoalData[] }
// GoalTrackerGoalData = { id: string, text: string, completed: boolean }`}
          blocks={[
            {
              type: "goal-tracker",
              aspiration: "Become the top board network",
              focusAreas: [
                {
                  id: "fa1",
                  text: "Grow membership",
                  goals: [
                    { id: "g1", text: "Reach 500 members", completed: false },
                    { id: "g2", text: "Host 3 events", completed: true },
                  ],
                },
              ],
            },
          ]}
        />

        <Entry
          id="ai-chat"
          measured={false}
          description="A chat surface: ChatThread (the transcript) + AiChatInput (the composer) — the exact composition this project's own AiChatInput reference page already hand-authors. Local-only state seeded from the block's literal messages; sending appends the caller's own new message to the transcript, never fabricating an assistant reply, since this is a static-render demo surface, not a real backend. intent is computed from the current draft text (/ for command, ? for search), not a block-level setting, since it's about what's currently typed."
          shape={`{ type: "ai-chat", title?: string, messages: AiChatMessageData[], placeholder?: string, dictation?: boolean, height?: number }
// AiChatMessageData = { id: string, role: "user" | "assistant", content: string, avatarFallback?: string, avatarSrc?: string, avatarPlaceholder?: boolean }`}
          blocks={[
            {
              type: "ai-chat",
              title: "Support chat",
              messages: [
                { id: "1", role: "assistant", content: "How can I help today?", avatarFallback: "AI" },
                { id: "2", role: "user", content: "My order hasn't arrived yet.", avatarFallback: "JD" },
              ],
            },
          ]}
        />

        <Entry
          id="callout"
          measured
          description="A toned box with a bold title line and an optional secondary subtitle line below it."
          shape={`{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: IconName, title: string, subtitle?: string }`}
          blocks={[{ type: "callout", tone: "warning", icon: "clock", title: "In progress", subtitle: "Some items incomplete." }]}
        />

        <Entry
          id="spin-card"
          measured={false}
          description="A small, centered card showing a real loading overlay (Spin) over a few lines of content — for demonstrating a loading state, not a real data-bound card. Generic rather than one-off: tip, content lines, and card size are all caller-supplied, not hardcoded to any one demo."
          shape={`{ type: "spin-card", tip?: string, items: string[], width?: number, minHeight?: number }`}
          blocks={[{ type: "spin-card", tip: "Fetching", items: ["Project A", "Project B", "Project C"] }]}
        />

        <GroupHeading>Marketing</GroupHeading>

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
                { title: "Tested", body: "Playwright-checked on every change." },
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
              items: [
                { title: "Components", body: "The reference — every real, shipped primitive.", href: "/components", cta: "Browse" },
                { title: "Blocks", body: "Super-components made of real components.", href: "/blocks", cta: "Browse" },
                { title: "Benchmarks", body: "Measured token, speed, and consistency data.", href: "/benchmarks", cta: "Browse" },
              ],
            },
          ]}
        />

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

        <GroupHeading>Data &amp; directories</GroupHeading>

        <Entry
          id="card-grid"
          measured={false}
          description={
            'A wrapping grid of cards — title, optional body copy, optional status tags, optional link — for an index/directory of many similar named things (see the /components page, rebuilt through this block). Distinct from feature-grid (no link, no tags, meant for a handful of short callouts) and pillar-grid (a fixed small set with a mandatory CTA): card-grid is for an open-ended, possibly large list where each item may or may not have a description, a link, or a status yet — see "Design Heuristics" #41 (status is a pill, not label text) and #12 (every card needs its own title/content/action zones, not just a title).'
          }
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

        <Entry
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

        <Entry
          id="table"
          measured={false}
          description="A bordered data table with exactly the columns you give it — no hidden 'show all fields' default. Rows may carry a per-row action button. Wraps the real Table component (sortable columns, on by default) — not a bare hand-rolled <table>, an original gap this block has since been fixed to close. searchPlaceholder adds a box matching any cell; filters adds named exact-match dropdowns, collapsing past 2 into a 'More filters' popover (the same bounded-then-collapse convention nav-bar's own overflow uses). addable/exportable/copyable add a real, working Add-row form, Export-CSV download, and clipboard Copy button — added rows are local-only (not persisted, the same convention card-kanban's board state already uses)."
          shape={`{ type: "table", columns: string[], rows: { cells: string[], actionLabel?: string }[], sortable?: boolean, searchPlaceholder?: string, filters?: { label: string, columnIndex: number, options: string[] }[], addable?: boolean | { label?: string }, exportable?: boolean, copyable?: boolean }`}
          blocks={[
            {
              type: "table",
              columns: ["Team", "Lead", "Status"],
              searchPlaceholder: "Search teams...",
              filters: [{ label: "Status", columnIndex: 2, options: ["Active", "Archived"] }],
              addable: { label: "Add team" },
              exportable: true,
              copyable: true,
              rows: [
                { cells: ["Engineering", "Priya Shah", "Active"], actionLabel: "Select" },
                { cells: ["Design", "Marcus Webb", "Active"], actionLabel: "Select" },
                { cells: ["Platform", "Jordan Lee", "Archived"], actionLabel: "Select" },
              ],
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

        <GroupHeading>Forms &amp; flow</GroupHeading>

        <Entry
          id="form"
          measured={false}
          description="A card containing labeled fields (text/email/date/textarea/select/checkbox, each optionally required) and an optional submit button. Omit submitLabel when the form is nested inside a modal, which supplies its own action buttons."
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
          id="tabs"
          measured={false}
          description="Real Tabs (Radix underneath) — each tab holds its own nested Block[], rendered recursively, so any other block type can live inside a tab panel."
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

        <Stack
          gap="sm"
          id="modal"
          style={{
            borderTop: "1px solid var(--rebar-color-border, #e0e0e0)",
            paddingTop: "var(--rebar-space-lg)",
          }}
        >
          <Stack direction="row" gap="sm" align="center">
            <Heading level={3} style={{ margin: 0 }}>
              <code>modal</code>
            </Heading>
            <Tag tone="warning" style={{ textTransform: "uppercase" }}>
              unmeasured
            </Tag>
          </Stack>
          <Text size="sm" color="secondary">
            A real Dialog (Radix underneath), holding its own nested <code>Block[]</code>, with
            confirm/cancel footer actions. Renders <strong>forced open</strong> — a convention
            for static-render/screenshot contexts (see <a href="/benchmarks/tiers" className="rebar-link">the tier
            benchmarks</a>), not for a normal live page. No live example here on purpose: a
            forced-open modal on a page with other content around it covers the whole page as a
            fixed overlay (learned the hard way, twice — see the{" "}
            <a href="/docs/heuristics#control" className="rebar-link">User control and freedom</a> heuristic). See it
            live, properly triggered and closable three ways, on the{" "}
            <a href="/components/dialog" className="rebar-link">Dialog reference page</a>.
          </Text>
          <Stack gap="xs">
            <Kicker>Shape</Kicker>
            <CodeBlock
              code={`{ type: "modal", title: string, blocks: Block[], confirmLabel?: string, cancelLabel?: string }`}
              language="ts"
            />
          </Stack>
        </Stack>

        <Entry
          id="wizard"
          measured={false}
          description="A multi-step form container — Steps for progress, one step's fields shown at a time, a Back/Next/Submit footer. Next/Submit is disabled until the current step's required fields are filled, not just visually hinted (see the JFace wizard note in ref/HEURISTICS.md). Wraps the real Wizard component (packages/core) rather than inventing a new state model in this package — catalogued as a real risk that this is just Steps + Form composed together, which is exactly why it's a block, not a bespoke primitive."
          shape={`{ type: "wizard", steps: { label: string, description?: string, fields: FormField[] }[], submitLabel?: string, backLabel?: string, nextLabel?: string }`}
          blocks={[
            {
              type: "wizard",
              steps: [
                { label: "Team", fields: [{ kind: "text", label: "Team name", required: true }] },
                { label: "Details", fields: [{ kind: "textarea", label: "Notes" }] },
              ],
            },
          ]}
        />

        <Entry
          id="card-kanban"
          measured={false}
          description="A drag-and-drop card board — title, optional shared-with avatars, a Share action, a search box, and an optional Board settings button (opens a real Dialog around your own nested blocks), all above the real Kanban component (packages/core): arbitrary columns, optional dividers within a column, cards draggable within/across sections and columns, columns themselves draggable to reorder, and per-column/per-section card limits that reject a drop past them. Native HTML5 drag-and-drop — no new dependency, but no keyboard-operable equivalent yet either, a documented gap."
          shape={`{ type: "card-kanban", title: string, sharedWith?: { name: string, avatarSrc?: string }[], shareUrl?: string, columns: KanbanColumnData[], cards: Record<string, KanbanCardData>, searchPlaceholder?: string, settingsBlocks?: Block[] }
// KanbanColumnData = { id: string, title: string, sections: KanbanSectionData[], limit?: number }
// KanbanSectionData = { id: string, label?: string, cardIds: string[], limit?: number }
// KanbanCardData = { id: string, title: string, description?: string, tags?: string[] }`}
          blocks={[
            {
              type: "card-kanban",
              title: "Sprint board",
              sharedWith: [{ name: "Priya Shah" }, { name: "Jae Kim" }],
              columns: [
                { id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: ["spec"] }] },
                { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["ship"], limit: 1 }] },
              ],
              cards: {
                spec: { id: "spec", title: "Write spec", tags: ["docs"] },
                ship: { id: "ship", title: "Ship it" },
              },
            },
          ]}
        />

        <Entry
          id="sticky-kanban"
          measured={false}
          description="The exact same board and chrome as card-kanban — same schema shape, same title/shared-with/Share/search/Board-settings header — with one difference: Kanban's cardVariant=&quot;sticky&quot; instead of the default. Postit-style cards (procedurally varied rotation/shadow, a caller-or-auto-assigned color) capped at 3 per column; click (not drag) opens an edit form for a sticky's title/description/tags/color, resolved against the same drag so a drop never also opens it. A mutation of the same primitive, not a second component."
          shape={`{ type: "sticky-kanban", title: string, sharedWith?: { name: string, avatarSrc?: string }[], shareUrl?: string, columns: KanbanColumnData[], cards: Record<string, KanbanCardData>, searchPlaceholder?: string, settingsBlocks?: Block[] }
// same KanbanColumnData/KanbanSectionData/KanbanCardData shapes as card-kanban, above`}
          blocks={[
            {
              type: "sticky-kanban",
              title: "Retro board",
              columns: [
                { id: "went-well", title: "Went well", sections: [{ id: "went-well-main", cardIds: ["went1"] }] },
                { id: "improve", title: "To improve", sections: [{ id: "improve-main", cardIds: ["improve1"] }] },
              ],
              cards: {
                went1: { id: "went1", title: "Fast turnaround on reviews" },
                improve1: { id: "improve1", title: "Standup ran long" },
              },
            },
          ]}
        />

        <GroupHeading>Docs &amp; reference</GroupHeading>

        <Entry
          id="doc-section"
          measured={false}
          description="A heading (level 1, 2, or 3) plus prose/code/list content — the block type this page and every /docs/* page are (or will be) built from, including each page's own title (level 1) and intro paragraph, not just its subsections. Prose text supports the same tiny inline markup as hero."
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

        <Entry
          id="props-table"
          measured={false}
          description="A component's full prop reference — Prop/Type/Required/Default columns — rendered from already-generated `PropRow[]` data (see apps/docs/scripts/generate-props.mjs), not read from a file by the Packer itself: this package has no dependency on any one consuming app's build output. Used to rebuild this project's own /components/* reference pages through the Packer."
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

        <Entry
          id="heuristic"
          measured={false}
          description="One entry of a heuristics/design-principles page: a heading, a bolded one-line rule, doc-section-style rationale prose (same tiny inline markup), and an optional code sample and/or a real nested live Block[] example. Carries its own stable id rather than slugifying one from title, since existing cross-references or a page-index block's own sections list may already point at a specific hand-picked id. Added to convert this project's own /docs/heuristics off hand-authored JSX — 43 of its 46 entries fit this shape exactly."
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

        <GroupHeading>Embedding &amp; comparison</GroupHeading>

        <Entry
          id="iframe"
          measured={false}
          description="A real <iframe> — a required, not optional, title (an embed with no accessible name is a real, common accessibility gap most iframe usage in the wild gets wrong). No default height, since that depends entirely on context — set one explicitly, or nest it in a comparison block, which measures and applies one automatically."
          shape={`{ type: "iframe", src: string, title: string, height?: number }`}
          blocks={[{ type: "iframe", src: "https://example.com", title: "Example embed" }]}
        />

        <Entry
          id="comparison"
          measured={false}
          description="The first block whose own layout isn't single-column: two labeled panels side by side, each holding its own nested Block[], rendered recursively the same way tabs/modal already nest. Measures the left panel's real rendered height and applies it to the right, so an embedded iframe on either side — which needs an explicit height, unlike normal content — always matches its sibling instead of drifting out of sync. Added to print both sides of this project's own homepage 'build in Rebar, migrate to antd' comparison, see PACKER_COVERAGE.md."
          shape={`{ type: "comparison", leftLabel: string, leftBlocks: Block[], rightLabel: string, rightBlocks: Block[] }`}
          blocks={[
            {
              type: "comparison",
              leftLabel: "Rebar",
              leftBlocks: [{ type: "checklist", heading: "Checklist", items: ["First item", "Second item"] }],
              rightLabel: "Embedded page",
              rightBlocks: [{ type: "iframe", src: "https://example.com", title: "Example embed" }],
            },
          ]}
        />

        <GroupHeading>Charts</GroupHeading>

        <Entry
          id="scatter-chart"
          measured={false}
          description="A distribution scatter plot — each series' individual values plotted as a jittered column of points, with a dashed line marking that series' mean. Wraps the real ScatterChart component with a filter footer (one toggle button per series, click to hide/show it) — never a bare 1:1 pass-through, omitted entirely when there's only one series. Promoted from one-off SVG helpers this project's own /benchmarks pages used to keep locally — see it at real scale there. title renders as a real visible caption per Design Heuristics #16 (charts ship with context); colors default to a small built-in palette when a series omits its own."
          shape={`{ type: "scatter-chart", title?: string, ariaLabel?: string, height?: number, series: { label: string, color?: string, values: number[] }[] }`}
          blocks={[
            {
              type: "scatter-chart",
              title: "Token cost, antd vs. rebar-ui",
              series: [
                { label: "antd", values: [31231, 31131, 30891, 31921, 30950] },
                { label: "rebar-ui", values: [30211, 30212, 30149, 30253, 30180] },
              ],
            },
          ]}
        />

        <Entry
          id="line-chart"
          measured={false}
          description="A multi-series line chart over an ordered x-axis — for cumulative cost/measurement comparisons where one series may overtake another partway through, hence the optional crossoverIndex marker (a dashed vertical line labeled 'crossover'). Wraps the real LineChart component with the same series-toggle filter footer as scatter-chart. Promoted from this project's own /benchmarks iteration experiment."
          shape={`{ type: "line-chart", title?: string, ariaLabel?: string, height?: number, xLabels: string[], labelStep?: number, crossoverIndex?: number, series: { label: string, color?: string, values: number[], dashed?: boolean }[] }`}
          blocks={[
            {
              type: "line-chart",
              title: "Cumulative cost per round",
              xLabels: ["R0", "R1", "R2", "R3"],
              crossoverIndex: 3,
              series: [
                { label: "antd", values: [10, 20, 30, 42] },
                { label: "rebar-ui + migration", values: [22, 28, 35, 40], dashed: true },
              ],
            },
          ]}
        />

        <Entry
          id="stacked-bar-chart"
          measured={false}
          description="A stacked bar chart — each bar broken into labeled cost/quantity segments, with the bar's own total shown above it. Wraps the real StackedBarChart component with a filter footer toggling one distinct segment label across every bar at once (the 'series' here is the repeated category, not one specific bar). Promoted from this project's own /benchmarks 'vibe coding vs. hiring developers' scenario."
          shape={`{ type: "stacked-bar-chart", title?: string, ariaLabel?: string, height?: number, bars: { label: string, segments: { label: string, value: number, color?: string }[] }[] }`}
          blocks={[
            {
              type: "stacked-bar-chart",
              title: "Cost composition",
              bars: [
                {
                  label: "Hire developers",
                  segments: [
                    { label: "Build", value: 16800 },
                    { label: "Revisions", value: 16800 },
                  ],
                },
                {
                  label: "AI-assisted",
                  segments: [{ label: "Oversight", value: 3500 }],
                },
              ],
            },
          ]}
        />
        </Stack>
        <NextBlockRenderer blocks={[{ type: "page-index", sections: BLOCK_TYPES }]} />
      </Stack>
    </Box>
  );
}
