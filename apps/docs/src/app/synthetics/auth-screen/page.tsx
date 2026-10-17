"use client";

import { useState } from "react";
import { AuthScreen, Button, Checkbox, Heading, Input, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<AuthScreen tone="navy" logo={<Wordmark />} footer={<Button variant="tertiary">Don’t have an account? Sign up</Button>} busy={busy}>
  <Input type="email" placeholder="Email" />
  <Input type="password" placeholder="Password" />
  <Button loading={busy}>Sign in</Button>
</AuthScreen>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AuthScreen"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A `<section>` with one `h1` (the title). The form column is a real `<fieldset>`, so `busy` disables every field in it natively and sets `aria-busy` on the screen. Footer links keep a 44px target. `progress` renders a `role="progressbar"` with "Step 2 of 3" as its name. Put `role="alert"` on error text you place in the form so a screen reader announces it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="auth-screen"`, `data-rebar-tone="navy" | "cream"`, `data-rebar-align="center" | "start"`, `data-rebar-busy`. Parts: `header`, `main`, `logo`, `progress`, `title`, `description`, `form`, `footer`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "No AntD equivalent: build it from a `Layout`, `Typography.Title` and a `Form`. The shell is layout only, so the form children carry over unchanged." }],
  },
  {
    type: "doc-section",
    heading: 'Classic appearances (opt-in)',
    body: [{ kind: "text", text: '`backdrop={{ image, overlay }}` paints a cover photo under a gradient (`--rebar-auth-backdrop-*`). `fieldStyle="translucent"` makes glass fields, `buttonStyle="classic"` compact pills (cream primary, outlined secondary, pressed overlay), `linkStyle="plain"` small plain ghost links, `footerPlacement="inline"` puts the footer in the column, `frame="column"` a centred 480px column, `columnWidth` caps the reading column, `lead` adds content above the title. Spacing, title, description, field and link values come from `--rebar-auth-*` tokens (padding, gap, form-gap, form-max-width, logo-display, title-size, description-*, field-*, footer-*, link-*). Defaults are unchanged.' }],
  },
];

const wordmark = (
  <span style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 28, fontWeight: 600 }}>
    <i style={{ color: "var(--rebar-color-primary)" }}>A</i>thic.
  </span>
);
const link = (text: string) => (
  <Button variant="tertiary" size="sm">
    {text}
  </Button>
);
const noBar = <span aria-hidden="true" />;

function SignIn({ tone, busy, error }: { tone: "navy" | "cream"; busy?: boolean; error?: boolean }) {
  return (
    <AuthScreen tone={tone} logo={wordmark} busy={busy} footer={<>{link("Don’t have an account? Sign up")}{link("Back")}</>}>
      <Input type="email" placeholder="Email" aria-label="Email" defaultValue={busy || error ? "maria@example.com" : ""} invalid={error} />
      <Input type="password" placeholder="Password" aria-label="Password" defaultValue={busy || error ? "password1" : ""} invalid={error} />
      {error ? (
        <Text size="sm" role="alert" style={{ color: "var(--rebar-color-danger)" }}>
          Incorrect email or password.
        </Text>
      ) : null}
      <Button loading={busy}>{busy ? "Signing in" : "Sign in"}</Button>
      <Button variant="secondary" disabled={busy}>Continue with Google</Button>
    </AuthScreen>
  );
}

function Agreements({ accepted }: { accepted: boolean }) {
  return (
    <AuthScreen
      align="start"
      logo={wordmark}
      title="Before you continue"
      description="Please review and accept the following."
      footer={
        <Button style={{ width: "100%" }} disabled={!accepted}>
          Accept and continue
        </Button>
      }
    >
      <Checkbox defaultChecked>I agree to the Terms of Service</Checkbox>
      <Text size="sm" color="secondary">
        We store your account details, conversations and journal entries to run Athic. Your reconciliation journal is encrypted on your device and only you can read it.
      </Text>
      <Checkbox defaultChecked={accepted}>I have read the Privacy Policy</Checkbox>
    </AuthScreen>
  );
}

function Gate({ unlock, mismatch }: { unlock?: boolean; mismatch?: boolean }) {
  return unlock ? (
    <AuthScreen align="start" header={<div style={{ padding: "10px 14px", fontWeight: 600 }}>Reconciliation</div>} title="Enter your Reconciliation passphrase" description="The same passphrase you set up, on any device. It’s checked here only, never stored." footer={<Button style={{ width: "100%" }}>Unlock</Button>}>
      <Input type="password" placeholder="Passphrase" aria-label="Passphrase" defaultValue="saint-monica-1" />
      {link("Forgot your passphrase?")}
    </AuthScreen>
  ) : (
    <AuthScreen
      align="start"
      header={<div style={{ padding: "10px 14px", fontWeight: 600 }}>Reconciliation</div>}
      progress={{ label: "Set up", value: 2, total: 2 }}
      title="Round-trip encrypted"
      description="Choose a passphrase, separate from your login password. It encrypts every entry on this device before it is sent."
      footer={<Button style={{ width: "100%" }}>Set passphrase and continue</Button>}
    >
      <Input type="password" placeholder="Choose a passphrase" aria-label="Choose a passphrase" defaultValue="saint-monica-1" />
      <Input type="password" placeholder="Confirm passphrase" aria-label="Confirm passphrase" defaultValue={mismatch ? "saint-monica-2" : "saint-monica-1"} invalid={mismatch} />
      {mismatch ? (
        <Text size="sm" role="alert" style={{ color: "var(--rebar-color-danger)" }}>
          The two passphrases don’t match.
        </Text>
      ) : null}
    </AuthScreen>
  );
}

