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
        text: '`stamp` bakes a small audit line into the bottom-right corner of the image itself, on every capture — the visible "signed by / at" trail real e-signature tools attach. `label` is freeform text the caller supplies directly (a signer name, a document id). `deviceId` is still entirely the caller\'s own responsibility to obtain: nothing in this component can read a real device identifier — browser JS has not been able to read a device\'s MAC address in any browser for a long time, for the obvious privacy reason.',
      },
      {
        kind: "text",
        text: "What SignaturePad *does* own is the keying: pass `deviceId` alongside a secret `deviceKey` and it computes a real `HMAC-SHA256(deviceKey, deviceId)` itself, via the browser's own Web Crypto — not a toy hash, and not something the caller has to get right by hand. `deviceId` alone (no `deviceKey`) is ignored outright, on purpose: stamping an unkeyed identifier in the open is exactly the mistake this exists to prevent, since this field is baked directly into a document image every signer can see — a small keyspace like a MAC address is brute-forceable, and anyone comparing stamps across documents can correlate an unkeyed one without needing to reverse it at all.",
      },
      {
        kind: "text",
        text: "The real tradeoff, stated plainly: this computation runs in the browser, so `deviceKey` is present in the page's own JS at signing time — secret from a casual viewer of the finished, published document (the actual goal), but not cryptographically secret from someone with devtools access to a live signing session. If your threat model needs the key to never reach the browser at all, compute the keyed hash on your own backend instead and pass the result as `label` — this component has never done its own networking and won't start now, so that path stays available alongside this one.",
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
          the same canvas. Every capture bakes a real `HMAC-SHA256(deviceKey, deviceId)` (computed
          by SignaturePad itself, not pre-hashed by this demo) plus a timestamp into the
          bottom-right corner — the fake `deviceId`/`deviceKey` below stand in for values a real
          app would already have.
        </Text>
        <LivePreview>
          <Stack gap="sm">
            <SignaturePad
              allowTypedName
              allowUpload
              stamp={{ deviceId: "demo-browser-session-id", deviceKey: "demo-only-shared-secret-do-not-reuse", timestamp: true }}
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
