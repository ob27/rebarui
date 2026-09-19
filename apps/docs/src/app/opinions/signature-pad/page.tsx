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
    heading: "Three ways to capture a signature",
    body: [
      {
        kind: "text",
        text: 'Drawing is the default, always-available path. `allowUpload` adds an "Upload" button for an existing signature image (scaled to fit the canvas, same as loading an external `value`). `allowTypedName` adds a text input that renders the typed name onto the canvas live, in a cursive font (`typedNameFont`, a plain system cursive stack by default — deliberately not a bundled web font, matching this library\'s headless-first convention). All three write to the same `value`/`onValueChange` — a caller drawing after typing, or typing after uploading, just keeps adding to (or replacing) the same canvas.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Turning it into an e-signature: stamp",
    body: [
      {
        kind: "text",
        text: '`stamp={{ label, timestamp }}` bakes a small audit line into the bottom-right corner of the image itself, on every capture — the visible "signed by / at" trail real e-signature tools attach. `label` is entirely the caller\'s own responsibility to compute: nothing in this component can read a real device identifier — browser JS has not been able to read a device\'s MAC address in any browser for a long time, for the obvious privacy reason. Pass whatever identifier your own app already has instead (a session id, a server-issued device hash, a signer\'s account id) — the demo below uses a fake one for illustration.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="signature-pad"` on the root, present with `data-rebar-empty` while nothing has been drawn; parts: `typed-name`, `canvas`, `actions`, `clear`, `upload`.',
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
  const [eSignature, setESignature] = useState("");

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

      <Stack gap="sm">
        <Heading level={3}>Example: draw, type, or upload — stamped into an e-signature</Heading>
        <Text size="sm" color="secondary">
          Draw with your pointer, type a name in the field above the canvas (rendered in a
          cursive font), or click Upload to pick an existing signature image — all three land in
          the same canvas, and every capture bakes a device-hash-like label plus a timestamp into
          the bottom-right corner.
        </Text>
        <LivePreview>
          <Stack gap="sm">
            <SignaturePad
              allowTypedName
              allowUpload
              stamp={{ label: "device:4f2a9c1e", timestamp: true }}
              onValueChange={setESignature}
              aria-label="e-signature"
            />
            <Text size="sm" color="secondary">
              {eSignature ? "E-signature captured, stamp baked in." : "Nothing captured yet."}
            </Text>
          </Stack>
        </LivePreview>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
