"use client";

import { useState } from "react";
import { Button, Card, Heading, Lightbox, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const CODE = `<Lightbox
  src="/art/grain-dawn.svg"
  alt="Harbour van livery"
  onCopy={copyLink}
  onDownload={download}
  onDelete={remove}
  moreActions={[{ key: "report", label: "Report image", onSelect: report }]}
/>`;

const PHOTOS = [
  { src: "/art/grain-dawn.svg", alt: "Harbour van livery, rear doors" },
  { src: "/art/grain-sand.svg", alt: "Harbour van livery, side panel" },
  { src: "/art/grain-dusk.svg", alt: "Depot fascia at dusk" },
  { src: "/art/grain-periwinkle.svg", alt: "Mark, stacked, on periwinkle" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Lightbox"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="lightbox"`; parts: `trigger`, `thumbnail`, `image`, `actions`. The fullscreen dialog itself carries `Dialog`\'s own attributes.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD bundles fullscreen preview directly into its own `Image` component (a `preview` prop) rather than as a separate component — a migration typically folds this into that prop instead of keeping a standalone lightbox.",
      },
    ],
  },
];


export default function LightboxPage() {
  const harbour = project("harbour");
  const [last, setLast] = useState("none yet");
  return (
    <Stack gap="lg">
      <Heading level={1}>Lightbox</Heading>
      <Text color="secondary">A thumbnail that opens a full-screen preview, with optional action buttons.</Text>

      <DemoStage
        title="Van livery photos"
        caption={`Last action: ${last}`}
        code={CODE}
        states={[
          { label: "No actions", node: <Lightbox src={PHOTOS[2]!.src} alt={PHOTOS[2]!.alt} /> },
          { label: "Copy and download", node: <Lightbox src={PHOTOS[1]!.src} alt={PHOTOS[1]!.alt} onCopy={() => setLast("copy")} onDownload={() => setLast("download")} /> },
          { label: "Own trigger", node: <Lightbox src={PHOTOS[3]!.src} alt={PHOTOS[3]!.alt} trigger={<Button variant="secondary">Preview mark</Button>} /> },
        ]}
      >
        <Lightbox
          src={PHOTOS[0]!.src}
          alt={PHOTOS[0]!.alt}
          onCopy={() => setLast("copy")}
          onDownload={() => setLast("download")}
          onMove={() => setLast("move")}
          onDelete={() => setLast("delete")}
          moreActions={[{ key: "report", label: "Report image", onSelect: () => setLast("report") }]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="File gallery" caption={`${FILES[1]!.name}, ${FILES[1]!.size}`} widths={false}>
        <Card title={harbour.name} subtitle="Van livery photos" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
            {PHOTOS.map((p) => (
              <Lightbox key={p.src} src={p.src} alt={p.alt} onDownload={() => setLast("download")} />
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
