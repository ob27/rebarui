import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      { kind: "code", code: `{ type: "hero", badge?: string, title: string, subtitle: string, actions?: Action[], codeSnippet?: string }` },
      { kind: "text", text: "Badge and subtitle accept a little inline markup: `code` and [label](href) links." },
    ],
  },
];

const CODE = `{
  type: "hero",
  badge: "Harbour rebrand",
  title: "A new identity for the harbour",
  subtitle: "Mark, site and launch kit, live on 24 Oct.",
  actions: [{ label: "View the kit", variant: "primary" }, { label: "Share feedback", variant: "secondary" }],
}`;

const harbour = project("harbour");

export default function HeroPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Hero</Heading>
      <Text color="secondary">A centred page-top block: badge, title, subtitle, buttons and an optional code line.</Text>

      <DemoStage
        title="Launch hero"
        caption="Badge, title, subtitle, two actions"
        code={CODE}
        states={[
          { label: "Title only", node: <NextBlockRenderer blocks={[{ type: "hero", title: harbour.name, subtitle: harbour.summary }]} /> },
          {
            label: "With a code line",
            node: <NextBlockRenderer blocks={[{ type: "hero", badge: "Tideline mobile", title: "Offline tasks", subtitle: "Works on the quay with no signal.", codeSnippet: "npx tideline sync --offline" }]} />,
          },
        ]}
      >
        <NextBlockRenderer
          blocks={[
            {
              type: "hero",
              badge: "Harbour rebrand",
              title: "A new identity for the harbour",
              subtitle: "Mark, site and launch kit, live on 24 Oct. See the `launch checklist`.",
              actions: [
                { label: "View the kit", variant: "primary" },
                { label: "Share feedback", variant: "secondary" },
              ],
            },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Landing page" caption="Hero, then a section header and three pillars" widths={false}>
        <NextBlockRenderer
          blocks={[
            { type: "hero", badge: "Tideline", title: "The quiet project app for small studios", subtitle: "Tasks, files and a clear week in one place.", actions: [{ label: "Start a project", variant: "primary" }] },
            { type: "section-header", kicker: "What you get", title: "Three things, done well" },
            {
              type: "pillar-grid",
              items: [
                { title: "Tasks", body: "A board the whole crew can read.", href: "/components", cta: "See tasks" },
                { title: "Files", body: "Livery, fascia and rota, filed by project.", href: "/components", cta: "See files" },
                { title: "Chat", body: "Ask what slipped, get an answer.", href: "/components", cta: "See chat" },
              ],
            },
          ]}
        />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
