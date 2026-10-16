import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{ type: "callout", tone: "warning", icon: "clock", title: "Crew interviews are running late", subtitle: "Eight of twelve calls done; four booked for 21 Oct." }`;

const state = (block: Construct): { node: React.ReactNode } => ({ node: <NextBlockRenderer blocks={[block]} /> });

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: IconName, title: string, subtitle?: string }` }],
  },
];

export default function CalloutPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Callout</Heading>
      <Text color="secondary">A toned box with a bold title and an optional subtitle.</Text>

      <DemoStage
        title="Project warning"
        caption="Tone, icon, title and subtitle"
        code={CODE}
        states={[
          { label: "Info", ...state({ type: "callout", tone: "info", title: "Mobile design review", subtitle: "22 Oct, 14:00." }) },
          { label: "Success", ...state({ type: "callout", tone: "success", title: "Rota export shipped" }) },
          { label: "Error", ...state({ type: "callout", tone: "error", title: "Payroll cut-off missed", subtitle: "Next run is 28 Oct." }) },
        ]}
      >
        <NextBlockRenderer
          blocks={[
            {
              type: "callout",
              tone: "warning",
              icon: "clock",
              title: "Crew interviews are running late",
              subtitle: "Eight of twelve calls done; four booked for 21 Oct.",
            },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="A callout above the task list" widths={false}>
        <Stack gap="md" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Heading level={3}>Crew interviews</Heading>
          <NextBlockRenderer blocks={[{ type: "callout", tone: "warning", icon: "clock", title: "Due 17 Oct, now late", subtitle: "Priya Nair is rebooking the last four calls." }]} />
          <Text size="sm" color="secondary">Twelve calls, one clear pattern. 33% complete.</Text>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
