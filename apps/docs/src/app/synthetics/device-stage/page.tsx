import { DeviceFrame, DeviceStage, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { APP_SCREEN } from "@/data/placeholderScreens";

const FLOATS = [
  { id: "gospel", side: "start" as const, top: "55%", label: "Today's Gospel", content: "Luke 11:27-28" },
  { id: "ask", side: "end" as const, top: "18%", label: "Ask", content: "CCC 1374 is cited" },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<DeviceStage\n  glow\n  floats={[\n    { id: "gospel", side: "start", top: "55%", label: "Today's Gospel", content: "Luke 11:27-28" },\n    { id: "ask", side: "end", top: "18%", label: "Ask", content: "CCC 1374 is cited" },\n  ]}\n>\n  <DeviceFrame>\n    <img src="/screens/today.png" alt="The Today screen" />\n  </DeviceFrame>\n</DeviceStage>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["DeviceStage"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout rules",
    body: [
      {
        kind: "text",
        text: "The stage's height comes from the device; there is no fixed height. Set the device's width with `--rebar-device-stage-device-width` (default `16rem`). Each float hugs the device, its inner edge 15% of its own width inside the device's edge, and its width is capped by the side gutter so it always fits inside the stage. So it overlaps the device by 15% of its width (never more than 35%) and hides well under 4% of it, at every width. A float is never clipped by the stage and cannot cause horizontal scroll.",
      },
      {
        kind: "text",
        text: "Below 480px of the stage's own width (a container query, so it follows the stage, not the viewport) the floats become one-line chips placed just outside the device's corners, so they never cover its header: the first float on the end side goes top-end, the first on the start side bottom-start, and further floats fill the other corners. `data-rebar-compact` mirrors this on the root and on each float. `top` is ignored in compact mode. A second float on a side with no `top` defaults to `62%` so two floats do not sit on each other.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The device comes first in the DOM and the floats follow, so the reading order is the device and then its supplementary details. Each float is a `role=\"group\"` named by its `label` (or \"Related detail\"). The floats carry real text, so they are not `aria-hidden`.",
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

export default function DeviceStagePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DeviceStage</Heading>
      <Text color="secondary">
        One device centred, with up to four small cards floating around it. Sized by its content,
        never clipped, and it collapses its floats to chips on a narrow stage.
      </Text>

      <LivePreview>
        <div id="device-stage-wide">
          <DeviceStage glow floats={FLOATS}>
            <DeviceFrame>
              <img src={APP_SCREEN} alt="A placeholder app screen" />
            </DeviceFrame>
          </DeviceStage>
        </div>
      </LivePreview>

      <Heading level={2}>A narrow stage (320px)</Heading>
      <LivePreview>
        <div id="device-stage-narrow" style={{ width: 320, maxWidth: "100%" }}>
          <DeviceStage glow floats={FLOATS}>
            <DeviceFrame>
              <img src={APP_SCREEN} alt="A placeholder app screen" />
            </DeviceFrame>
          </DeviceStage>
        </div>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
