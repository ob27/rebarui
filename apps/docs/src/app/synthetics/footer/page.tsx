import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `{
  type: "footer",
  label: "No more projects",
  content: "© 2026 Tideline Studio",
  links: [{ text: "Terms", href: "#" }, { text: "Privacy", href: "#" }],
  chips: [{ text: "New" }, { text: "Send feedback", type: "link" }],
}`;

const FULL: Construct = {
  type: "footer",
  label: "No more projects",
  content: "© 2026 Tideline Studio",
  links: [
    { text: "Terms", href: "#" },
    { text: "Privacy", href: "#" },
  ],
  chips: [{ text: "New" }, { text: "Send feedback", type: "link" }],
};

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      { kind: "code", code: `{ type: "footer", label?: string, content?: string, links?: { text: string, href: string }[], chips?: { text: string, type?: "plain"|"link" }[] }` },
      { kind: "text", text: "Every section is optional. There are no click handlers in the schema, because a handler is not serializable block data." },
    ],
  },
];

export default function FooterPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Footer</Heading>
      <Text color="secondary">Page-bottom chrome: an end-of-list label, a content line, links and chips.</Text>

      <DemoStage
        title="List footer"
        caption="End label, copyright, links and chips"
        code={CODE}
        states={[
          { label: "Label only", node: <NextBlockRenderer blocks={[{ type: "footer", label: "No more projects" }]} /> },
          { label: "Links only", node: <NextBlockRenderer blocks={[{ type: "footer", links: [{ text: "Terms", href: "#" }, { text: "Privacy", href: "#" }] }]} /> },
          { label: "Content only", node: <NextBlockRenderer blocks={[{ type: "footer", content: "© 2026 Tideline Studio" }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[FULL]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="End of the projects list" caption="Under the last project on a phone" padding="none" widths={false}>
        <Stack direction="row" gap="lg" justify="center" style={{ padding: 24 }}>
          <TidelinePhone title="Projects" tabs={1} height={560}>
            <Stack gap="sm">
              <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>Depot signage</Text>
              <Text size="sm" color="secondary">Wayfinding for the three northern depots.</Text>
              <NextBlockRenderer blocks={[FULL]} />
            </Stack>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
