import { Box, Card, Heading, Spin, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { SectionNav } from "@/components/SectionNav";

const SECTIONS = [
  { id: "recognition", label: "Recognition over recall" },
  { id: "consistency", label: "Consistency and standards" },
  { id: "proximity", label: "Proximity and grouping" },
  { id: "control", label: "User control and freedom" },
  { id: "layers", label: "Clear layer separation" },
  { id: "minimalist", label: "Aesthetic and minimalist" },
  { id: "space-dense", label: "Space-dense content" },
  { id: "index", label: "Long-page navigation" },
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

function Example({
  id,
  title,
  rule,
  rationale,
  code,
  blocks,
}: {
  id: string;
  title: string;
  rule: string;
  rationale: string;
  code: string;
  blocks: Block[];
}) {
  return (
    <Stack gap="sm" id={id}>
      <Heading level={2}>{title}</Heading>
      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {rule}
      </Text>
      <Text size="sm" color="secondary">
        {rationale}
      </Text>
      <Code>{code}</Code>
      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <NextBlockRenderer blocks={blocks} />
      </Box>
    </Stack>
  );
}

export default function HeuristicsPage() {
  return (
    <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
      <Stack gap="lg" style={{ flex: 1, minWidth: 0 }}>
        <Stack gap="sm">
          <Heading level={1}>Design heuristics, applied by the DSL Packer</Heading>
          <Text color="secondary">
            The design rules below (full list, with sourcing, in{" "}
            <code>ref/HEURISTICS.md</code>) aren&apos;t just written guidance — they&apos;re what
            the <strong>RebarUI DSL Packer</strong> (<code>@rebar-ui/placement</code>&apos;s{" "}
            <code>BlockRenderer</code>) actually does when it lays a screen out from a plain{" "}
            <code>Block[]</code> document: given a list of named archetypes and their content, it
            packs them onto the screen the way these rules say to, every time, without the author
            making a single layout decision. Each rule below shows the real JSON fed in and the
            real component tree it produces — not a mockup of what it would do. For the complete
            list of archetypes the Packer understands, independent of any one heuristic, see the{" "}
            <a href="/docs/archetypes" className="rebar-link">archetype library</a>.
          </Text>
        </Stack>

        <Example
          id="recognition"
          title="Recognition over recall"
          rule="Labels above inputs, visible options over hidden menus."
          rationale="From Nielsen's usability heuristics: a user shouldn't have to remember what a field expects — the label is always visible, always above the field it describes, in every form the Packer renders, because the form archetype has no code path that renders it any other way."
          code={`[
  {
    type: "form",
    heading: "Account Settings",
    fields: [
      { kind: "text", label: "Display name", placeholder: "e.g. Jane Doe" },
      { kind: "email", label: "Email address" },
    ],
    submitLabel: "Save changes",
  },
]`}
          blocks={[
            {
              type: "form",
              heading: "Account Settings",
              fields: [
                { kind: "text", label: "Display name", placeholder: "e.g. Jane Doe" },
                { kind: "email", label: "Email address" },
              ],
              submitLabel: "Save changes",
            },
          ]}
        />

        <Example
          id="consistency"
          title="Consistency and standards"
          rule="One token set, one spacing scale, applied identically — no per-block one-off values."
          rationale="Two completely different archetypes below (a callout and a data-list) share the exact same spacing rhythm and type scale, because neither one specifies its own — the Packer reads all of it from the same --rebar-* custom properties, so nothing here can drift out of sync as content changes."
          code={`[
  { type: "callout", tone: "info", title: "Heads up", subtitle: "Archived projects are read-only." },
  {
    type: "data-list",
    items: [
      { title: "Marketing Site Redesign", badge: "Active" },
      { title: "Legacy API Migration", badge: "Archived" },
    ],
  },
]`}
          blocks={[
            { type: "callout", tone: "info", title: "Heads up", subtitle: "Archived projects are read-only." },
            {
              type: "data-list",
              items: [
                { title: "Marketing Site Redesign", badge: "Active" },
                { title: "Legacy API Migration", badge: "Archived" },
              ],
            },
          ]}
        />

        <Example
          id="proximity"
          title="Proximity, similarity, closure (Gestalt)"
          rule="Related items read as one group; the grouping comes from spacing and repetition, not a manual border or label."
          rationale="A checklist's items are visibly one set purely because of consistent spacing and identical card styling — Gestalt's proximity and similarity principles at work structurally, not left to per-app judgment the way a hand-authored layout could get wrong."
          code={`[
  {
    type: "checklist",
    heading: "Pre-launch checklist",
    items: ["Design review complete", "Accessibility audit passed", "Staging tested"],
  },
]`}
          blocks={[
            {
              type: "checklist",
              heading: "Pre-launch checklist",
              items: ["Design review complete", "Accessibility audit passed", "Staging tested"],
            },
          ]}
        />

        <Stack gap="sm" id="control">
          <Heading level={2}>User control and freedom</Heading>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Every modal is closable via a close button, backdrop click, and Esc — never a dead
            end.
          </Text>
          <Text size="sm" color="secondary">
            The <code>modal</code> archetype (shown below as JSON — one of the six added for the{" "}
            <a href="/benchmarks" className="rebar-link">tier benchmarks</a>) renders a real Dialog underneath (Radix
            UI), which wires all three closing mechanisms itself. It&apos;s deliberately rendered
            already-open for a static screenshot in a benchmark context, which is exactly wrong
            for a live documentation page stacked with other examples — a forced-open modal would
            cover this entire page as a fixed overlay. The <a href="/components/dialog" className="rebar-link">Dialog
            reference page</a> shows the real, normally-triggered version live: click it, then try
            closing it all three ways.
          </Text>
          <Code>{`{
  type: "modal",
  title: "Confirm onboarding",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  blocks: [
    { type: "callout", tone: "warning", title: "Are you sure?", subtitle: "This will onboard the selected employee." },
  ],
}`}</Code>
        </Stack>

        <Stack gap="sm" id="layers">
          <Heading level={2}>Clear layer separation</Heading>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Whenever content renders in front of other content, the two need their own distinct
            visual surface — not just z-index stacking.
          </Text>
          <Text size="sm" color="secondary">
            This is Material Design&apos;s elevation system made explicit: a shadow, a scrim, or a
            background color change is what tells a viewer which layer is in front — z-index alone
            is invisible. Found concretely in <code>Spin</code>: its loading overlay originally had
            no background of its own, just a bare icon and label floating directly on top of the
            dimmed content underneath, with nothing marking it as a separate surface. Fixed by
            giving the overlay a real background (via <code>color-mix()</code> against the existing{" "}
            <code>--rebar-color-bg-primary</code> token, so it automatically resolves to the right
            light/dark shade — component styles reference tokens, themes own the actual colors,
            never the other way around), the same treatment <code>Dialog</code>&apos;s backdrop and{" "}
            <code>Dropdown</code>&apos;s panel already had.
          </Text>
          <Code>{`<Spin spinning tip="Fetching">
  <Stack gap="sm">
    <Text size="sm">Project A</Text>
    <Text size="sm">Project B</Text>
  </Stack>
</Spin>`}</Code>
          <Box
            style={{
              border: "1px solid var(--rebar-color-border, #e0e0e0)",
              borderRadius: 4,
              padding: "var(--rebar-space-lg)",
            }}
          >
            <Card style={{ width: 220, minHeight: 120, margin: "0 auto" }}>
              <Spin spinning tip="Fetching">
                <Stack gap="sm">
                  <Text size="sm">Project A</Text>
                  <Text size="sm">Project B</Text>
                  <Text size="sm">Project C</Text>
                </Stack>
              </Spin>
            </Card>
          </Box>
        </Stack>

        <Example
          id="minimalist"
          title="Aesthetic and minimalist design"
          rule="Show only what's relevant by default — a bounded column set, not every possible field at once."
          rationale="The table archetype takes exactly the columns you give it — there's no 'show all fields' default to opt out of, so a Packer-rendered table never dumps more than the author actually asked for."
          code={`[
  {
    type: "table",
    columns: ["Team", "Lead"],
    rows: [
      { cells: ["Engineering", "Priya Shah"], actionLabel: "Select" },
      { cells: ["Design", "Marcus Webb"], actionLabel: "Select" },
    ],
  },
]`}
          blocks={[
            {
              type: "table",
              columns: ["Team", "Lead"],
              rows: [
                { cells: ["Engineering", "Priya Shah"], actionLabel: "Select" },
                { cells: ["Design", "Marcus Webb"], actionLabel: "Select" },
              ],
            },
          ]}
        />

        <Stack gap="sm" id="space-dense">
          <Heading level={2}>Space-dense content on a text-dominant page</Heading>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            More than ~4 non-text elements in a row goes in a space-minimizing container, not an
            inline grid.
          </Text>
          <Text size="sm" color="secondary">
            This isn&apos;t a <code>Block</code> archetype (the Packer doesn&apos;t currently lay
            out photo galleries), but the rule is applied literally everywhere on this site itself
            that has one — every screenshot gallery on <a href="/benchmarks" className="rebar-link">/benchmarks</a>, and
            the reference examples on the <a href="/components/carousel" className="rebar-link">Carousel</a> and{" "}
            <a href="/components/aspect-ratio" className="rebar-link">AspectRatio</a> pages, use{" "}
            <code>Carousel</code> instead of a grid, specifically because a wall of thumbnails
            works against minimalism (heuristic #8) rather than serving it.
          </Text>
        </Stack>

        <Stack gap="sm" id="index">
          <Heading level={2}>Long text-dominant pages need a section index</Heading>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            More than 3 top-level headings gets an in-page index — on the right, since the left is
            reserved for cross-page site navigation.
          </Text>
          <Text size="sm" color="secondary">
            This page has seven headings — look to the right (or, on a narrow screen, notice
            there&apos;s no index nav shown at all, per the same heuristic&apos;s own responsive
            behavior). That&apos;s not a coincidence: this page is applying the rule to itself
            while explaining it, the same &quot;proof by existence&quot; discipline the rest of
            this site follows.
          </Text>
        </Stack>
      </Stack>
      <SectionNav sections={SECTIONS} />
    </Stack>
  );
}
