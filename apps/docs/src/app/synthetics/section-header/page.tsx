import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "section-header", kicker?: string, title: string, subtitle?: string }` }],
  },
];

const CODE = `{
  type: "section-header",
  kicker: "This week",
  title: "Harbour launch on 24 Oct",
  subtitle: "Three tasks left on the checklist.",
}`;

export default function SectionHeaderPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Section Header</Heading>
      <Text color="secondary">A centred small label, title and subtitle that opens a section of a page.</Text>

      <DemoStage
        title="Section opener"
        caption="Kicker, title, subtitle"
        code={CODE}
        states={[
          { label: "Title only", node: <NextBlockRenderer blocks={[{ type: "section-header", title: "Projects" }]} /> },
          { label: "No kicker", node: <NextBlockRenderer blocks={[{ type: "section-header", title: harbour.name, subtitle: harbour.summary }]} /> },
          { label: "Long title", node: <NextBlockRenderer blocks={[{ type: "section-header", kicker: "Research", title: "What twelve crew interviews told us about the quiet hours on the harbour", subtitle: "One clear pattern." }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "section-header", kicker: "This week", title: "Harbour launch on 24 Oct", subtitle: "Three tasks left on the checklist." }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Between sections" caption="Opening the next band of a page" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "section-header", kicker: "Projects", title: "Five in flight", subtitle: "From brand to the northern depots." },
            { type: "pillar-grid", items: [{ title: harbour.name, body: harbour.summary, href: "/components", cta: "Open" }, { title: "Tideline mobile", body: "Offline tasks and a quiet inbox for the crew.", href: "/components", cta: "Open" }] },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
