"use client";

import { useState } from "react";
import { Heading, SignaturePad, Stack, Text } from "rebar-ui";
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
        code: '<SignaturePad onValueChange={setSignature} aria-label="Sign here" />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SignaturePad"] ?? [] },
  {
    type: "doc-section",
    heading: "Real drawing state, not a mirrored value",
    body: [
      {
        kind: "text",
        text: "A draw-to-sign canvas — Pointer Events (not separate mouse/touch listeners) for unified mouse/pen/touch handling in one code path. `onValueChange` fires once per completed stroke with a PNG data URL, and once on Clear with an empty string; the Clear button itself starts disabled and only enables once there's actually something to clear.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Controlled loading, uncontrolled drawing",
    body: [
      {
        kind: "text",
        text: "`value` is for loading an existing signature (a saved one from a previous session) — set it once to redraw the canvas from that data URL. The component's own strokes update through `onValueChange`, not by feeding back through `value` on every stroke, the same \"only resync when it genuinely differs\" rule `RichTextEditor`'s controlled HTML sync already uses, so drawing never fights a re-render.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="signature-pad"` on the root, present with `data-rebar-empty` while nothing has been drawn; parts: `canvas`, `clear`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated signature-capture component; a migration typically keeps this exact canvas approach and re-skins the Clear button.",
      },
    ],
  },
];

export default function SignaturePadPage() {
  const [signature, setSignature] = useState("");

  return (
    <Stack gap="lg">
      <Heading level={1}>SignaturePad</Heading>
      <Text color="secondary">A draw-to-sign canvas — try signing below.</Text>

      <LivePreview>
        <Stack gap="sm">
          <SignaturePad onValueChange={setSignature} aria-label="Sign here" />
          <Text size="sm" color="secondary">
            {signature ? "Signature captured." : "Nothing drawn yet."}
          </Text>
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
