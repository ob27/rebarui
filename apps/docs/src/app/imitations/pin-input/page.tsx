"use client";

import { Button, Card, Heading, PinInput, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<PinInput length={6} onComplete={(code) => verify(code)} />
<PinInput length={4} mask />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PinInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Behavior",
    body: [
      {
        kind: "list",
        items: [
          "Typing a digit auto-advances focus to the next box",
          "Backspace on an empty box moves focus back to the previous one",
          "Pasting a full code splits it across every box starting from the focused one",
          "`onComplete` fires once, only when every box is filled",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The whole set is a real `role="group"` with a label; each box is labeled `Digit N of length` for screen readers, since a bare unlabeled sequence of inputs gives no sense of position or total count.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="pin-input"`; `data-rebar-part="digit"` on each box.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's `Input.OTP` is the closest equivalent, with a different prop shape (a single `length` and `formatter` rather than this component's per-box rendering).",
      },
    ],
  },
];

export default function PinInputPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PinInput</Heading>
      <Text color="secondary">Single-digit boxes for a confirmation code.</Text>

      <DemoStage title="Sign-in code" caption="Six digits, auto-advance, paste a whole code" code={CODE} widths={false}
        states={[
          { label: "Masked", node: <PinInput length={4} mask aria-label="Door PIN" /> },
          { label: "Prefilled", node: <PinInput length={6} defaultValue="4829" aria-label="Partly entered code" /> },
          { label: "Disabled", node: <PinInput length={6} disabled aria-label="Locked code" /> },
        ]}
      >
        <PinInput length={6} aria-label="Sign-in code" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Confirm it is you" caption="A code sent to Maya before the Harbour launch kit unlocks" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title="Check your email" actions={[<Button key="verify">Verify</Button>, <Button key="resend" variant="tertiary">Send a new code</Button>]}>
          <Stack gap="md">
            <Text size="sm" color="secondary">We sent a six-digit code to maya@tideline.example. It lasts ten minutes.</Text>
            <PinInput length={6} aria-label="Email code" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
