import type { CSSProperties, ReactNode } from "react";
import { Avatar, Badge, Card, DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, STATUS_TONE, TASKS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<Badge count={3}><IconBox>✉</IconBox></Badge>
<Badge count={12}><IconBox>★</IconBox></Badge>
<Badge dot><IconBox>✎</IconBox></Badge>
<Badge count={1}><Avatar {...avatarOf("maya")} /></Badge>`;

const BOX: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 40,
  height: 40,
  borderRadius: "var(--rebar-radius)",
  border: "1px solid var(--rebar-color-border-strong)",
  background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))",
  fontSize: 18,
};

function IconBox({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span style={BOX} role="img" aria-label={label}>
      {children}
    </span>
  );
}

const home = TASKS.find((t) => t.id === "home")!;
const walkthrough = FILES.find((f) => f.id === "walkthrough")!;
const INBOX = [
  { id: "n1", who: "maya", text: `${person("maya").name.split(" ")[0]} mentioned you`, where: home.title },
  { id: "n2", who: "priya", text: `${person("priya").name.split(" ")[0]} shared a file`, where: project(walkthrough.project).name },
];
const TABS = ["Inbox", "Projects", "Calendar", "You"];

const PHONE_STYLE = {
  margin: "0 auto",
  "--rebar-device-frame-max-width": "300px",
  "--rebar-device-frame-bezel-color": "var(--rebar-color-bg-inverse)",
  "--rebar-device-frame-status-bg": "var(--rebar-color-bg-inverse)",
} as CSSProperties;

function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DeviceFrame variant="phone" style={PHONE_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "8px 18px 14px", fontFamily: "var(--rebar-font-family-display)", fontWeight: "var(--rebar-font-weight-semibold)", fontSize: "1.1rem" }}>{title}</div>
        <div style={{ flex: 1, padding: 14 }}>{children}</div>
        <nav aria-label="Tabs" style={{ display: "flex", borderTop: "1px solid var(--rebar-color-border)" }}>
          {TABS.map((t, i) => (
            <span key={t} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 0", fontSize: "0.7rem", fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "var(--rebar-color-primary)" : "var(--rebar-color-text-secondary)" }}>
              <Badge count={i === 0 ? INBOX.length + 1 : 0}>
                <span aria-hidden="true" style={{ display: "block", width: 10, height: 10, borderRadius: "50%", background: "currentColor" }} />
              </Badge>
              <span>{t}</span>
            </span>
          ))}
        </nav>
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Badge"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The indicator is a positioned `<span>` and is not announced on its own. A count that matters (unread messages) needs an `aria-live` region or an `aria-label` on what it wraps." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="badge"`, `data-rebar-part="indicator"` (on the wrapped form), `data-rebar-tone`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: AntD's `Badge` uses `status`/`color` rather than `tone`; `count`/`overflowCount` map to `count`/`max`." }],
  },
];

export default function BadgePage() {
  const inboxTotal = INBOX.length + 1;
  return (
    <Stack gap="lg">
      <Heading level={1}>Badge</Heading>
      <Text color="secondary">A count or dot on another element.</Text>

      <DemoStage
        title="Badge"
        caption="Count or dot on anything"
        code={CODE}
        states={[
          {
            label: "99+",
            node: (
              <div>
                <Badge count={150}>
                  <IconBox label="Mail">✉</IconBox>
                </Badge>
              </div>
            ),
          },
          {
            label: "Dot",
            node: (
              <div>
                <Badge dot tone="warning">
                  <IconBox label="Edits">✎</IconBox>
                </Badge>
              </div>
            ),
          },
          {
            label: "Zero hidden",
            node: (
              <div>
                <Badge count={0}>
                  <IconBox label="Mail">✉</IconBox>
                </Badge>
              </div>
            ),
          },
          {
            label: "Standalone",
            node: (
              <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
                <Badge tone={STATUS_TONE["On track"] === "default" ? "default" : "success"} content="On track" />
                <Badge tone="warning" content="At risk" />
                <Badge content="Overdue" />
                <Badge tone="info" content="In review" />
              </Stack>
            ),
          },
        ]}
      >
        <Stack direction="row" gap="xl" align="center" justify="center" style={{ flexWrap: "wrap" }}>
          <Badge count={3}>
            <IconBox label="Mail">✉</IconBox>
          </Badge>
          <Badge count={12}>
            <IconBox label="Starred">★</IconBox>
          </Badge>
          <Badge dot>
            <IconBox label="Edits">✎</IconBox>
          </Badge>
          <Badge count={1}>
            <Avatar {...avatarOf("maya")} style={{ background: "var(--rebar-color-tint-3)" }} />
          </Badge>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Inbox" caption={`${inboxTotal} unread on the tab, a dot per new item`} padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Phone title="Inbox">
            <Card>
              <Stack gap="md">
                {INBOX.map((n, i) => (
                  <Stack key={n.id} direction="row" gap="sm" align="center" style={{ paddingTop: i ? 12 : 0, borderTop: i ? "1px solid var(--rebar-color-border)" : undefined }}>
                    <Badge dot>
                      <Avatar size="sm" {...avatarOf(n.who)} style={{ background: "var(--rebar-color-tint-3)" }} />
                    </Badge>
                    <Stack gap="xs">
                      <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                        {n.text}
                      </Text>
                      <Text as="span" size="xs" color="secondary">
                        {n.where}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Phone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
