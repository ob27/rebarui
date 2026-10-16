"use client";

import { useState } from "react";
import { Button, Card, Heading, SignaturePad, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES } from "@/fixtures/tideline";

const CODE = `const [signature, setSignature] = useState("");

<SignaturePad onValueChange={setSignature} aria-label="Sign here" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SignaturePad"] ?? [] },
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
  const [approval, setApproval] = useState("");
  return (
    <Stack gap="lg">
      <Heading level={1}>SignaturePad</Heading>
      <Text color="secondary">A canvas to sign on, with optional typed-name and upload paths.</Text>

      <DemoStage
        title="Sign here"
        caption="Draw with a pointer or finger"
        code={CODE}
        states={[
          { label: "Typed or uploaded", node: <SignaturePad allowTypedName allowUpload defaultTypedName="Maya Chen" aria-label="Signature" /> },
          { label: "With stamp", node: <SignaturePad allowTypedName stamp={{ deviceId: "maya-laptop", deviceKey: "tideline-demo", timestamp: true }} aria-label="Stamped signature" /> },
          { label: "Disabled", node: <SignaturePad disabled aria-label="Signature, disabled" /> },
        ]}
      >
        <Stack gap="sm">
          <SignaturePad onValueChange={setSignature} aria-label="Sign here" />
          <Text size="sm" color="secondary">{signature ? "Signature captured." : "Nothing drawn yet."}</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Approve artwork" caption="Sign-off is blocked until there is a signature" widths={false}>
        <Card
          style={{ maxWidth: 520, margin: "0 auto" }}
          title="Approve depot fascia"
          subtitle={`${FILES[0].name}, ${FILES[0].size}`}
          extra={<Tag tone="info">Review</Tag>}
          actions={[<Button key="back" variant="secondary">Request changes</Button>, <Button key="ok" disabled={!approval}>Approve</Button>]}
        >
          <Stack gap="sm">
            <Text size="sm" color="secondary">Signing approves the artwork for print at the three northern depots.</Text>
            <SignaturePad onValueChange={setApproval} aria-label="Approval signature" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
