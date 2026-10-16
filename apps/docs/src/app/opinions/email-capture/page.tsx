"use client";

import { Button, Card, EmailCapture, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<EmailCapture
  onSubmit={async (email) => {
    const res = await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) });
    if (!res.ok) throw new Error("failed"); // any throw shows the error state
  }}
  submitLabel="Notify me"
  helperText="We will only email you about the launch."
/>`;

const later = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["EmailCapture"] ?? [] },
  {
    type: "doc-section",
    heading: "States",
    body: [
      {
        kind: "text",
        text: "`data-rebar-state` is `idle`, `submitting`, `success` or `error`. Client-side validation runs first: an empty or malformed address stays `idle`, marks the input `aria-invalid`, links the inline message with `aria-describedby`, and moves focus back to the input. `onSubmit` is only called with a trimmed, valid address. A rejected promise or a throw becomes `error` (the address is kept so the person can retry); success clears the input. The component never touches the network itself.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The input has a real `<label>`, visually hidden by default; add `data-rebar-label-visible` to the form to show it. Success and error messages go in a `role=\"status\"` `aria-live=\"polite\"` region that is always in the DOM, so they are announced when they appear. The submit button is disabled while submitting, and a second submit during that time is ignored.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="email-capture"` and `data-rebar-state` on the root form; `data-rebar-part` values `label`, `row`, `helper`, `error` and `status` (the status carries `data-rebar-tone` of `success` or `error`). The input and button are the real `Input` and `Button` components.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. The nearest Ant Design shape is a `Form` with one `Form.Item` of type `email` plus `Space.Compact`; the submit state machine has to be rewritten by hand. The `email-capture` placement block binds `onSubmit` through `BlockRenderer`'s `handlers` prop.",
      },
    ],
  },
];

export default function EmailCapturePage() {
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>EmailCapture</Heading>
      <Text color="secondary">A one-field sign-up form with validation and a result message.</Text>

      <DemoStage
        title="Launch list"
        caption="Submits after a short delay; try a bad address first"
        code={CODE}
        widths={false}
        states={[
          { label: "Always fails", node: <EmailCapture onSubmit={() => Promise.reject(new Error("offline"))} submitLabel="Notify me" helperText="Shows the error state and keeps the address." /> },
          { label: "Custom messages", node: <EmailCapture onSubmit={later} label="Work email" placeholder="you@tideline.studio" submitLabel="Join" successMessage="You are on the list." helperText="Crew only." /> },
        ]}
      >
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <EmailCapture onSubmit={later} submitLabel="Notify me" helperText="We will only email you about the launch." />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Beta sign-up" caption="On a project landing panel" widths={false}>
        <Card className="cs-grain" style={{ maxWidth: 560, margin: "0 auto", padding: 32 }}>
          <Stack gap="md">
            <Text size="xs" color="secondary" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>{mobile.kicker}</Text>
            <Heading level={2}>{mobile.name}, in beta from {mobile.due}</Heading>
            <Text color="secondary">{mobile.summary}</Text>
            <EmailCapture onSubmit={later} submitLabel="Get early access" />
            <Button variant="tertiary">See what is in the beta</Button>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
