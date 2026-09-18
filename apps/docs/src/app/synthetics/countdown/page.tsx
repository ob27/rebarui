"use client";

import { Countdown, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Countdown target="2026-12-31T23:59:59Z" onComplete={() => console.log("done")} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Countdown"] ?? [] },
  {
    type: "doc-section",
    heading: "Real state, still Synthetic",
    body: [
      {
        kind: "text",
        text: 'A ticking countdown is genuinely time-driven internal state — but the same distinction that keeps `Affix`/`BackTop`/`ScrollMask` Synthetic despite real scroll-position-driven state applies here: the value mirrors the clock, nothing about the component\'s own rendered *mode* branches based on it (beyond stopping at zero). That\'s what separates "has state" from "is an Opinion" — see the Synthetics tier philosophy above.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Format is yours to control",
    body: [
      {
        kind: "text",
        text: 'The default format drops leading zero units — "2d 04h 12m 33s" shrinks to "12m 33s" once under an hour remains, never showing a stray "00d". Pass your own `format` function for anything else (a single "12:33" clock face, a localized string, a `<Text>` with custom styling per unit).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="countdown"` on the root; `data-rebar-complete` present once the countdown reaches zero.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Statistic.Countdown` is the closest direct equivalent — not yet codemod-covered, but a near 1:1 prop mapping (`value`/`target`, `onFinish`/`onComplete`).",
      },
    ],
  },
];

export default function CountdownPage() {
  const target = new Date(Date.now() + 90 * 1000).toISOString();

  return (
    <Stack gap="lg">
      <Heading level={1}>Countdown</Heading>
      <Text color="secondary">A ticking countdown to a target time.</Text>

      <LivePreview>
        <Countdown target={target} />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
