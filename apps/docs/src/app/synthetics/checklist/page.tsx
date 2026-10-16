import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{ type: "checklist", heading: "Harbour launch checklist", items: ["Sign off the brand palette", "Publish the homepage", "Print the van livery"] }`;

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "checklist", heading?: string, items: string[] }` }],
  },
];

export default function ChecklistPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Checklist</Heading>
      <Text color="secondary">A heading followed by a stack of checkable rows.</Text>

      <DemoStage
        title="Launch checklist"
        caption="Tick items off as they are done"
        code={CODE}
        states={[
          { label: "No heading", node: <NextBlockRenderer blocks={[{ type: "checklist", items: ["Book crew interviews", "Icon audit"] }]} /> },
          { label: "Long item", node: <NextBlockRenderer blocks={[{ type: "checklist", heading: "Handover", items: ["Send the signed-off fascia artwork to Northern Print Co. before the 23 Oct proof deadline"] }]} /> },
        ]}
      >
        <NextBlockRenderer
          blocks={[{ type: "checklist", heading: "Harbour launch checklist", items: ["Sign off the brand palette", "Publish the homepage", "Print the van livery", "Brief the harbour office"] }]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch day" caption="Next to the project summary" widths={false}>
        <Stack gap="md" style={{ maxWidth: 520, margin: "0 auto" }}>
          <Heading level={3}>Harbour rebrand, 24 Oct</Heading>
          <Text size="sm" color="secondary">Maya Chen owns launch day. 84% complete.</Text>
          <NextBlockRenderer blocks={[{ type: "checklist", heading: "Before 09:00", items: ["Switch the DNS", "Check the van livery photos", "Post to the crew inbox"] }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
