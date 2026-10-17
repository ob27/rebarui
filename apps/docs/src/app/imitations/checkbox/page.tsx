import { Card, Checkbox, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, project } from "@/fixtures/tideline";

const CODE = `<Checkbox defaultChecked>Include archived projects</Checkbox>
<Checkbox>Notify the team</Checkbox>
<Checkbox checked="indeterminate">Select all tasks</Checkbox>`;

const harbour = project("harbour");
const harbourTasks = TASKS.filter((t) => t.project === harbour.id);
const done = TASKS.filter((t) => t.column === "done").length;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Checkbox"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real Radix checkbox (`role="checkbox"`, Space toggles, a visible focus ring) inside a real `<label>`, so the whole row is the target. `checked="indeterminate"` is announced as mixed. Pass `aria-label` when there is no visible label.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="checkbox"` on the control; `data-rebar-part="indicator"` on the mark, `"label"` on the text; Radix sets `data-state`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Checkbox` takes the same `checked`/`onChange` shape (event-based) and `children` as its label: a close, low-risk rename." }],
  },
  {
    type: "doc-section",
    heading: "Description and card variant",
    body: [
      {
        "kind": "text",
        "text": "`description` adds a secondary line under the label, linked to the checkbox with `aria-describedby`. `variant=\"card\"` makes the whole label a bordered card that tints when checked, for option lists such as plans or permissions."
      },
      {
        "kind": "code",
        "code": "<Checkbox variant=\"card\" description=\"Billed monthly\">Pro plan</Checkbox>"
      }
    ],
  },
];

export default function CheckboxPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Checkbox</Heading>
      <Text color="secondary">Check, clear or mixed.</Text>

      <DemoStage
        title="Checkbox"
        caption="Check, clear, mixed"
        code={CODE}
        states={[
          {
            label: "Error",
            node: (
              <Stack gap="xs">
                <Checkbox aria-invalid="true" style={{ borderColor: "var(--rebar-color-danger)" }}>
                  Accept the terms
                </Checkbox>
                <Text size="xs" style={{ color: "var(--rebar-color-danger)" }}>
                  Required to continue.
                </Text>
              </Stack>
            ),
          },
          { label: "Disabled", node: <Checkbox disabled>Locked by admin</Checkbox> },
          {
            label: "Disabled on",
            node: (
              <Checkbox disabled defaultChecked>
                Required
              </Checkbox>
            ),
          },
          { label: "Long label", node: <Checkbox>Email me when someone mentions me in a {harbour.name} thread</Checkbox> },
        ]}
      >
        <Stack gap="md" style={{ maxWidth: 420, margin: "0 auto" }}>
          <Checkbox defaultChecked>Include archived projects</Checkbox>
          <Checkbox>Notify the team</Checkbox>
          <Checkbox checked="indeterminate">
            <Stack gap="xs">
              <span>Select all tasks</span>
              <Text as="span" size="xs" color="secondary">
                {done} of {TASKS.length} selected
              </Text>
            </Stack>
          </Checkbox>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task checklist" caption="A mixed parent over its tasks">
        <Card
          style={{ maxWidth: 480, margin: "0 auto" }}
          title={
            <Checkbox checked="indeterminate">
              <Stack gap="xs">
                <span>{harbour.name}</span>
                <Text as="span" size="xs" color="secondary">
                  {harbourTasks.length} tasks
                </Text>
              </Stack>
            </Checkbox>
          }
        >
          <Stack gap="md" style={{ paddingLeft: 28 }}>
            {harbourTasks.map((t) => (
              <Checkbox key={t.id} defaultChecked={t.column === "done"}>
                {t.title}
              </Checkbox>
            ))}
          </Stack>
        </Card>
      </DemoStage>

            <Heading level={2}>Native appearance</Heading>
      <DemoStage title="Native" caption={'appearance="native" renders the browser checkbox (sized by --rebar-checkbox-native-size, tinted by --rebar-checkbox-accent); card and label tokens style the row.'} widths={false}
        code={`<Checkbox appearance="native" variant="card">Mandatory Days only</Checkbox>`}
        states={[
          { label: "Checked", node: <Checkbox appearance="native" defaultChecked>Hide past dates</Checkbox> },
          { label: "Indeterminate", node: <Checkbox appearance="native" checked="indeterminate">Some selected</Checkbox> },
          { label: "Disabled", node: <Checkbox appearance="native" disabled>Unavailable</Checkbox> },
        ]}>
        <Stack gap="sm"><Checkbox appearance="native" variant="card">Mandatory Days only</Checkbox><Checkbox appearance="native" variant="card" defaultChecked>Hide past dates</Checkbox></Stack>
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
