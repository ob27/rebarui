import { CodeBlock, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { shippedCategory } from "@/data/shippedCategory";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BlockEntry, BlockEntryKicker } from "@/components/BlockEntry";

const CATEGORY_LABEL = { web: "Web", mobile: "Mobile", diagram: "Diagram" } as const;
const CATEGORY_TONE = { web: "info", mobile: "success", diagram: "warning" } as const;

export default function OrdersPage() {
  const names = tierComponentNames("order");

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
      <Heading level={1}>Orders</Heading>
      <Text color="secondary">
        Macro/page-level structural governance — components and blocks that arrange other things
        at a page or app scale (nav bars, sidebars, tab strips that swap whole panels, page-level
        overlay/panel systems, page indexes) rather than carrying their own data-shaped state. Read
        literally, Order looks like a fourth rung of the same Imitation→Synthetic→Opinion
        complexity ladder; it isn&apos;t — it&apos;s a different axis (macro governance vs.
        behavioral complexity), which is why it covers only 8 of the 39 blocks rather than the
        whole placement layer. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for the full nuance.
      </Text>

      <Heading level={2}>Components ({names.length})</Heading>
      <NextBlockRenderer blocks={[grid]} />

      <Heading level={2}>Blocks (8)</Heading>

      <BlockEntry
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
              { label: "Imitations", href: "#" },
              { label: "Opinions", href: "#" },
              { label: "Benchmarks", href: "#" },
              { label: "About", href: "#" },
            ],
          },
        ]}
      />

      <BlockEntry
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

      <BlockEntry
        id="nav-index"
        measured={false}
        description={
          <>
            A vertical link index — once the list passes 12 items, a search box appears, plus a
            real MultiSelect checklist for category and, once items carry more than one distinct
            status, a second, independent one for status. The cross-page counterpart to page-index
            below (this one links to other pages; that one links to headings on the current one).
            A narrow side-rail control, not center-column content — see it working at real scale on
            any tier page&apos;s own sidebar.
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

      <BlockEntry
        id="page-index"
        measured={false}
        description={
          <>
            An in-page content index — tracks which heading is currently in view and highlights it
            (the &quot;beacon&quot;), scrolling itself to keep that highlight visible as you scroll
            the page. Fades into a scroll &quot;mist&quot; at whichever edge still has more
            headings below the fold, stays a bounded, fixed-height rail regardless of how many
            headings exist, and gains its own search box once the list passes 12 headings. By
            default takes no sections prop: the Packer derives them itself by scanning the
            document&apos;s own doc-section blocks for a heading. A narrow, sticky side-rail, not
            center-column content — see it working for real, at full scale, on{" "}
            <a href="/docs/heuristics" className="rebar-link">
              /docs/heuristics
            </a>
            .
          </>
        }
        shape={`{ type: "page-index", searchPlaceholder?: string, sections?: { id: string, label: string }[] }`}
      />

      <BlockEntry
        id="side-panel"
        measured={false}
        description="A persistent, non-modal side panel (the Slack 'thread'/'details' pattern) beside a nested main: Block[] document — no backdrop, the main content stays fully visible and interactive while it's open. Collapses to a slim, always-present rail with a toggle button rather than disappearing entirely. Distinct from modal (a forced-open, backdrop-covering Dialog for static-render contexts only)."
        shape={`{ type: "side-panel", main: Block[], panel: { title: string, blocks: Block[], defaultOpen?: boolean } }`}
        blocks={[
          {
            type: "side-panel",
            main: [{ type: "checklist", heading: "Checklist", items: ["Reviewed", "Approved"] }],
            panel: { title: "Thread", blocks: [{ type: "callout", tone: "info", title: "Alex", subtitle: "Can we ship this Friday?" }] },
          },
        ]}
      />

      <BlockEntry
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
        style={{ borderTop: "1px solid var(--rebar-color-border, #e0e0e0)", paddingTop: "var(--rebar-space-lg)" }}
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
          confirm/cancel footer actions. Renders <strong>forced open</strong> — a convention for
          static-render/screenshot contexts, not for a normal live page. No live example here on
          purpose: a forced-open modal on a page with other content around it covers the whole
          page as a fixed overlay. See it live, properly triggered and closable three ways, on the{" "}
          <a href="/opinions/dialog" className="rebar-link">
            Dialog reference page
          </a>
          .
        </Text>
        <Stack gap="xs">
          <BlockEntryKicker>Shape</BlockEntryKicker>
          <CodeBlock
            code={`{ type: "modal", title: string, blocks: Block[], confirmLabel?: string, cancelLabel?: string }`}
            language="ts"
          />
        </Stack>
      </Stack>

      <BlockEntry
        id="comparison"
        measured={false}
        description="The one block whose own layout isn't single-column: two labeled panels side by side, each holding its own nested Block[], rendered recursively the same way tabs/modal already nest. Measures the left panel's real rendered height and applies it to the right, so an embedded iframe on either side always matches its sibling instead of drifting out of sync."
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
    </Stack>
  );
}
