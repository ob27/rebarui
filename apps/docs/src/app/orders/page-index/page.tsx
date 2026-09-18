import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A page index — a list of section links for in-page navigation, like a table of contents for a long page.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"page-index\", searchPlaceholder?: string, sections?: { id: string, label: string }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Auto-derived sections",
    body: [
      {
        kind: "text",
        text: "If `sections` is omitted, the Packer derives it automatically from every `doc-section` block's own heading in that same `blocks` array. The rail beside this text uses an explicit list instead — see \"Placement\" below for why — but the auto-derive path is what a page with a single flat `NextBlockRenderer` call and no separate row layout gets for free with zero extra authoring.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Placement is hand-authored, not printed",
    body: [
      {
        kind: "text",
        text: "Unlike every other block, page-index renders a real `position: sticky` element that only works as a *direct* flex item of whatever two-column row the calling page places it beside — that row is deliberately page-chrome the Packer doesn't own, the same convention this project's own /heuristics and /about/benchmarks/scenarios pages use. Splitting the row into two separate `NextBlockRenderer` calls (one per column, as this page and both of those do) also means the auto-derive path above can't see the other column's headings, which is why every real usage on this site passes an explicit `sections` list rather than relying on it.",
      },
    ],
  },
];

export default function PageIndexPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Page Index</Heading>
      <Text color="secondary">
        A page index — a list of section links for in-page navigation, like a table of contents for a long page.
      </Text>
      <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
        <Stack gap="lg" style={{ flex: 1, minWidth: 0 }}>
          <NextBlockRenderer blocks={BLOCKS} />
        </Stack>
        <NextBlockRenderer
          blocks={[
            {
              type: "page-index",
              searchPlaceholder: "Jump to a section...",
              sections: [
                { id: "overview", label: "Overview" },
                { id: "shape", label: "Shape" },
                { id: "auto-derived-sections", label: "Auto-derived sections" },
                { id: "placement-is-hand-authored-not-printed", label: "Placement" },
              ],
            },
          ]}
        />
      </Stack>
    </Stack>
  );
}
