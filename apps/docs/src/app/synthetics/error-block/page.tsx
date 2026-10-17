import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `{ type: "error-block", status: "disconnected", fullPage: false, title: "You are offline", description: "Tasks keep working. We will sync when the signal is back.", action: { label: "Retry" } }`;

const SHAPE: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ErrorBlock"] ?? [] },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      { kind: "code", code: `{ type: "error-block", status?: "default"|"disconnected"|"empty"|"busy"|"info", title?: string, description?: string, action?: Action, fullPage?: boolean }` },
      { kind: "text", text: "`fullPage` is on by default; set it false for an inline, one-card failure state. `empty` and `info` are neutral: a quiet icon and a tinted panel, no error styling." },
    ],
  },
];

const inline = (b: Record<string, unknown>) => <NextBlockRenderer blocks={[{ type: "error-block", fullPage: false, ...b } as Construct]} />;

export default function ErrorBlockPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Error Block</Heading>
      <Text color="secondary">A whole-page failure or empty state with an optional retry button.</Text>

      <DemoStage
        title="Offline"
        caption="Status picks the icon and wording; action adds a retry"
        code={CODE}
        states={[
          { label: "Default", node: inline({ status: "default", action: { label: "Try again" } }) },
          { label: "Empty", node: inline({ status: "empty", title: "No projects yet", description: "Create one to get the crew started." }) },
          { label: "Busy", node: inline({ status: "busy" }) },
          { label: "Info (neutral)", node: inline({ status: "info", description: "Your library syncs overnight." }) },
        ]}
      >
        {inline({ status: "disconnected", title: "You are offline", description: "Tasks keep working. We will sync when the signal is back.", action: { label: "Retry" } })}
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Inbox on a phone" caption="The crew inbox with no signal" padding="none" widths={false}>
        <Stack direction="row" gap="lg" justify="center" style={{ flexWrap: "wrap", padding: 24 }}>
          <TidelinePhone title="Inbox" tabs={0} height={440}>
            {inline({ status: "disconnected", title: "You are offline", description: "Showing what was saved on 24 Oct.", action: { label: "Retry" } })}
          </TidelinePhone>
          <TidelinePhone title="Projects" tabs={1} height={440}>
            {inline({ status: "empty", title: "No projects yet", description: "Projects you join show up here." })}
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
