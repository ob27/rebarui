import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `{ type: "props-table", heading?: string, rows: PropRow[] }
// PropRow = { name: string, type: string, required: boolean, defaultValue: string | null, description: string | null }`,
      },
    ],
  },
];

const CODE = `{
  type: "props-table",
  heading: "ProjectCard props",
  rows: [
    { name: "project", type: "Project", required: true, defaultValue: null, description: "The project to show." },
    { name: "compact", type: "boolean", required: false, defaultValue: "false", description: "Hide the summary." },
  ],
}`;

const ROWS = [
  { name: "project", type: "Project", required: true, defaultValue: null, description: "The project to show." },
  { name: "compact", type: "boolean", required: false, defaultValue: "false", description: "Hide the summary line." },
  { name: "onOpen", type: "(id: string) => void", required: false, defaultValue: null, description: "Called when the card is opened." },
];

export default function PropsTablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Props Table</Heading>
      <Text color="secondary">A component&apos;s props as a table: name, type, required, default.</Text>

      <DemoStage
        title="ProjectCard props"
        caption="Three props, one required"
        code={CODE}
      >
        <NextBlockRenderer blocks={[{ type: "props-table", heading: "ProjectCard props", rows: ROWS }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Reference page" caption="A short intro, then the table" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "doc-section", heading: "ProjectCard", body: [{ kind: "text", text: "Shows a project's name, owner, status and due date." }] },
            { type: "props-table", heading: "Props", rows: ROWS },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
