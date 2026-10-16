import { Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      { kind: "code", code: `{ type: "iframe", src: string, title: string, height?: number }` },
      { kind: "text", text: "`title` is required: it is the embed's accessible name. Set `height` yourself, or put the iframe in a comparison block, which measures one." },
    ],
  },
];

// A self-contained page as a data URL, so the example loads offline and follows the viewer's light or dark scheme.
const PREVIEW =
  "data:text/html;charset=utf-8," +
  encodeURIComponent(
    '<!doctype html><meta name="color-scheme" content="light dark"><body style="font-family:system-ui,sans-serif;margin:24px"><h1 style="margin:0 0 8px;font-size:28px">Harbour rebrand</h1><p>Identity, site and launch kit for the harbour trust. Live on 24 Oct.</p>',
  );

const CODE = `{ type: "iframe", src: "data:text/html,<h1>Harbour rebrand</h1>", title: "Harbour homepage preview", height: 220 }`;

export default function IframePage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Iframe</Heading>
      <Text color="secondary">A real embedded page with a required accessible title.</Text>

      <DemoStage
        title="Homepage preview"
        caption="A page of this site, embedded"
        code={CODE}
        states={[
          { label: "Short (120)", node: <NextBlockRenderer blocks={[{ type: "iframe", src: PREVIEW, title: "Divider, short", height: 120 }]} /> },
          { label: "Tall (320)", node: <NextBlockRenderer blocks={[{ type: "iframe", src: PREVIEW, title: "Divider, tall", height: 320 }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "iframe", src: PREVIEW, title: "Harbour homepage preview", height: 220 }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Design review" caption="The preview inside a project card" widths={false}>
        <Card title={`${harbour.name}: homepage`} subtitle={`Review by ${harbour.due}`}>
          <NextBlockRenderer blocks={[{ type: "iframe", src: PREVIEW, title: "Harbour homepage review", height: 180 }]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
