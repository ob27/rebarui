import { Button, Card, Dialog, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `{
  type: "modal",
  title: "Delete Depot signage?",
  blocks: [{ type: "doc-section", body: [{ kind: "text", text: "..." }] }],
  confirmLabel: "Delete",
  cancelLabel: "Keep it",
}`;

/** What the block form looks like as data: it always renders open, so it is shown as source here rather than live. */
const SHOT = [
  {
    type: "modal",
    title: "Delete Depot signage?",
    confirmLabel: "Delete",
    cancelLabel: "Keep it",
    blocks: [{ type: "doc-section", body: [{ kind: "text", text: "21 tasks and 5 files go with it." }] }],
  },
] satisfies Construct[];

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Shape", body: [{ kind: "code", code: '{ type: "modal", title: string, blocks: Construct[], confirmLabel?: string, cancelLabel?: string }' }] },
  { type: "doc-section", heading: "Example block", body: [{ kind: "code", code: JSON.stringify(SHOT, null, 2) }] },
  {
    type: "doc-section",
    heading: "The block always renders open",
    body: [
      {
        kind: "text",
        text: "A `modal` block renders its Dialog with `open` forced true and no close handler, for static renders such as mockups. The live examples here use the real `Dialog` with a trigger button instead.",
      },
    ],
  },
];


export default function ModalPage() {
  const signage = project("signage");
  return (
    <Stack gap="lg">
      <Heading level={1}>Modal</Heading>
      <Text color="secondary">A dialog with a title, body and actions, for confirmations and focused tasks.</Text>

      <DemoStage
        title="Confirm delete"
        caption="Open it, then close with Cancel, the close button, Escape or a click outside"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Informational",
            node: (
              <Dialog trigger={<Button variant="secondary">Release notes</Button>} title="Tideline mobile 0.9" footer={<Button variant="primary">Got it</Button>}>
                <Text>Offline sync for tasks and a quieter inbox.</Text>
              </Dialog>
            ),
          },
          {
            label: "Long title",
            node: (
              <Dialog trigger={<Button variant="secondary">Archive</Button>} title="Archive the Crew interviews project and its twelve calls?" footer={<Button variant="primary">Archive</Button>}>
                <Text>Files stay available under Archive.</Text>
              </Dialog>
            ),
          },
        ]}
      >
        <Dialog
          trigger={<Button variant="destructive">Delete {signage.name}</Button>}
          title={`Delete ${signage.name}?`}
          footer={
            <>
              <Button variant="secondary">Keep it</Button>
              <Button variant="destructive">Delete</Button>
            </>
          }
        >
          <Text>21 tasks and 5 files go with it. This cannot be undone.</Text>
        </Dialog>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project settings" caption="A destructive action behind a confirmation" widths={false}>
        <Card
          style={{ maxWidth: 440, margin: "0 auto" }}
          title={signage.name}
          actions={[
            <Dialog
              key="delete"
              trigger={<Button variant="destructive">Delete project</Button>}
              title={`Delete ${signage.name}?`}
              footer={
                <>
                  <Button variant="secondary">Keep it</Button>
                  <Button variant="destructive">Delete</Button>
                </>
              }
            >
              <Text>21 tasks and 5 files go with it.</Text>
            </Dialog>,
          ]}
        >
          <Text size="sm" color="secondary">{signage.summary} Due {signage.due}.</Text>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
