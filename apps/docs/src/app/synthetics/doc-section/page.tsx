import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "doc-section",
  heading: "Handover notes",
  body: [
    { kind: "text", text: "Priya Nair's interview log is in the \`Crew interviews\` folder." },
    { kind: "list", items: ["Read the summary", "Book the last four calls"] },
  ],
}`;

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `{ type: "doc-section", heading?: string, level?: 1 | 2 | 3, body: ProseNode[] }
// ProseNode = { kind: "text", text: string }
//           | { kind: "code", code: string }
//           | { kind: "list", items: string[], ordered?: boolean }`,
      },
      { kind: "text", text: "Text supports `inline code` and `[links](/path)`." },
    ],
  },
];

export default function DocSectionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Doc Section</Heading>
      <Text color="secondary">A heading with prose, code or list content: the block every docs page is made of.</Text>

      <DemoStage
        title="Handover notes"
        caption="Text with inline code, then a list"
        code={CODE}
        states={[
          { label: "Ordered list", node: <NextBlockRenderer blocks={[{ type: "doc-section", heading: "Steps", level: 3, body: [{ kind: "list", ordered: true, items: ["Export the rota", "Send it to payroll"] }] }]} /> },
          { label: "Code", node: <NextBlockRenderer blocks={[{ type: "doc-section", heading: "Command", level: 3, body: [{ kind: "code", code: "tideline export --week 19-oct" }] }]} /> },
          { label: "No heading", node: <NextBlockRenderer blocks={[{ type: "doc-section", body: [{ kind: "text", text: "Twelve calls, one clear pattern." }] }]} /> },
        ]}
      >
        <NextBlockRenderer
          blocks={[
            {
              type: "doc-section",
              heading: "Handover notes",
              body: [
                { kind: "text", text: "Priya Nair's interview log is in the `Crew interviews` folder." },
                { kind: "list", items: ["Read the summary", "Book the last four calls"] },
              ],
            },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Help article" caption="Two sections, level 1 then level 2" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "doc-section", heading: "Exporting the rota", level: 1, body: [{ kind: "text", text: "Shifts go to payroll without the spreadsheet." }] },
            { type: "doc-section", heading: "Before you start", level: 2, body: [{ kind: "list", items: ["Confirm the week", "Check the cut-off on 28 Oct"] }] },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
