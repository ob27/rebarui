import { Heading, Lightbox, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Lightbox src="/photo-full.jpg" alt="A mountain lake at sunrise" />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Lightbox"] ?? [] },
  {
    type: "doc-section",
    heading: "Built on Dialog, not reimplemented",
    body: [
      {
        kind: "text",
        text: 'Composes the real `Dialog` component directly with its `fullscreen` flag — no reimplemented modal/focus-trap logic, and `Dialog`\'s own close button is the only close button. Pinch-zoom/pan is deliberately out of scope, the same reasoning `BottomSheet`\'s drag handle used to skip real drag-to-dismiss physics: gesture physics (momentum, multi-touch scale/rotate) is a separate, harder problem than the "fullscreen preview + close" shape this component actually covers.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="lightbox"`; parts: `trigger`, `thumbnail`, `image`. The fullscreen dialog itself carries `Dialog`\'s own attributes.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD bundles fullscreen preview directly into its own `Image` component (a `preview` prop) rather than as a separate component — a migration typically folds this into that prop instead of keeping a standalone lightbox.",
      },
    ],
  },
];

export default function LightboxPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Lightbox</Heading>
      <Text color="secondary">
        Click an image to open a fullscreen preview — built on <code>Dialog</code>'s{" "}
        <code>fullscreen</code> flag.
      </Text>

      <LivePreview>
        <Lightbox
          src="https://picsum.photos/id/29/1200/800"
          alt="A random full-size placeholder photo"
        />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
