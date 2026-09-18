"use client";

import { useState } from "react";
import { Heading, ImageCropper, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<ImageCropper src={photoUrl} aspectRatio={1} onCrop={setCroppedDataUrl} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ImageCropper"] ?? [] },
  {
    type: "doc-section",
    heading: "Drag to move, drag a corner to resize",
    body: [
      {
        kind: "text",
        text: "Real manipulation state — the crop rectangle's own position and size, and which corner (if any) is actively being dragged. Pairs naturally with the existing `FileUpload`/`Image`: crop a freshly uploaded photo before it's saved.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "A deliberate scope simplification",
    body: [
      {
        kind: "text",
        text: 'The source image fills the crop stage via `object-fit: cover` rather than exact letterboxed `contain` math, so container-relative crop-rectangle pixels map onto the image\'s natural pixels with one uniform scale factor — this isn\'t a full photo-editing tool (no zoom, no rotate), the same low-fidelity philosophy that kept `CodeBlock` free of syntax highlighting.',
      },
    ],
  },
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

const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0066cc"/><stop offset="1" stop-color="#8fd3ff"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/><circle cx="480" cy="120" r="60" fill="#fff9c4"/><rect y="360" width="640" height="120" fill="#2e7d32"/></svg>',
  );

export default function ImageCropperPage() {
  const [cropped, setCropped] = useState("");

  return (
    <Stack gap="lg">
      <Heading level={1}>ImageCropper</Heading>
      <Text color="secondary">
        Drag to move, drag a corner to resize — press Crop to see the result below.
      </Text>

      <LivePreview>
        <Stack gap="sm">
          <ImageCropper src={SAMPLE_IMAGE} aspectRatio={1} onCrop={setCropped} />
          {cropped ? (
            <Stack gap="xs">
              <Text size="sm" color="secondary">
                Cropped result:
              </Text>
              <img src={cropped} alt="Cropped result" style={{ width: 120, height: 120, borderRadius: 4 }} />
            </Stack>
          ) : null}
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
