"use client";

import { useState } from "react";
import { Button, Form, FormItem, Heading, Input, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<Form<{ email: string }> onSubmit={(values) => save(values.email)}>\n  <FormItem name="email" label="Email" required>\n    {(field) => <Input type="email" placeholder="you@example.com" {...field} />}\n  </FormItem>\n  <Button type="submit" variant="primary">Submit</Button>\n</Form>`,
      },
    ],
  },
  { type: "props-table", heading: "Form props", rows: componentProps["Form"] ?? [] },
  { type: "props-table", heading: "FormItem props", rows: componentProps["FormItem"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Label sits above the input (Nielsen: recognition over recall) and is associated via a native `<label>` wrap; required fields show a visible asterisk; validation errors render inline below the field with `role=\"alert\"` so screen readers announce them immediately.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="form" | "form-item"`, `data-rebar-part="label" | "error"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "The most involved migration of the three pages here, because AntD's `Form` is a genuinely different runtime (its own form store via `Form.useForm()`), not just different prop names. The codemod renames `onSubmit` to `onFinish` (compatible signature — both `(values) => void`), converts `FormItem` to `Form.Item`, keeps `required` and adds a matching `rules={[{ required: true }]}` (AntD's actual validation lives in `rules`, not the boolean alone), and unwraps the render-prop children pattern into a plain child — `Form.Item` clones a single direct child rather than calling a render function.",
      },
    ],
  },
];

export default function FormPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <Stack gap="lg">
      <Heading level={1}>Form</Heading>
      <Text color="secondary">
        React Hook Form underneath, exposed as <code>Form</code> + <code>FormItem</code>.{" "}
        <code>FormItem</code> hands its child a plain <code>register()</code>-shaped field object
        via a render-prop, rather than implicit child-cloning — explicit, typed wiring instead of
        magic.
      </Text>

      <LivePreview>
        <Form<{ email: string }> onSubmit={(values) => setSubmitted(values.email)}>
          <FormItem name="email" label="Email" required>
            {(field) => <Input type="email" placeholder="you@example.com" {...field} />}
          </FormItem>
          <Stack direction="row" gap="sm">
            <Button type="submit" variant="primary">
              Submit
            </Button>
            {submitted ? (
              <Text size="sm" color="secondary">
                Submitted: {submitted}
              </Text>
            ) : null}
          </Stack>
        </Form>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
