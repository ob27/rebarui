import { Alert, Button, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, TASKS, person, project } from "@/fixtures/tideline";

const CODE = `<Alert type="info" title="Harbour launch moved">Now Friday 24 Oct, 09:00.</Alert>
<Alert type="success" title="Rota exported">14 shifts sent to Leo Santos.</Alert>
<Alert type="warning" title="Two tasks are due today">Offline sync and Harbour homepage.</Alert>
<Alert type="error" title="Export failed">The depot list has no postcodes.</Alert>`;

const launch = EVENTS[0]!;
const leo = person("leo");
const doing = TASKS.filter((t) => t.column === "doing");

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Alert"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`error` and `warning` render `role="alert"` (announced at once); `info` and `success` render `role="status"` (announced politely). The tone is never the only signal: say it in the title.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="alert"` with `data-rebar-type` set to the current type; `data-rebar-part="title"`, `"description"`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "AntD's `Alert` takes the same `type` values with a `message`/`description` split (here `title`/`children`): a close, low-risk rename." },
    ],
  },
];

export default function AlertPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Alert</Heading>
      <Text color="secondary">An inline message with a status.</Text>

      <DemoStage
        title="Project alerts"
        caption="Info, success, warning, error"
        code={CODE}
        states={[
          { label: "Title only", node: <Alert type="info" title="Saved" /> },
          {
            label: "With action",
            node: (
              <Alert type="warning" title="Sync paused">
                <Stack direction="row" gap="sm" align="center" justify="between" style={{ flexWrap: "wrap" }}>
                  <Text size="sm">Tasks on this phone are not backed up.</Text>
                  <Button size="sm" variant="secondary">
                    Resume
                  </Button>
                </Stack>
              </Alert>
            ),
          },
          {
            label: "Long text",
            node: (
              <Alert type="error" title="Could not reach the crew calendar for the northern depots">
                Check the connection and try again in a few minutes.
              </Alert>
            ),
          },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 680, margin: "0 auto" }}>
          <Alert type="info" title={`${launch.title} moved`}>
            Now Friday {launch.date}, {launch.time}.
          </Alert>
          <Alert type="success" title="Rota exported">
            14 shifts sent to {leo.name}.
          </Alert>
          <Alert type="warning" title="Two tasks are due today">
            {doing.map((t) => t.title).join(" and ")}.
          </Alert>
          <Alert type="error" title="Export failed">
            The depot list has no postcodes.
          </Alert>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Rota export" caption="A warning above the actions it changes">
        <Card title={project("rota").name} actions={[<Button key="fix">Fix clashes</Button>, <Button key="export" variant="secondary">Export anyway</Button>]}>
          <Alert type="warning" title={`${leo.name} has two clashes`}>
            Tue 22 Oct, 07:00 and 15:00.
          </Alert>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
