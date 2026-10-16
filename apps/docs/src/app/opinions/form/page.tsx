"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Avatar, Button, Card, DeviceFrame, Form, FormItem, Heading, Input, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<Form defaultValues={{ name: "Harbour rebrand", owner: "Maya Chen", due: "24 Oct" }} onSubmit={save}>
  <FormItem name="name" label="Project name" required>
    {(field) => <Input {...field} />}
  </FormItem>
  <FormItem name="owner" label="Owner">
    {(field) => <Input {...field} />}
  </FormItem>
  <FormItem name="due" label="Due date">
    {(field) => <Input {...field} placeholder="DD/MM/YYYY" />}
  </FormItem>
  <Button type="submit">Save changes</Button>
</Form>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Form props", rows: componentProps["Form"] ?? [] },
  { type: "props-table", heading: "FormItem props", rows: componentProps["FormItem"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<form>` (`noValidate`, so the library's own messages show instead of the browser's). Each `FormItem` renders a `<label for>` tied to its control by `name`, marks a required field with an asterisk, and announces its error through `role=\"alert\"`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="form"` on the form; `data-rebar-component="form-item"` on each item with `data-rebar-part="label" | "error"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Form` and `Form.Item` take `name`, `label` and `rules` in the same shape; `onSubmit` becomes `onFinish`, and the render-prop child becomes a plain child control." }],
  },
];

function Help({ children }: { children: ReactNode }) {
  return (
    <Text size="xs" color="secondary" style={{ marginTop: -4 }}>
      {children}
    </Text>
  );
}

/** Runs validation once on mount so a state can show its error without a click. */
function ValidateOnMount({ trigger }: { trigger: () => Promise<boolean> }) {
  useEffect(() => {
    void trigger();
  }, [trigger]);
  return null;
}

export default function FormPage() {
  const harbour = project("harbour");
  const [saved, setSaved] = useState<string | null>(null);
  const [invited, setInvited] = useState<string | null>(null);

  return (
    <Stack gap="lg">
      <Heading level={1}>Form</Heading>
      <Text color="secondary">Labels, hints, errors, one save.</Text>

      <DemoStage
        title="Edit project"
        caption="Required marks, helper text, inline errors on save"
        code={CODE}
        states={[
          {
            label: "Error",
            node: (
              <Form onSubmit={() => {}} defaultValues={{ name: "" }}>
                {(methods) => (
                  <>
                    <ValidateOnMount trigger={methods.trigger} />
                    <FormItem name="name" label="Project name" required>
                      {(field) => <Input {...field} />}
                    </FormItem>
                  </>
                )}
              </Form>
            ),
          },
          {
            label: "Helper",
            node: (
              <Form onSubmit={() => {}} defaultValues={{ slug: "harbour-rebrand" }}>
                <FormItem name="slug" label="Slug">
                  {(field) => <Input {...field} />}
                </FormItem>
                <Help>Used in links.</Help>
              </Form>
            ),
          },
          {
            label: "Disabled",
            node: (
              <Form onSubmit={() => {}} defaultValues={{ owner: person("maya").name }}>
                <FormItem name="owner" label="Owner">
                  {(field) => <Input {...field} disabled />}
                </FormItem>
              </Form>
            ),
          },
          {
            label: "Saving",
            node: (
              <Button loading style={{ width: "100%" }}>
                Saving
              </Button>
            ),
          },
          { label: "Saved", node: <Alert type="success">Saved just now</Alert> },
        ]}
      >
        <Card style={{ maxWidth: 480, margin: "0 auto" }} title="Edit project">
          <Form
            defaultValues={{ name: harbour.name, owner: person(harbour.owner).name, due: `24/10/2026`, summary: harbour.summary }}
            onSubmit={(values) => setSaved(String(values.name))}
          >
            <Stack gap="md">
              <FormItem name="name" label="Project name" required>
                {(field) => <Input {...field} />}
              </FormItem>
              <FormItem name="owner" label="Owner">
                {(field) => <Input {...field} />}
              </FormItem>
              <FormItem name="due" label="Due date">
                {(field) => <Input {...field} placeholder="DD/MM/YYYY" />}
              </FormItem>
              <FormItem name="summary" label="Summary" rules={{ maxLength: { value: 280, message: "Keep it under 280 characters." } }}>
                {(field) => <Input {...field} />}
              </FormItem>
              <Help>Up to 280 characters.</Help>
              {saved ? <Alert type="success">Saved “{saved}”.</Alert> : null}
              <Stack direction="row" gap="sm" justify="end">
                <Button variant="secondary" type="button" onClick={() => setSaved(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </Stack>
            </Stack>
          </Form>
        </Card>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Invite a teammate" caption="Validation beside the field; the form on a phone">
        <Stack gap="lg">
          <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
            <Card title="Invite a teammate" style={{ flex: "1 1 280px" }}>
              <Form
                defaultValues={{ fullName: person("priya").name, email: "priya@tideline", role: "Research" }}
                onSubmit={(values) => setInvited(String(values.email))}
              >
                <Stack gap="md">
                  <FormItem name="fullName" label="Full name" required>
                    {(field) => <Input {...field} />}
                  </FormItem>
                  <FormItem
                    name="email"
                    label="Email"
                    required
                    rules={{ pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a full address, like name@tideline.studio." } }}
                  >
                    {(field) => <Input {...field} type="email" />}
                  </FormItem>
                  <FormItem name="role" label="Role">
                    {(field) => <Input {...field} />}
                  </FormItem>
                  {invited ? <Alert type="success">Invite sent to {invited}.</Alert> : null}
                  <Stack direction="row" gap="sm" justify="end">
                    <Button variant="secondary" type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Send invite</Button>
                  </Stack>
                </Stack>
              </Form>
            </Card>
            <div style={{ flex: "1 1 240px", background: "var(--rebar-color-tint-3)", borderRadius: "var(--rebar-radius-lg)", padding: 20 }}>
              <Stack gap="sm">
                <Text as="span" size="xs" style={{ fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" }}>
                  Team
                </Text>
                {PEOPLE.map((p) => (
                  <Stack key={p.id} direction="row" gap="sm" align="center">
                    <Avatar size="sm" {...avatarOf(p.id)} />
                    <Text as="span" size="sm" style={{ flex: 1, fontWeight: "var(--rebar-font-weight-semibold)" }}>
                      {p.name}
                    </Text>
                    <Text as="span" size="xs" color="secondary">
                      {p.role}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </div>
          </Stack>
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
            <DeviceFrame variant="phone" style={{ maxWidth: 300 }}>
              <div style={{ display: "flex", flexDirection: "column", minHeight: 480, background: "var(--rebar-color-bg-primary)" }}>
                <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
                  <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
                    Edit project
                  </Heading>
                </div>
                <Form defaultValues={{ name: harbour.name, owner: person(harbour.owner).name, due: "24/10/2026" }} onSubmit={() => {}} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Stack gap="md" style={{ padding: 16, flex: 1 }}>
                    <FormItem name="name" label="Project name" required>
                      {(field) => <Input {...field} />}
                    </FormItem>
                    <FormItem name="owner" label="Owner">
                      {(field) => <Input {...field} />}
                    </FormItem>
                    <FormItem name="due" label="Due date">
                      {(field) => <Input {...field} />}
                    </FormItem>
                  </Stack>
                  <div style={{ padding: 16, borderTop: "1px solid var(--rebar-color-border)" }}>
                    <Button type="submit" size="lg" style={{ width: "100%" }}>
                      Save changes
                    </Button>
                  </div>
                </Form>
              </div>
            </DeviceFrame>
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
