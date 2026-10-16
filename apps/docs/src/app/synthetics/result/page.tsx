import type { CSSProperties, ReactNode } from "react";
import { Button, Card, DeviceFrame, Heading, Result, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { person, project } from "@/fixtures/tideline";

const CODE = `<Result
  status="success"
  title="Export sent"
  subTitle="14 shifts are with Leo Santos."
  extra={<Button>Done</Button>}
/>`;

const leo = person("leo");
const maya = person("maya");
const GRID: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 };

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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 18 }}>{children}</div>
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Result"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The status icon is an inline SVG marked `aria-hidden="true"`; the title and subtitle alone say what happened, so write them that way.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="result"`, `data-rebar-status`, `data-rebar-part="icon" | "title" | "subtitle" | "extra" | "content"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'AntD\'s `Result` accepts the same `status`/`title`/`subTitle`/`extra` shape, plus HTTP-code statuses (`"404"`, `"403"`, `"500"`) this component does not have.',
      },
    ],
  },
];

export default function ResultPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Result</Heading>
      <Text color="secondary">The outcome of a flow.</Text>

      <DemoStage
        title="Outcome pages"
        caption="Success, error, info"
        code={CODE}
        states={[
          {
            label: "Two actions",
            node: (
              <Result
                status="success"
                title="Published"
                extra={
                  <>
                    <Button size="sm">Open</Button>
                    <Button size="sm" variant="secondary">
                      Share
                    </Button>
                  </>
                }
              />
            ),
          },
          { label: "Warning", node: <Result status="warning" title="No access" subTitle={`Ask ${maya.name}.`} /> },
          { label: "Title only", node: <Result status="info" title="Nothing to export" /> },
        ]}
      >
        <div style={GRID}>
          <Card>
            <Result status="success" title="Export sent" subTitle={`14 shifts are with ${leo.name}.`} extra={<Button size="sm">Done</Button>} />
          </Card>
          <Card>
            <Result status="error" title="Export failed" subTitle="The depot list has no postcodes." extra={<Button size="sm">Try again</Button>} />
          </Card>
          <Card>
            <Result
              status="info"
              title="Awaiting approval"
              subTitle={`${maya.name} will review by Thursday.`}
              extra={
                <Button size="sm" variant="secondary">
                  View status
                </Button>
              }
            />
          </Card>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title={project("rota").name} caption="The end of a flow on a phone" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Phone title={project("rota").name}>
            <Result status="success" title={`Sent to ${leo.name.split(" ")[0]}`} subTitle="14 shifts, week of 21 Oct." extra={<Button>Done</Button>} />
          </Phone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
