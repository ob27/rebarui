import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `{
  type: "page-index",
  searchPlaceholder: "Jump to a section...",
  sections: [{ id: "summary", label: "Summary" }, { id: "tasks", label: "Tasks" }],
}`;

const harbour = project("harbour");

const CONTENT: Construct[] = [
  { type: "doc-section", heading: "Summary", body: [{ kind: "text", text: `${harbour.summary} ${harbour.done}% complete, due ${harbour.due}.` }] },
  { type: "doc-section", heading: "Tasks", body: [{ kind: "list", items: ["Brand palette (done)", "Harbour homepage (in progress)", "Icon audit", "Draft launch checklist"] }] },
  { type: "doc-section", heading: "Files", body: [{ kind: "text", text: "Van livery photos and the stacked mark." }] },
  { type: "doc-section", heading: "Team", body: [{ kind: "text", text: "Maya Chen owns it, with Priya Nair on the checklist." }] },
];

const INDEX: Construct[] = [
  {
    type: "page-index",
    searchPlaceholder: "Jump to a section...",
    sections: [
      { id: "summary", label: "Summary" },
      { id: "tasks", label: "Tasks" },
      { id: "files", label: "Files" },
      { id: "team", label: "Team" },
    ],
  },
];

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Shape", body: [{ kind: "code", code: '{ type: "page-index", searchPlaceholder?: string, sections?: { id: string, label: string }[] }' }] },
  {
    type: "doc-section",
    heading: "Sections",
    body: [
      {
        kind: "text",
        text: "Leave `sections` out and the Packer derives it from the `doc-section` headings in the same `blocks` array. When the content and the index live in separate columns, pass an explicit list.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Placement",
    body: [{ kind: "text", text: "The index is `position: sticky`, so it must be a direct flex item of a two-column row that the page itself lays out." }],
  },
];

export default function PageIndexPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Page Index</Heading>
      <Text color="secondary">A list of section links for in-page navigation, like a table of contents.</Text>

      <DemoStage title="Project page" caption="Content on the left, the index on the right" code={CODE} widths={false}>
        <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
          <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            <NextBlockRenderer blocks={CONTENT} />
          </Stack>
          <NextBlockRenderer blocks={INDEX} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Interview log" caption="The same two-column row on another page" widths={false}>
        <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
          <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            <NextBlockRenderer
              blocks={[
                { type: "doc-section", heading: "Interviews", body: [{ kind: "text", text: "Twelve calls with harbour crew, nine done." }] },
                { type: "doc-section", heading: "Patterns", body: [{ kind: "text", text: "Shift handover is the shared pain point." }] },
              ]}
            />
          </Stack>
          <NextBlockRenderer blocks={[{ type: "page-index", sections: [{ id: "interviews", label: "Interviews" }, { id: "patterns", label: "Patterns" }] }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
