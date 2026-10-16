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
        code: `{ type: "heuristic", id: string, title: string, rule: string, rationale: ProseNode[], code?: string, exampleBlocks?: Block[] }`,
      },
    ],
  },
];

const CODE = `{
  type: "heuristic",
  id: "one-primary-action",
  title: "One primary action",
  rule: "Give each screen one primary button.",
  rationale: [{ kind: "text", text: "Two filled buttons make the crew stop and choose." }],
  exampleBlocks: [{ type: "checklist", heading: "Applied here", items: ["Save changes is filled", "Cancel is outlined"] }],
}`;

export default function HeuristicPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Heuristic</Heading>
      <Text color="secondary">One design rule: a heading, a bold one-line rule, the reasoning, and optional code or a live example.</Text>

      <DemoStage
        title="One primary action"
        caption="Rule, rationale, and a live checklist"
        code={CODE}
        states={[
          {
            label: "Rule only",
            node: (
              <NextBlockRenderer
                blocks={[{ type: "heuristic", id: "short-labels", title: "Short labels", rule: "Name the button for what it does.", rationale: [{ kind: "text", text: "“Save changes” beats “Submit”." }] }]}
              />
            ),
          },
          {
            label: "With code",
            node: (
              <NextBlockRenderer
                blocks={[
                  {
                    type: "heuristic",
                    id: "confirm-destructive",
                    title: "Confirm deletes",
                    rule: "Say what is lost before it goes.",
                    rationale: [{ kind: "text", text: "Name the project and what goes with it." }],
                    code: `<Button variant="destructive">Delete</Button>`,
                  },
                ]}
              />
            ),
          },
        ]}
      >
        <NextBlockRenderer
          blocks={[
            {
              type: "heuristic",
              id: "one-primary-action",
              title: "One primary action",
              rule: "Give each screen one primary button.",
              rationale: [{ kind: "text", text: "Two filled buttons make the crew stop and *choose*. Keep the rest `secondary` or `tertiary`." }],
              exampleBlocks: [{ type: "checklist", heading: "Applied here", items: ["Save changes is filled", "Cancel is outlined", "Delete project is destructive and last"] }],
            },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Design principles page" caption="Heuristics stacked, as on a guidelines page" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "heuristic", id: "plain-dates", title: "Plain dates", rule: "Write “24 Oct”, not “2026-10-24”.", rationale: [{ kind: "text", text: "People read dates; machines get the ISO form in the markup." }] },
            { type: "heuristic", id: "name-the-owner", title: "Name the owner", rule: "Every task shows who has it.", rationale: [{ kind: "text", text: "An avatar and a first name answer “who do I ask?” without opening the task." }] },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
