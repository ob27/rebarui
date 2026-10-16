import { Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = "{ type: \"wizard\", steps: [{ label: \"Project\", fields: [{ kind: \"text\", label: \"Project name\", required: true }] }], submitLabel: \"Create project\" }";

const LIVE: Construct = {
  type: "wizard",
  steps: [
    { label: "Project", description: "Name and owner", fields: [{ kind: "text", label: "Project name", placeholder: "Harbour rebrand", required: true }, { kind: "select", label: "Team", options: ["Brand", "Product", "Research", "Operations"], required: true }] },
    { label: "Dates", description: "When it ships", fields: [{ kind: "date", label: "Due date", required: true }, { kind: "text", label: "Budget (GBP)", placeholder: "48200" }] },
    { label: "Brief", description: "What it is", fields: [{ kind: "textarea", label: "Summary", placeholder: "Identity, site and launch kit." }, { kind: "checkbox", label: "Notify the team" }] },
  ],
  submitLabel: "Create project",
};
const SHORT: Construct = {
  type: "wizard",
  steps: [
    { label: "Team", fields: [{ kind: "text", label: "Team name", required: true }] },
    { label: "Details", fields: [{ kind: "textarea", label: "Notes" }] },
  ],
};
const CREW_WIZARD: Construct = {
  type: "wizard",
  steps: [
    { label: "Who", fields: [{ kind: "text", label: "Crew member", placeholder: "Niamh Byrne", required: true }, { kind: "select", label: "Role", options: ["Ferry crew", "Night watch", "Dock supervisor"] }] },
    { label: "When", fields: [{ kind: "date", label: "Interview date", required: true }] },
  ],
  submitLabel: "Book interview",
  nextLabel: "Continue",
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Wizard"] ?? [] },
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "text", text: "`{ type: \"wizard\", steps: { label, description?, fields: FormField[] }[], submitLabel?, backLabel?, nextLabel? }`. Next and Submit are really disabled, not just dimmed, until the current step's required fields are filled." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "Same as the core `Wizard`; see its Props." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered; compose AntD's `Steps` and `Form`." }],
  },
];

export default function WizardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Wizard</Heading>
      <Text color="secondary">A multi-step form: step progress, one step at a time, and Back, Next and Submit.</Text>

      <DemoStage title="New project" caption="Next stays disabled until the required fields are filled" code={CODE}
        states={[
          { label: "Two steps", node: <NextBlockRenderer blocks={[SHORT]} /> },
        ]}>
        <NextBlockRenderer blocks={[LIVE]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Invite the crew" caption="Setup inside a dialog-sized card" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Set up crew interviews" subtitle="Twelve calls, ending 21 Oct">
          <NextBlockRenderer blocks={[CREW_WIZARD]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
