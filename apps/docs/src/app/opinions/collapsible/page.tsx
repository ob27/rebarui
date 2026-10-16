import { Button, Card, Collapsible, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { STATUS_TONE, gbp, project } from "@/fixtures/tideline";

const CODE = `<Collapsible trigger="Show budget details">
  <Text>Budget £48,200, due 24 Oct.</Text>
</Collapsible>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Collapsible"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="collapsible"`, `data-rebar-open` (boolean) on the root; `data-rebar-part="trigger" | "content"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'No direct single-panel equivalent in AntD — its `Collapse` component always uses the same multi-item `items` array `Accordion` maps to. On migration, a lone `Collapsible` becomes a one-item AntD `Collapse` (or a plain conditional render with a button, if pulling in the whole `Collapse` component for one panel feels heavy).',
      },
    ],
  },
];

export default function CollapsiblePage() {
  const p = project("harbour");
  const s = project("signage");
  return (
    <Stack gap="lg">
      <Heading level={1}>Collapsible</Heading>
      <Text color="secondary">One region that opens and closes under a button.</Text>

      <DemoStage
        title="Project details"
        caption="Content leaves the page when closed"
        code={CODE}
        states={[
          {
            label: "Open",
            node: (
              <Collapsible trigger="Budget details" defaultOpen>
                <Text size="sm">{gbp(p.budget)} budget, {p.done}% complete.</Text>
              </Collapsible>
            ),
          },
          { label: "Disabled", node: <Collapsible trigger="Archived notes" disabled><Text size="sm">Nothing here.</Text></Collapsible> },
          {
            label: "Long label",
            node: (
              <Collapsible trigger="Show everything the crew said about the depot signage in the second round of interviews">
                <Text size="sm">Twelve calls, one clear pattern.</Text>
              </Collapsible>
            ),
          },
        ]}
      >
        <Collapsible trigger="Show budget details">
          <Text>
            {gbp(p.budget)} budget for {p.name}, {p.done}% complete, due {p.due}.
          </Text>
        </Collapsible>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="Extra detail tucked under the summary" widths={false}>
        <Card style={{ maxWidth: 460, margin: "0 auto" }} title={s.name} actions={[<Button key="o" variant="secondary">Open project</Button>]}>
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center">
              <Tag tone={STATUS_TONE[s.status]}>{s.status}</Tag>
              <Text size="sm" color="secondary">Due {s.due}</Text>
            </Stack>
            <Text size="sm">{s.summary}</Text>
            <Collapsible trigger="Budget and spend">
              <Text size="sm" color="secondary">{gbp(s.budget)} budget, {s.done}% of the work done.</Text>
            </Collapsible>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
