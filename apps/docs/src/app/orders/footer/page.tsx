import { Box, Card, Footer, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<Footer
  label="No more projects"
  content="© 2026 Tideline Studio"
  links={[{ text: "Terms", href: "/terms" }, { text: "Privacy", href: "/privacy" }]}
  chips={[{ text: "Beta" }, { text: "Send feedback", type: "link" }]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Footer"] ?? [] },
  {
    type: "doc-section",
    heading: "Sections",
    body: [
      {
        kind: "text",
        text: "Every section is optional. `links` are real anchors (pass `renderLink` for client-side routing); `chips` are plain tags, or focusable buttons for `type: \"link\"`. `onLinkClick` calls `preventDefault()` first.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="footer"`; `data-rebar-part="label"|"content"|"links"|"chips"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "Ant Design (web) has no equivalent; this ports antd-**mobile**'s `Footer`. Compose `Divider`, plain links and `Tag`." },
    ],
  },
];

const SURFACE = { background: "var(--rebar-color-bg-primary)", border: "1px solid var(--rebar-color-border)", borderRadius: 8, padding: "var(--rebar-space-sm)" } as const;
const S = ({ children }: { children: React.ReactNode }) => <Box style={SURFACE}>{children}</Box>;

export default function FooterPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Footer</Heading>
      <Text color="secondary">Page-bottom chrome: a label, a line of text, links and chips, each optional.</Text>

      <DemoStage
        title="App footer"
        caption="Label, copyright, links and chips"
        code={CODE}
        states={[
          { label: "Label only", node: <Footer label="No more projects" /> },
          { label: "Links only", node: <S><Footer links={[{ text: "Terms", href: "#terms" }, { text: "Privacy", href: "#privacy" }]} /></S> },
          { label: "Chips", node: <S><Footer chips={[{ text: "Beta" }, { text: "Send feedback", type: "link" }]} /></S> },
          { label: "Content only", node: <Footer content="© 2026 Tideline Studio" /> },
        ]}
      >
        <S><Footer
          label="No more projects"
          content="© 2026 Tideline Studio"
          links={[
            { text: "Terms", href: "#terms" },
            { text: "Privacy", href: "#privacy" },
          ]}
          chips={[{ text: "Beta" }, { text: "Send feedback", type: "link" }]}
        /></S>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project list" caption="The footer closes the end of the list" widths={false}>
        <Stack gap="sm" style={{ maxWidth: 460, margin: "0 auto" }}>
          {PROJECTS.slice(0, 3).map((p) => (
            <Card key={p.id} title={p.name}>
              <Text size="sm" color="secondary">{p.summary}</Text>
            </Card>
          ))}
          <S><Footer label="No more projects" links={[{ text: "Archive", href: "#archive" }]} /></S>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
