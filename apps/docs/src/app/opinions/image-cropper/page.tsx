"use client";

import { useState } from "react";
import { Button, Card, Heading, ImageCropper, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<ImageCropper src="/art/grain-dawn.svg" alt="Van livery photo" aspectRatio={1} onCrop={setCropped} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ImageCropper"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="image-cropper"` on the root; parts: `stage`, `rect`, `handle` (each carrying `data-rebar-corner`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated image cropper; a migration typically keeps this exact drag/resize approach and re-skins the Crop button.",
      },
    ],
  },
];


const PHOTO = "/art/grain-dawn.svg";

export default function ImageCropperPage() {
  const harbour = project("harbour");
  const [cropped, setCropped] = useState("");
  const [cover, setCover] = useState("");

  return (
    <Stack gap="lg">
      <Heading level={1}>ImageCropper</Heading>
      <Text color="secondary">Drag the frame to move it, drag a corner to resize, then press Crop.</Text>

      <DemoStage
        title="Crop a van photo"
        caption="Square crop"
        code={CODE}
        widths={false}
        states={[
          { label: "Wide, 16:9", node: <ImageCropper src={PHOTO} alt="Van livery photo" width={150} height={100} aspectRatio={16 / 9} /> },
          { label: "Disabled", node: <ImageCropper src={PHOTO} alt="Van livery photo" width={150} height={100} aspectRatio={1} disabled /> },
          { label: "Custom label", node: <ImageCropper src={PHOTO} alt="Van livery photo" width={150} height={100} cropLabel="Use this crop" /> },
        ]}
      >
        <Stack gap="sm" style={{ alignItems: "flex-start" }}>
          <ImageCropper src={PHOTO} alt="Van livery photo" aspectRatio={1} onCrop={setCropped} />
          {cropped ? <img src={cropped} alt="Cropped result" style={{ width: 120, height: 120, borderRadius: "var(--rebar-radius-md)" }} /> : null}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project cover" caption="Crop the cover before saving it" widths={false}>
        <Card
          title={`${harbour.name} cover`}
          subtitle="Wide crop for the project card"
          actions={[<Button key="save" disabled={!cover}>Save cover</Button>]}
          style={{ maxWidth: 520, margin: "0 auto" }}
        >
          <Stack gap="sm">
            <ImageCropper src={PHOTO} alt="Harbour cover photo" aspectRatio={16 / 9} width={440} height={250} onCrop={setCover} />
            {cover ? <img src={cover} alt="New cover" style={{ width: "100%", maxWidth: 240, borderRadius: "var(--rebar-radius-md)" }} /> : <Text size="sm" color="secondary">Crop to preview the new cover.</Text>}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
