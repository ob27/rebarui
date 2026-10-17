"use client";

import { useState } from "react";
import { Button, DeviceFrame, Heading, MobileTabBar, Stack, Text, Toast, ToastProvider } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ToastImperative } from "./ToastImperative";
import { PROJECTS, TASKS, person } from "@/fixtures/tideline";

const CODE = `// once, at the app root
<ToastProvider>{children}</ToastProvider>

// anywhere inside it
const [moved, setMoved] = useState(false);
<Button onClick={() => setMoved(true)}>Move to Done</Button>
<Toast open={moved} onOpenChange={setMoved} type="success" title="Task moved to Done" description="Brand palette" duration={4000} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Toast props", rows: componentProps["Toast"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Radix toast: the viewport is a `role="region"` labelled with a hotkey (F8 moves focus to it), each toast a `role="status"` live region that pauses its timer on hover and focus. A visible close button is always rendered; swipe to dismiss works on touch.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="toast-viewport"` on the provider\'s viewport; `data-rebar-component="toast"` with `data-rebar-type` on each toast; parts `title`, `description`, `close`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `message` and `notification` are imperative calls rather than a mounted, controlled component: a structural difference, not a prop rename." }],
  },
];

type Kind = "success" | "error" | "warning" | "info";
const TOASTS: Record<Kind, { title: string; description?: string; button: string }> = {
  success: { title: "Task moved to Done", description: TASKS[5].title, button: "Move to Done" },
  error: { title: "Could not export", description: "Rota is empty for 24 Oct.", button: "Export rota" },
  warning: { title: "Uploading notes… 62%", description: "interview-03-walkthrough.mp4", button: "Upload notes" },
  info: { title: "Copied link", button: "Copy link" },
};

function PhoneProjects({ onMove }: { onMove: () => void }) {
  return (
    <DeviceFrame variant="phone" style={{ maxWidth: 300 }}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 480, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
          <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
            Projects
          </Heading>
        </div>
        <Stack gap="xs" style={{ padding: 14, flex: 1 }}>
          {PROJECTS.slice(0, 4).map((p) => (
            <Stack key={p.id} direction="row" gap="sm" align="center" style={{ padding: "10px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--rebar-color-tint-2)", flex: "0 0 auto" }} />
              <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  {p.name}
                </Text>
                <Text as="span" size="xs" color="secondary">
                  {p.status} · {person(p.owner).name}
                </Text>
              </Stack>
            </Stack>
          ))}
          <div style={{ paddingTop: 8 }}>
            <Button size="sm" onClick={onMove}>
              Move “{TASKS[5].title}” to Done
            </Button>
          </div>
        </Stack>
        <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={1} />
      </div>
    </DeviceFrame>
  );
}

export default function ToastPage() {
  const [open, setOpen] = useState<Record<Kind, boolean>>({ success: false, error: false, warning: false, info: false });
  const [moved, setMoved] = useState(false);
  const show = (k: Kind) => setOpen((o) => ({ ...o, [k]: true }));
  const kinds = Object.keys(TOASTS) as Kind[];

  return (
    <ToastProvider>
      <Stack gap="lg">
        <Heading level={1}>Toast</Heading>
        <Text color="secondary">A brief message that confirms what just happened.</Text>

        <DemoStage
          title="Feedback"
          caption="Bottom right, auto-dismiss in 4 s, pause on hover"
          code={CODE}
          states={kinds.map((k) => ({
            label: k === "success" ? "Success" : k === "error" ? "Error" : k === "warning" ? "In progress" : "Info",
            node: (
              <Button variant="secondary" size="sm" onClick={() => show(k)}>
                {TOASTS[k].button}
              </Button>
            ),
          }))}
        >
          <div className="cs-grain" style={{ padding: "48px 16px", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Button onClick={() => show("success")}>{TOASTS.success.button}</Button>
            <Button variant="secondary" onClick={() => show("error")}>
              {TOASTS.error.button}
            </Button>
          </div>
          {kinds.map((k) => (
            <Toast key={k} open={open[k]} onOpenChange={(v) => setOpen((o) => ({ ...o, [k]: v }))} type={k} title={TOASTS[k].title} description={TOASTS[k].description} duration={4000} />
          ))}
        </DemoStage>

        <Heading level={2}>In context</Heading>
        <DemoStage title="After an action" caption="Move a task on the phone; the toast confirms it" padding="none">
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center", borderRadius: 0 }}>
            <PhoneProjects onMove={() => setMoved(true)} />
          </div>
          <Toast open={moved} onOpenChange={setMoved} type="success" title="Task moved to Done" description={`${TASKS[5].title} · ${person(TASKS[5].assignee).name}`} duration={4000} />
        </DemoStage>

        <ToastImperative />
        <NextBlockRenderer blocks={BLOCKS} />
      </Stack>
    </ToastProvider>
  );
}
