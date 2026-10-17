"use client";

import { useState } from "react";
import { Button, Heading, Input, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Input type="password" revealable startIcon={<LockIcon />} aria-label="Journal passphrase" />

// controlled, and hide again after 8 s
<Input type="password" revealable={{ visible, onVisibleChange: setVisible }} autoHide />`;

const LABEL = { font: "700 .72rem/1 var(--rebar-font-family-sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" } as const;

const LOCK = (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export function InputMobile() {
  const [visible, setVisible] = useState(false);
  const [a, setA] = useState("journal1");
  const [b, setB] = useState("journal2");
  const mismatch = a !== b;
  return (
    <>
      <Heading level={2}>Password reveal</Heading>
      <DemoStage
        title="Input, revealable"
        caption="An eye toggle at the end of a password field"
        code={CODE}
        widths={false}
        states={[
          { label: "Hidden", node: <Input type="password" revealable startIcon={LOCK} aria-label="Hidden" defaultValue="journal1" /> },
          { label: "Controlled, revealed", node: <Input type="password" revealable={{ visible: true }} startIcon={LOCK} aria-label="Revealed" defaultValue="Rosary-4-Mary" /> },
          { label: "Error", node: <Input type="password" revealable invalid startIcon={LOCK} aria-label="Error" defaultValue="wrongpass" /> },
          { label: "Disabled", node: <Input type="password" revealable disabled startIcon={LOCK} aria-label="Disabled" placeholder="Passphrase" /> },
        ]}
      >
        <div style={{ maxWidth: 420, margin: "0 auto", display: "grid", gap: 8 }}>
          <label htmlFor="pw-demo" style={{ font: "700 .72rem/1 var(--rebar-font-family-sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" }}>Journal passphrase</label>
          <Input id="pw-demo" type="password" revealable={{ visible, onVisibleChange: setVisible }} autoHide startIcon={LOCK} defaultValue="Rosary-4-Mary" />
          <Text size="sm" color="secondary">Only you can read your journal. We cannot reset this.</Text>
        </div>
      </DemoStage>
      <DemoStage title="Unlock and create" caption="In context" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={440} bar={<PhoneBar><TopBar leading="back" title="Reconciliation journal" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text variant="eyebrow">Unlock</Text>
              <Heading level={2}>Enter your passphrase</Heading>
              <Input type="password" revealable startIcon={LOCK} aria-label="Passphrase" defaultValue="Rosary-4-Mary" />
              <Button block>Unlock journal</Button>
              <Button href="#forgot" variant="tertiary" style={{ justifySelf: "center" }}>Forgot your passphrase?</Button>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={440} bar={<PhoneBar><TopBar leading="back" title="Reconciliation journal" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text variant="eyebrow">Create</Text>
              <Heading level={2}>Choose a passphrase</Heading>
              <div style={{ display: "grid", gap: 6 }}>
                <label htmlFor="pw-a" style={LABEL}>Passphrase</label>
                <Input id="pw-a" type="password" revealable startIcon={LOCK} value={a} onChange={(e) => setA(e.target.value)} />
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label htmlFor="pw-b" style={LABEL}>Confirm</label>
                <Input id="pw-b" type="password" revealable startIcon={LOCK} invalid={mismatch} aria-describedby={mismatch ? "pw-b-err" : undefined} value={b} onChange={(e) => setB(e.target.value)} />
                {mismatch ? <Text id="pw-b-err" size="sm" style={{ color: "var(--rebar-color-danger)" }}>The passphrases do not match.</Text> : null}
              </div>
              <Button block disabled={mismatch}>Create journal</Button>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
