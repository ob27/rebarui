"use client";

import { useState } from "react";
import { Button, Form, FormItem, Heading, Input, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";
import { PropsTable } from "@/components/PropsTable";

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

      <Stack gap="xs">
        <Heading level={2}>Code</Heading>
        <Text
          as="pre"
          size="sm"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          {`<Form<{ email: string }> onSubmit={(values) => save(values.email)}>
  <FormItem name="email" label="Email" required>
    {(field) => <Input type="email" placeholder="you@example.com" {...field} />}
  </FormItem>
  <Button type="submit" variant="primary">Submit</Button>
</Form>`}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Form props</Heading>
        <PropsTable component="Form" />
        <Heading level={2}>FormItem props</Heading>
        <PropsTable component="FormItem" />
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Accessibility</Heading>
        <Text size="sm">
          Label sits above the input (Nielsen: recognition over recall) and is associated via a
          native <code>&lt;label&gt;</code> wrap; required fields show a visible asterisk;
          validation errors render inline below the field with{" "}
          <code>role=&quot;alert&quot;</code> so screen readers announce them immediately.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>data-rebar-* attributes</Heading>
        <Text size="sm">
          <code>data-rebar-component=&quot;form&quot; | &quot;form-item&quot;</code>,{" "}
          <code>data-rebar-part=&quot;label&quot; | &quot;error&quot;</code>.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Migrating to Ant Design</Heading>
        <Text size="sm">
          The most involved migration of the three pages here, because AntD&apos;s{" "}
          <code>Form</code> is a genuinely different runtime (its own form store via{" "}
          <code>Form.useForm()</code>), not just different prop names. The codemod renames{" "}
          <code>onSubmit</code> to <code>onFinish</code> (compatible signature — both{" "}
          <code>(values) =&gt; void</code>), converts <code>FormItem</code> to{" "}
          <code>Form.Item</code>, keeps <code>required</code> and adds a matching{" "}
          <code>rules={"{"}[{"{"} required: true {"}"}]{"}"}</code> (AntD&apos;s actual validation
          lives in <code>rules</code>, not the boolean alone), and unwraps the render-prop
          children pattern into a plain child — <code>Form.Item</code> clones a single direct
          child rather than calling a render function.
        </Text>
      </Stack>
    </Stack>
  );
}
