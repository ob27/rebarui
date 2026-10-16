import type { CSSProperties, ReactNode } from "react";
import { Card, DeviceFrame, Heading, Skeleton, Stack, Text, Timeline } from "rebar-ui";
import type { TimelineItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, person, project } from "@/fixtures/tideline";

const CODE = `<Timeline
  items={[
    { label: "24 Oct", children: <Entry title="Harbour launch" detail="Maya Chen presents to the trust." /> },
    { label: "22 Oct", tone: "info", children: <Entry title="Mobile design review" detail="Jonas Weber walks through offline sync." /> },
    { label: "21 Oct", children: <Entry title="Crew interview 11" detail="Priya Nair, 12 calls booked." /> },
    { label: "10 Oct", tone: "success", children: <Entry title="Rota export done" detail="Leo Santos sent 14 shifts to payroll." /> },
  ]}
/>`;

function Entry({ title, detail }: { title: string; detail: string }) {
  return (
    <Stack gap="xs">
      <Text as="div" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {title}
      </Text>
      <Text size="sm" color="secondary">
        {detail}
      </Text>
    </Stack>
  );
}

const [launch, review, call] = EVENTS;
const ACTIVITY: TimelineItem[] = [
  { label: launch!.date, children: <Entry title={launch!.title} detail={`${person("maya").name} presents to the trust.`} /> },
  { label: review!.date, tone: "info", children: <Entry title={review!.title} detail={`${person("jonas").name} walks through offline sync.`} /> },
  { label: call!.date, children: <Entry title={call!.title} detail={`${person("priya").name}, 12 calls booked.`} /> },
  { label: project("rota").due, tone: "success", children: <Entry title={`${project("rota").name} done`} detail={`${person("leo").name} sent 14 shifts to payroll.`} /> },
];

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
        <div style={{ flex: 1, padding: 18 }}>{children}</div>
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Timeline"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real ordered list (`<ol>`); each event is a list item, read in document order. The dot is decorative (`aria-hidden="true"`), so a tone is never the only signal: say it in the words too.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="timeline"`, `data-rebar-part="item" | "dot" | "content"`, `data-rebar-tone` on each item.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "AntD's `Timeline` nests `Timeline.Item` children (with a `color` prop) rather than a flat `items` array: a structural rewrite, not a rename." },
    ],
  },
];

export default function TimelinePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Timeline</Heading>
      <Text color="secondary">Events in order, newest first.</Text>

      <DemoStage
        title="Project activity"
        caption="Dots, time, detail"
        code={CODE}
        states={[
          { label: "Loading", node: <Skeleton lines={3} /> },
          {
            label: "Empty",
            node: (
              <Text as="div" color="secondary" style={{ textAlign: "center", padding: "12px 0", fontWeight: "var(--rebar-font-weight-semibold)" }}>
                No activity yet
              </Text>
            ),
          },
          {
            label: "Long",
            node: <Timeline items={[{ label: review!.date, children: <Entry title="Quarterly crew wellbeing and rota review for the northern depots" detail={`Scheduled by ${person("leo").name}.`} /> }]} />,
          },
        ]}
      >
        <Card style={{ maxWidth: 560, margin: "0 auto" }}>
          <Timeline items={ACTIVITY} />
        </Card>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Activity" caption="The same feed on a phone" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Phone title="Activity">
            <Timeline items={ACTIVITY.slice(0, 3)} />
          </Phone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
