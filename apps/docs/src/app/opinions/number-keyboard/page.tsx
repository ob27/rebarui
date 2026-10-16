"use client";

import { useState } from "react";
import { Button, Heading, NumberKeyboard, Stack, Text } from "rebar-ui";
import type { NumberKeyboardProps } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { gbp } from "@/fixtures/tideline";

const CODE = `<NumberKeyboard
  open={open}
  onOpenChange={setOpen}
  title="Enter PIN"
  onInput={(digit) => setPin((p) => (p.length < 4 ? p + digit : p))}
  onDelete={() => setPin((p) => p.slice(0, -1))}
  onConfirm={() => setOpen(false)}
  randomOrder
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NumberKeyboard"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="number-keyboard"` on the keypad grid (the sheet itself carries `BottomSheet`\'s own `data-rebar-component="bottom-sheet"`); parts: `key`, `custom-key`, `delete-key`, `confirm`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — the antd-mobile pattern, no direct AntD desktop equivalent (a desktop form just uses the browser's own numeric input).",
      },
    ],
  },
];


type Variant = Partial<Pick<NumberKeyboardProps, "customKey" | "randomOrder" | "confirmLabel" | "title">>;

/** A button that opens its own keyboard, collecting the typed digits next to it. */
function KeypadDemo({ label, variant, max = 4 }: { label: string; variant?: Variant; max?: number }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  return (
    <Stack gap="xs" style={{ alignItems: "flex-start" }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{label}</Button>
      <Text size="sm" color="secondary">{text || "Nothing typed"}</Text>
      <NumberKeyboard
        open={open}
        onOpenChange={setOpen}
        title={variant?.title ?? label}
        onInput={(d) => setText((t) => (t.length < max ? t + d : t))}
        onDelete={() => setText((t) => t.slice(0, -1))}
        onConfirm={() => setOpen(false)}
        {...variant}
      />
    </Stack>
  );
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "<"];

/** The keypad as it sits in the phone's sheet (drawn from Buttons, since the real sheet portals to the viewport). */
function SheetKeys() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {DIGITS.map((d, i) => (d === "" ? <span key={i} /> : <Button key={d} variant="tertiary" size="sm" aria-label={d === "<" ? "Delete" : d}>{d === "<" ? "Del" : d}</Button>))}
    </div>
  );
}

function PinDots({ filled }: { filled: number }) {
  return (
    <Stack direction="row" gap="sm" style={{ justifyContent: "center", margin: "28px 0 8px" }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} aria-hidden="true" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--rebar-color-primary)", background: i < filled ? "var(--rebar-color-primary)" : "transparent" }} />
      ))}
    </Stack>
  );
}

export default function NumberKeyboardPage() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <Stack gap="lg">
      <Heading level={1}>NumberKeyboard</Heading>
      <Text color="secondary">An on-screen numeric keypad in a bottom sheet, for PINs and amounts.</Text>

      <DemoStage
        title="Unlock Tideline"
        caption="Four digits, keys shuffled each time it opens"
        code={CODE}
        widths={false}
        states={[
          { label: "Decimal key", node: <KeypadDemo label="Enter amount" variant={{ customKey: ".", confirmLabel: "Add" }} max={8} /> },
          { label: "Fixed order", node: <KeypadDemo label="Enter code" variant={{ randomOrder: false }} /> },
          { label: "Confirm label", node: <KeypadDemo label="Rota PIN" variant={{ confirmLabel: "Unlock", randomOrder: true }} /> },
        ]}
      >
        <Stack gap="md" style={{ alignItems: "flex-start" }}>
          <Text style={{ fontFamily: "var(--rebar-font-family-mono, monospace)", fontSize: 24, letterSpacing: "0.3em" }}>{pin.padEnd(4, "-").slice(0, 4)}</Text>
          <Button onClick={() => setOpen(true)}>Enter PIN</Button>
          <NumberKeyboard
            open={open}
            onOpenChange={setOpen}
            title="Enter PIN"
            onInput={(digit) => setPin((prev) => (prev.length < 4 ? prev + digit : prev))}
            onDelete={() => setPin((prev) => prev.slice(0, -1))}
            onConfirm={() => setOpen(false)}
            confirmLabel="Done"
            randomOrder
          />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="PIN lock, and an amount entry for an expense" widths={false} padding="none">
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", padding: 24 }}>
          <TidelinePhone title="Unlock Tideline" height={480} dim overlay={<PhoneSheet label="Enter your PIN" footer={<Button style={{ width: "100%" }}>Done</Button>}><SheetKeys /></PhoneSheet>}>
            <PinDots filled={3} />
            <Text size="sm" color="secondary" style={{ textAlign: "center" }}>Crew inbox is locked on this phone.</Text>
          </TidelinePhone>
          <TidelinePhone title="Log expense" height={480} tabs={1} overlay={null}>
            <Stack gap="sm" style={{ marginTop: 20, alignItems: "center" }}>
              <Text size="xs" color="secondary">Quay Marine Supplies</Text>
              <Text style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 34, fontWeight: "var(--rebar-font-weight-semibold)" }}>{gbp(1240)}</Text>
              <KeypadDemo label="Change amount" variant={{ customKey: ".", confirmLabel: "Save" }} max={8} />
            </Stack>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
