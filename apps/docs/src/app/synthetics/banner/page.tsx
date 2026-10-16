import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "banner",
  tone: "warning",
  icon: "info",
  text: "Crew interviews are 2 days late.",
  action: { label: "Reschedule", icon: "refresh" },
}`;

const banner = (tone: "info" | "warning" | "success" | "error", text: string, action?: { label: string }): Construct[] => [
  { type: "banner", tone, icon: "info", text, ...(action ? { action } : {}) },
];

const BLOCKS: Construct[] = [
  { type: "doc-section", heading: "Shape", body: [{ kind: "code", code: `{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: IconName, text: string, action?: Action }` }] },
];

export default function BannerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Banner</Heading>
      <Text color="secondary">An inline alert strip: an icon, one line of text and an optional action.</Text>

      <DemoStage
        title="Late project"
        caption="A warning with an action"
        code={CODE}
        states={[
          { label: "Info", node: <NextBlockRenderer blocks={banner("info", "Review on 22 Oct.")} /> },
          { label: "Success", node: <NextBlockRenderer blocks={banner("success", "Rota export shipped.")} /> },
          { label: "Error", node: <NextBlockRenderer blocks={banner("error", "Invoice overdue.")} /> },
          { label: "Long text", node: <NextBlockRenderer blocks={banner("warning", "Offline sync is still in review, so the crew build waits for the 7 Nov release.")} /> },
        ]}
      >
        <NextBlockRenderer
          blocks={[{ type: "banner", tone: "warning", icon: "info", text: "Crew interviews are 2 days late.", action: { label: "Reschedule", icon: "refresh" } }]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="A banner above the project summary" widths={false}>
        <Stack gap="md">
          <NextBlockRenderer blocks={[{ type: "banner", tone: "info", icon: "info", text: "Harbour launch is on 24 Oct, 09:00.", action: { label: "Open checklist" } }]} />
          <Heading level={3}>Harbour rebrand</Heading>
          <Text color="secondary">Identity, site and launch kit for the harbour trust. 84% complete.</Text>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
