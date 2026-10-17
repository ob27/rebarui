"use client";

import { useState } from "react";
import { Button, Card, Heading, Image, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, STATUS_TONE, project } from "@/fixtures/tideline";
import { NewBStages } from "./NewBStages";

const CODE = `<Image src="/art/grain-dawn.svg" alt="Harbour van livery" width={320} height={200} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Image"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="image"` on the root, which also carries `data-rebar-image-status="empty"|"loading"|"loaded"|"error"`; parts: `img`, `loading`, `fallback`, `empty`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Image` is a close structural match for the loading/error states — `src`/`alt`/`fallback` map directly. AntD's `Image` also bundles a built-in fullscreen preview; this project keeps that as a separate `Lightbox` component instead of merging the two concerns.",
      },
    ],
  },
];


export default function ImagePage() {
  const harbour = project("harbour");
  const [key, setKey] = useState(0);
  return (
    <Stack gap="lg">
      <Heading level={1}>Image</Heading>
      <Text color="secondary">An image with a loading state, an error fallback and an empty state.</Text>

      <DemoStage
        title="Van livery"
        caption="Loads with a spinner, and shows a fallback if the source fails"
        code={CODE}
        states={[
          { label: "No source yet", node: <Image alt="Livery photo, not uploaded yet" width={200} height={130} /> },
          { label: "Small", node: <Image src="/art/grain-sand.svg" alt="Mark, stacked" width={96} height={64} /> },
        ]}
      >
        <Stack gap="sm" style={{ alignItems: "flex-start" }}>
          <Image key={key} src="/art/grain-dawn.svg" alt="Harbour van livery" width={320} height={200} />
          <Button variant="tertiary" size="sm" onClick={() => setKey((k) => k + 1)}>
            Reload
          </Button>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="A cover image, and the empty state when there is none" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <Card
            cover={<Image src="/art/grain-sand.svg" alt={`${harbour.name} cover`} width={280} height={150} />}
            title={harbour.name}
            subtitle={harbour.kicker}
            labels={[{ label: harbour.status, tone: STATUS_TONE[harbour.status] }]}
            style={{ width: 280 }}
          >
            <Text size="sm" color="secondary">{harbour.summary}</Text>
          </Card>
          <Card
            cover={<Image alt="No cover yet" width={280} height={150} />}
            title={FILES[1]!.name}
            subtitle={FILES[1]!.size}
            style={{ width: 280 }}
          >
            <Tag>No cover yet</Tag>
          </Card>
        </Stack>
      </DemoStage>

      <NewBStages />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
