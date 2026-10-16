"use client";

import { useState } from "react";
import { Button, Card, DeviceFrame, Dialog, Heading, Input, MobileTabBar, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, person, project } from "@/fixtures/tideline";

const CODE = `<Dialog
  trigger={<Button variant="secondary">Rename project</Button>}
  title="Rename project"
  description="Everyone on Tideline mobile sees the new name."
  footer={<><Button variant="secondary">Cancel</Button><Button>Save name</Button></>}
>
  <Input defaultValue="Tideline mobile v2" aria-label="Project name" />
</Dialog>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Dialog"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`role="dialog"` with `aria-modal="true"` set explicitly (this Radix version does not set it itself). Esc closes it, Tab cycles focus only within the dialog while open, and focus returns to the trigger on close.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="dialog"` on the content; `data-rebar-part="title" | "description" | "body" | "footer" | "close"`. Radix\'s own `data-state="open"|"closed"` is read directly, not duplicated.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/migrate-antd` renames the element to `Modal` (`open`, `title` and `footer` are already compatible names). `onOpenChange` becomes `onCancel`, flagged with a review comment since AntD's `onCancel` takes no argument. `description` is promoted into a child paragraph rather than dropped.",
      },
    ],
  },
];

function PhoneProjects() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 520, background: "var(--rebar-color-bg-primary)" }}>
      <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
        <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
          Projects
        </Heading>
      </div>
      <Stack gap="xs" style={{ padding: 14, flex: 1 }}>
        {PROJECTS.slice(0, 3).map((p) => (
          <Stack key={p.id} direction="row" gap="sm" align="center" style={{ padding: "10px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--rebar-color-tint-1)", flex: "0 0 auto" }} />
            <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
              <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {p.name}
              </Text>
              <Text as="span" size="xs" color="secondary">
                {p.done}% done · {person(p.owner).name}
              </Text>
            </Stack>
          </Stack>
        ))}
        <div style={{ paddingTop: 8 }}>
          <Dialog
            trigger={
              <Button variant="destructive" size="sm">
                Leave Crew interviews
              </Button>
            }
            title="Leave Crew interviews?"
            description="You will stop getting updates. Priya can add you back."
            footer={
              <Stack direction="row" gap="sm" justify="end">
                <Button variant="secondary">Stay</Button>
                <Button variant="destructive">Leave project</Button>
              </Stack>
            }
          />
        </div>
      </Stack>
      <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={1} />
    </div>
  );
}

export default function DialogPage() {
  const mobile = project("mobile");
  const signage = project("signage");
  const [saving, setSaving] = useState(false);

  return (
    <Stack gap="lg">
      <Heading level={1}>Dialog</Heading>
      <Text color="secondary">A focused modal that asks for one decision.</Text>

      <DemoStage
        title="Rename project"
        caption="Opens over the page; focus lands on the field"
        code={CODE}
        states={[
          {
            label: "Destructive",
            node: (
              <Dialog
                trigger={
                  <Button variant="destructive" size="sm">
                    Delete project
                  </Button>
                }
                title={`Delete ${signage.name}?`}
                description="12 tasks and 3 files go too."
                footer={
                  <Stack direction="row" gap="sm" justify="end">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </Stack>
                }
              />
            ),
          },
          {
            label: "Loading",
            node: (
              <Dialog
                trigger={
                  <Button variant="secondary" size="sm">
                    Saving…
                  </Button>
                }
                title="Rename project"
                footer={
                  <Stack direction="row" gap="sm" justify="end">
                    <Button variant="secondary" disabled>
                      Cancel
                    </Button>
                    <Button loading>Saving</Button>
                  </Stack>
                }
              >
                <Input defaultValue={`${mobile.name} v2`} disabled aria-label="Project name" />
              </Dialog>
            ),
          },
          {
            label: "Error",
            node: (
              <Dialog
                trigger={
                  <Button variant="secondary" size="sm">
                    Name taken
                  </Button>
                }
                title="Rename project"
                footer={
                  <Stack direction="row" gap="sm" justify="end">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save name</Button>
                  </Stack>
                }
              >
                <Stack gap="xs">
                  <Input defaultValue={project("harbour").name} aria-label="Project name" aria-invalid />
                  <Text size="sm" style={{ color: "var(--rebar-color-danger)" }}>
                    That name is already used.
                  </Text>
                </Stack>
              </Dialog>
            ),
          },
          {
            label: "Auto-dismiss",
            node: (
              <Dialog trigger={<Button variant="secondary" size="sm">Saved toast</Button>} title="Saved" description="Closes on its own after two seconds." autoDismiss={2000} />
            ),
          },
        ]}
      >
        <div className="cs-grain" style={{ padding: "48px 16px", display: "flex", justifyContent: "center" }}>
          <Dialog
            trigger={<Button>Rename project</Button>}
            title="Rename project"
            description={`Everyone on ${mobile.name} sees the new name.`}
            onOpenChange={(open) => {
              if (!open) setSaving(false);
            }}
            footer={
              <Stack direction="row" gap="sm" justify="end">
                <Button variant="secondary">Cancel</Button>
                <Button loading={saving} onClick={() => setSaving(true)}>
                  Save name
                </Button>
              </Stack>
            }
          >
            <Input defaultValue={`${mobile.name} v2`} aria-label="Project name" autoFocus />
          </Dialog>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Leave a project" caption="A confirm on a phone, and a card that asks before deleting">
        <Stack gap="lg">
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
            <DeviceFrame variant="phone" style={{ maxWidth: 300 }}>
              <PhoneProjects />
            </DeviceFrame>
          </div>
          <Card
            style={{ maxWidth: 420, margin: "0 auto" }}
            title={signage.name}
            actions={[
              <Button key="open" variant="secondary">
                Open
              </Button>,
              <Dialog
                key="delete"
                trigger={<Button variant="destructive">Delete</Button>}
                title={`Delete “${signage.name}”?`}
                description="12 tasks and 3 files go with it. This can’t be undone."
                footer={
                  <Stack direction="row" gap="sm" justify="end">
                    <Button variant="secondary">Keep it</Button>
                    <Button variant="destructive">Delete project</Button>
                  </Stack>
                }
              />,
            ]}
          >
            <Text size="sm" color="secondary">
              {signage.summary} {signage.done}% done, due {signage.due}.
            </Text>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
