import { Button, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "header", title: string, action?: Action }` }],
  },
];

const block = (title: string, action = true): Construct[] => [{ type: "header", title, ...(action ? { action: { icon: "close", label: "Close" } } : {}) }];

export default function HeaderPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Header</Heading>
      <Text color="secondary">A title bar row: a heading with an optional close button.</Text>

      <DemoStage
        title="Panel header"
        caption="Title on the left, close on the right"
        code={`{ type: "header", title: "Edit project", action: { icon: "close", label: "Close" } }`}
        states={[
          { label: "No action", node: <NextBlockRenderer blocks={block("Crew interviews", false)} /> },
          { label: "Long title", node: <NextBlockRenderer blocks={block("Harbour rebrand: launch checklist, icon audit and homepage review")} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "header", title: "Edit project", action: { icon: "close", label: "Close" } }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Side panel" caption="The header closes the panel; the form follows" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="md">
            <NextBlockRenderer blocks={block(harbour.name)} />
            <Text size="sm" color="secondary">{harbour.summary}</Text>
            <Stack direction="row" gap="sm">
              <Button>Save changes</Button>
              <Button variant="secondary">Cancel</Button>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
