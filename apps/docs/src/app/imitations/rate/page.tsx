"use client";

import { Avatar, Button, Card, Heading, Rate, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";
import { useState } from "react";

const CODE = `const [value, setValue] = useState(3);
<Rate value={value} onChange={setValue} aria-label="Interview rating" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Rate"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`role="radiogroup"` over real `role="radio"` buttons, one per star, each labeled "N stars" — Left/Down decreases, Right/Up increases, matching the standard radio-group keyboard pattern. Only the checked (or first) star sits in the Tab order; the rest are reached via arrow keys, not Tab, same as any other radio group.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="rate"`, `data-rebar-part="star"` on each star.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Rate` has the same `value`/`defaultValue`/`count`/`disabled`/`onChange` shape, plus an `allowHalf` option this component doesn't support yet (a real, stated scope limitation, not an oversight — half-star hit-testing is real added complexity deferred for now). Not yet codemod-covered.",
      },
    ],
  },
];

export default function RatePage() {
  const [value, setValue] = useState(3);

  return (
    <Stack gap="lg">
      <Heading level={1}>Rate</Heading>
      <Text color="secondary">A star rating input.</Text>

      <DemoStage title="Interview rating" caption="Click a star or use the arrow keys" code={CODE} widths={false}
        states={[
          { label: "Unrated", node: <Rate defaultValue={0} aria-label="Unrated" /> },
          { label: "Disabled", node: <Rate defaultValue={2} disabled aria-label="Disabled rating" /> },
          { label: "Ten stars", node: <Rate defaultValue={7} count={10} aria-label="Out of ten" /> },
        ]}
      >
        <Stack direction="row" gap="sm" align="center">
          <Rate value={value} onChange={setValue} aria-label="Interview rating" />
          <Text size="sm" color="secondary">{value} / 5</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Interview debrief" caption="Priya scores call 11 before she files the notes" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Crew interview 11" subtitle="21 Oct, 11:30" avatar={<Avatar {...avatarOf("priya")} />} actions={[<Button key="file">File notes</Button>, <Button key="skip" variant="tertiary">Later</Button>]}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">How useful was this conversation?</Text>
            <Rate defaultValue={4} aria-label="Usefulness" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
