import { DeviceStage, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { project } from "@/fixtures/tideline";

const CODE = `<DeviceStage
  glow
  floats={[
    { id: "sync", side: "start", top: "55%", label: "Offline sync", content: "In review, due 7 Nov" },
    { id: "brief", side: "end", top: "18%", label: "Signage brief", content: "Sent to Leo Santos" },
  ]}
>
  <DeviceFrame variant="phone">{/* the Tideline task list */}</DeviceFrame>
</DeviceStage>`;

const FLOATS = [
  { id: "sync", side: "start" as const, top: "55%", label: "Offline sync", content: "In review, due 7 Nov" },
  { id: "brief", side: "end" as const, top: "18%", label: "Signage brief", content: "Sent to Leo Santos" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DeviceStage"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout rules",
    body: [
      {
        kind: "text",
        text: "The stage's height comes from the device. Set the device's width with `--rebar-device-stage-device-width` (default `16rem`). Each float hugs the device, overlapping its edge by 15% of the float's own width, and is capped by the side gutter so it never clips or causes horizontal scroll.",
      },
      {
        kind: "text",
        text: "Below 480px of the stage's own width (a container query) the floats become one-line chips just outside the device's corners. `data-rebar-compact` mirrors this on the root and on each float; `top` is ignored in compact mode.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The device comes first in the DOM and the floats follow. Each float is a `role=\"group\"` named by its `label` (or \"Related detail\"). The floats carry real text, so they are not `aria-hidden`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="device-stage"`, `data-rebar-glow` and `data-rebar-compact` on the root; `data-rebar-part` values `area`, `device` and `float` (with `data-rebar-side`, `data-rebar-slot` and `data-rebar-compact`). Each float\'s card is a `FloatCard`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no equivalent; this is a bespoke layout." }],
  },
];

function Screen() {
  const mobile = project("mobile");
  return (
    <TidelinePhone title="Tideline" tabs={1} height={360} padding={12}>
      <PhoneList>
        <PhoneRow title="Offline sync" meta={mobile.status} tint={1} />
        <PhoneRow title="Signage brief" meta="Depot signage" tint={2} />
        <PhoneRow title="Icon audit" meta="Harbour rebrand" tint={3} />
      </PhoneList>
    </TidelinePhone>
  );
}

export default function DeviceStagePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DeviceStage</Heading>
      <Text color="secondary">One device centred, with up to four small cards floating around it.</Text>

      <DemoStage
        title="Product on a stage"
        caption="Phone and floating cards"
        code={CODE}
        states={[
          {
            label: "Narrow stage (320px)",
            node: (
              <div id="device-stage-narrow" style={{ width: 320, maxWidth: "100%" }}>
                <DeviceStage glow floats={FLOATS}>
                  <Screen />
                </DeviceStage>
              </div>
            ),
          },
          {
            label: "No floats, no glow",
            node: (
              <div style={{ width: 320, maxWidth: "100%" }}>
                <DeviceStage>
                  <Screen />
                </DeviceStage>
              </div>
            ),
          },
        ]}
      >
        <div id="device-stage-wide">
          <DeviceStage glow floats={FLOATS}>
            <Screen />
          </DeviceStage>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch page hero" caption="The stage under the Tideline mobile headline" widths={false}>
        <Stack gap="md" align="center">
          <Heading level={2}>Tideline mobile</Heading>
          <Text color="secondary">Offline tasks and a quiet inbox for the crew.</Text>
          <DeviceStage glow floats={[{ id: "inbox", side: "end", label: "Inbox", content: "One digest, 08:00" }]}>
            <Screen />
          </DeviceStage>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
