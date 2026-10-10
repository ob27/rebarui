"use client";

import { EmailCapture, Heading, Stack, Text } from "rebar-ui";
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
        code: `<EmailCapture\n  onSubmit={async (email) => {\n    const res = await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) });\n    if (!res.ok) throw new Error("failed"); // any throw or rejection shows the error state\n  }}\n  submitLabel="Notify me"\n  helperText="We will only email you about the launch."\n/>`,
      },
    ],
  },
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
  return (
    <Stack gap="lg">
      <Heading level={1}>EmailCapture</Heading>
      <Text color="secondary">
        A one-field sign-up form: validation, a submit state machine and an accessible result
        message. The caller owns the network call.
      </Text>

      <LivePreview>
        <Stack gap="lg">
          <EmailCapture
            onSubmit={() => new Promise<void>((resolve) => setTimeout(resolve, 600))}
            helperText="Demo: succeeds after a short delay."
          />
          <EmailCapture
            onSubmit={() => Promise.reject(new Error("demo failure"))}
            submitLabel="Always fails"
            helperText="Demo: always shows the error state."
          />
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