function DeleteSheet({ step }: { step: "password" | "typed" }) {
  return (
    <TidelinePhone
      title="Your account"
      dim
      height={470}
      padding={0}
      overlay={
        <PhoneSheet title="Delete your account">
          <Stack gap="sm">
            <Text size="sm" color="secondary">
              {step === "password" ? "This permanently deletes every discussion, reflection and journal entry. This cannot be undone. First, verify it’s really you." : "Type your email address (maria@example.com) to confirm."}
            </Text>
            {step === "password" ? <Input type="password" placeholder="Your password" aria-label="Your password" /> : <Input type="email" placeholder="Email address" aria-label="Email address" defaultValue="maria@example.com" />}
            <Button variant="destructive">{step === "password" ? "Confirm" : "Permanently delete my account"}</Button>
            <Button variant="tertiary">Cancel</Button>
          </Stack>
        </PhoneSheet>
      }
    >
      <Heading level={2}>Your account</Heading>
    </TidelinePhone>
  );
}

export default function AuthScreenPage() {
  const [busy, setBusy] = useState(false);
  const submit = () => {
    setBusy(true);
    window.setTimeout(() => setBusy(false), 1600);
  };
  return (
    <Stack gap="lg">
      <Heading level={1}>AuthScreen</Heading>
      <Text color="secondary">A full-screen gate: logo, title, form column, ghost footer links. Sign-in, consent, passphrase and delete-confirm are the same shell with different children.</Text>

      <DemoStage
        title="Sign-in"
        caption="Navy tone; Sign in locks the form for a moment"
        code={CODE}
        widths={false}
      >
        <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
          <TidelinePhone bar={noBar} height={520} padding={0}>
            <AuthScreen tone="navy" logo={wordmark} busy={busy} footer={<>{link("Don’t have an account? Sign up")}{link("Back")}</>}>
              <Input type="email" placeholder="Email" aria-label="Email" />
              <Input type="password" placeholder="Password" aria-label="Password" />
              <Button loading={busy} onClick={submit}>{busy ? "Signing in" : "Sign in"}</Button>
              <Button variant="secondary">Continue with Google</Button>
            </AuthScreen>
          </TidelinePhone>
        </div>
      </DemoStage>

      <DemoStage title="Sign-in states" caption="Cream tone, error, busy" widths={false}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone bar={noBar} height={520} padding={0}><SignIn tone="cream" /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0}><SignIn tone="navy" error /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0}><SignIn tone="navy" busy /></TidelinePhone>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Consent, 4 steps" caption="Cream, start-aligned for the long step" widths={false}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}>
            <AuthScreen title="What’s your date of birth?" description="We ask to confirm you’re old enough to use Athic." logo={wordmark} footer={link("Sign out")}>
              <Input placeholder="dd / mm / yyyy" aria-label="Date of birth" defaultValue="12 / 03 / 1994" />
              <Button>Continue</Button>
            </AuthScreen>
          </TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}><Agreements accepted /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}>
            <AuthScreen title="We’re sorry" description="You need to be at least 13 to use Athic right now." logo={wordmark}>
              <Button>Sign out</Button>
            </AuthScreen>
          </TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}>
            <AuthScreen title="We couldn’t load this" description="Check your connection and try again." logo={wordmark}>
              <Text size="sm" role="alert" style={{ color: "var(--rebar-color-danger)", textAlign: "center" }}>Agreements unavailable (offline).</Text>
              <Button>Try again</Button>
              <Button variant="secondary">Sign out</Button>
            </AuthScreen>
          </TidelinePhone>
        </div>
      </DemoStage>

      <DemoStage title="Passphrase gate, 5 steps" caption="The header slot holds the screen’s own bar; progress adds the step bars" widths={false}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}><Gate /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}><Gate unlock /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0} width={250}><Gate mismatch /></TidelinePhone>
        </div>
      </DemoStage>

      <DemoStage title="Delete-confirm" caption="The same form column inside a sheet over the account screen" widths={false}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <DeleteSheet step="password" />
          <DeleteSheet step="typed" />
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
