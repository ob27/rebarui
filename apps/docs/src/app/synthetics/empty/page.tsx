import type { CSSProperties, ReactNode } from "react";
import { Button, Card, DeviceFrame, Empty, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, project } from "@/fixtures/tideline";

const CODE = `<Empty
  icon="container"
  description={<Message title="No tasks yet" detail="Add the first task for Harbour rebrand." />}
>
  <Button>New task</Button>
</Empty>`;

function Message({ title, detail }: { title: string; detail?: string }) {
  return (
    <Stack gap="xs" align="center">
      <Heading level={3}>{title}</Heading>
      {detail ? (
        <Text size="sm" color="secondary">
          {detail}
        </Text>
      ) : null}
    </Stack>
  );
}

const harbour = project("harbour");
const launch = EVENTS[0]!;
const TABS = ["Inbox", "Projects", "Calendar", "You"];

const PHONE_STYLE = {
  margin: "0 auto",
  "--rebar-device-frame-max-width": "300px",
  "--rebar-device-frame-bezel-color": "var(--rebar-color-bg-inverse)",
  "--rebar-device-frame-status-bg": "var(--rebar-color-bg-inverse)",
} as CSSProperties;

function Phone({ title, tab, children }: { title: string; tab?: number; children: ReactNode }) {
  return (
    <DeviceFrame variant="phone" style={PHONE_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "8px 18px 14px", fontFamily: "var(--rebar-font-family-display)", fontWeight: "var(--rebar-font-weight-semibold)", fontSize: "1.1rem" }}>{title}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 18 }}>{children}</div>
        {tab !== undefined ? (
          <nav aria-label="Tabs" style={{ display: "flex", borderTop: "1px solid var(--rebar-color-border)" }}>
            {TABS.map((t, i) => (
              <span key={t} style={{ flex: 1, textAlign: "center", padding: "8px 0 10px", fontSize: "0.7rem", fontWeight: i === tab ? 600 : 500, color: i === tab ? "var(--rebar-color-primary)" : "var(--rebar-color-text-secondary)" }}>
                <span aria-hidden="true" style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "currentColor", margin: "0 auto 4px" }} />
                {t}
              </span>
            ))}
          </nav>
        ) : null}
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Empty"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The illustration is a real `<img>` with `alt=""` (the vector icons are `aria-hidden`): a screen reader only hears the description and any action button.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="empty"`, `data-rebar-part="icon" | "description" | "action"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Empty` has `description` and an action child too, but its `image` presets (`Empty.PRESENTED_IMAGE_SIMPLE`) do not map to `icon`/`illustration` here. Not codemod-covered.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Neutral dark-mode glyph",
    body: [
      {
        "kind": "text",
        "text": "With `icon=\"auto\"` the raster illustration shows in light mode, and in dark mode (`[data-theme=\"dark\"]` or a dark `ThemeScope`) a neutral, theme-tinted line glyph takes its place: a ghost for the default illustration, an empty tray for `bowl-and-spoon`. It is never the error-style circle-with-an-X (that stays available as `icon=\"vector\"`)."
      }
    ],
  },
];

export default function EmptyPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Empty</Heading>
      <Text color="secondary">Nothing here yet, and what to do next.</Text>

      <DemoStage
        title="No tasks"
        caption="Icon, message, action"
        code={CODE}
        states={[
          { label: "No results", node: <Empty icon="vector" description={<Message title="Nothing for “signage”" detail="Try another word." />} /> },
          { label: "Inbox zero", node: <Empty icon="container" description={<Message title="All caught up" detail="Nothing needs you." />} /> },
          { label: "Illustration", node: <Empty description="No files yet" /> },
        ]}
      >
        <Card style={{ maxWidth: 520, margin: "0 auto" }}>
          <Empty icon="container" description={<Message title="No tasks yet" detail={`Add the first task for ${harbour.name}.`} />}>
            <Button>New task</Button>
          </Empty>
        </Card>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Empty column, empty day" caption="A drop zone on the board, a quiet calendar on a phone" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Stack direction="row" gap="lg" align="center" justify="center" style={{ flexWrap: "wrap" }}>
            <Card style={{ flex: "0 1 220px" }}>
              <Stack gap="sm">
                <Stack direction="row" justify="between" align="center">
                  <Text size="xs" color="secondary" style={{ fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Review
                  </Text>
                  <Text size="xs" color="secondary">
                    0
                  </Text>
                </Stack>
                <div style={{ border: "1px dashed var(--rebar-color-border-strong)", borderRadius: "var(--rebar-radius)", padding: 8 }}>
                  <Empty icon="container" description="Drop a task here" />
                </div>
              </Stack>
            </Card>
            <Phone title="Calendar" tab={2}>
              <Empty icon="vector" description={<Message title={`Nothing on ${launch.date}`} detail="Enjoy the quiet." />} />
            </Phone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
