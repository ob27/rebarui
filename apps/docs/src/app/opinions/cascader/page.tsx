import { Button, Card, Cascader, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, TASKS } from "@/fixtures/tideline";

const CODE = `<Cascader
  options={[{ value: "harbour", label: "Harbour rebrand", children: [{ value: "icons", label: "Icon audit" }] }]}
  onValueChange={(path, labels) => setTarget(path)}
  aria-label="Project and task"
/>`;

/** Project, then task: each project's children are its tasks. */
const OPTIONS = PROJECTS.map((p) => {
  const tasks = TASKS.filter((t) => t.project === p.id);
  return { value: p.id, label: p.name, children: tasks.length ? tasks.map((t) => ({ value: t.id, label: t.title })) : undefined };
});

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Cascader"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="cascader"` on the wrapping row of `Select`s.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: 'Not codemod-covered — AntD\'s `Cascader` renders as a single dropdown with inline panels, a materially different interaction from this component\'s row of separate `Select`s, so this is a rebuild, not a rename.' },
    ],
  },
];

export default function CascaderPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Cascader</Heading>
      <Text color="secondary">Pick a value through levels, one Select per level.</Text>

      <DemoStage
        title="Project, then task"
        caption="Choosing a project fills the second Select"
        code={CODE}
        states={[
          { label: "Preselected, disabled and with a custom placeholder", node: (
            <Stack gap="sm">
              <Cascader options={OPTIONS} defaultValue={["harbour", "palette"]} aria-label="Preselected" />
              <Cascader options={OPTIONS} defaultValue={["mobile", "sync"]} disabled aria-label="Disabled" />
              <Cascader options={OPTIONS} placeholder="Where should it go?" aria-label="Custom" />
            </Stack>
          ) },
        ]}
      >
        <Cascader options={OPTIONS} placeholder="Select…" aria-label="Project and task" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Move a task" caption="Send “Icon audit” to another project" widths={false}>
        <Card
          style={{ maxWidth: 520, margin: "0 auto" }}
          title="Move “Icon audit”"
          actions={[<Button key="c" variant="secondary">Cancel</Button>, <Button key="m">Move task</Button>]}
        >
          <Stack gap="sm">
            <Text size="sm" color="secondary">Currently in Harbour rebrand, To do.</Text>
            <Cascader options={OPTIONS} defaultValue={["mobile"]} aria-label="New location" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
