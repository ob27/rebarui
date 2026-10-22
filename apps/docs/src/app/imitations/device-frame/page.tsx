"use client";

import type { CSSProperties } from "react";
import { DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, project } from "@/fixtures/tideline";
import { APP_BAR, Kicker, PhoneList, PhoneRow, TidelinePhone } from "./TidelinePhone";

const CODE = `<DeviceFrame variant="phone">
  <ProjectsScreen />
</DeviceFrame>

<DeviceFrame variant="browser" title="tideline.app/projects">
  <ProjectsPage />
</DeviceFrame>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DeviceFrame"] ?? [] },
  {
    type: "doc-section",
    heading: "Theming",
    body: [
      {
        kind: "text",
        text: "The frame is sized to its content and shows it whole: an `<img>` child renders at `width: 100%; height: auto`, so a screenshot is never cropped or distorted. A status strip above and a home-indicator strip below keep an app's own header and tab bar clear of the rounded corners (`statusBar={false}` / `homeIndicator={false}` turn them off). Tokens: `--rebar-device-frame-bezel-color`, `-bezel-width`, `-radius`, `-status-bg`, `-home-bg`, `-home-indicator`, `-punch-size`, `-max-width`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The bezel, camera, status strip, home-indicator strip and browser toolbar are decoration and are `aria-hidden`. The screen content is a sibling, not a child, of those pieces, so an image's `alt` text and any other content stay in the accessibility tree. The root is a real `<figure>`; `caption` renders a `<figcaption>`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="device-frame"` and `data-rebar-variant` (`phone`, `tablet` or `browser`) on the root; `data-rebar-part` values `bezel`, `screen`, `notch`, `status-bar`, `home-indicator` and `toolbar` (browser only).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no device-frame component; replace it with your own mockup asset or CSS." }],
  },
];

function ProjectRows({ ids }: { ids: string[] }) {
  return (
    <PhoneList>
      {ids.map((id, i) => {
        const p = project(id);
        return <PhoneRow key={id} title={p.name} meta={p.status === "Done" ? "Done" : p.status === "On track" ? `${Math.round((p.done * 14) / 100)} of 14 done` : p.status} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />;
      })}
    </PhoneList>
  );
}

export default function DeviceFramePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DeviceFrame</Heading>
      <Text color="secondary">A phone, tablet or browser bezel around a screen.</Text>

      <DemoStage
        title="Phone and browser"
        caption="Live screens inside the frames"
        code={CODE}
        states={[
          {
            label: "Status strip",
            node: (
              <TidelinePhone title="Inbox" width={150} height={170} />
            ),
          },
          {
            label: "No strips",
            node: (
              <DeviceFrame variant="phone" statusBar={false} homeIndicator={false} style={{ "--rebar-device-frame-max-width": "150px" } as CSSProperties}>
                <div style={{ height: 190, display: "grid", placeItems: "center", background: "var(--rebar-color-bg-primary)" }}>
                  <Text size="sm" color="secondary">
                    All clear
                  </Text>
                </div>
              </DeviceFrame>
            ),
          },
          {
            label: "Tablet",
            node: (
              <DeviceFrame variant="tablet" style={{ "--rebar-device-frame-max-width": "240px" } as CSSProperties}>
                <div style={{ height: 150, background: "var(--rebar-color-bg-primary)" }}>
                  <div style={{ ...APP_BAR, fontSize: 15, minHeight: 40 }}>Projects</div>
                </div>
              </DeviceFrame>
            ),
          },
          {
            label: "Caption",
            node: (
              <TidelinePhone title="Today" width={150} height={140} caption="Tideline mobile, 1.1" />
            ),
          },
        ]}
      >
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" align="center" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title="Projects" tabs={1} height={380} width={230}>
              <ProjectRows ids={["harbour", "mobile"]} />
            </TidelinePhone>
            <DeviceFrame variant="browser" title="tideline.app/projects" style={{ width: 260, "--rebar-device-frame-max-width": "260px" } as CSSProperties}>
              <div style={{ padding: 16, minHeight: 220, background: "var(--rebar-color-bg-primary)" }}>
                <Heading level={3} style={{ fontSize: 17, marginBottom: 10 }}>
                  Projects
                </Heading>
                <PhoneList>
                  {PROJECTS.slice(0, 3).map((p) => (
                    <PhoneRow key={p.id} title={p.name} thumb={false} trailing={null} />
                  ))}
                </PhoneList>
              </div>
            </DeviceFrame>
          </Stack>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Marketing shot" caption="A feature panel with the app beside it" widths={false}>
        <div className="cs-grain cs-grain--sand" style={{ padding: "32px 24px" }}>
          <Stack direction="row" gap="lg" align="center" justify="center" style={{ flexWrap: "wrap" }}>
            <Stack gap="sm" style={{ maxWidth: 210 }}>
              <Kicker>Tideline mobile</Kicker>
              <Heading level={3}>Offline sync</Heading>
              <Text size="sm" color="secondary">
                Tasks stay on the phone until you are back on signal.
              </Text>
            </Stack>
            <TidelinePhone title="Offline" tabs={0} height={340} width={220}>
              <div style={{ display: "grid", placeItems: "center", textAlign: "center", padding: "56px 12px 0" }}>
                <Heading level={3} style={{ fontSize: 20 }}>
                  3 changes waiting
                </Heading>
                <Text size="sm" color="secondary" style={{ marginTop: 6 }}>
                  They sync when you reconnect.
                </Text>
              </div>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
