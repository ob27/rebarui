"use client";

import { useState } from "react";
import { DatePicker, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `const [date, setDate] = useState<Date>();\n\n<DatePicker value={date} onValueChange={setDate} minDate={new Date()} />`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["DatePicker"] ?? [] },
  {
    type: "doc-section",
    heading: "Pure composition",
    body: [
      {
        kind: "text",
        text: "A trigger button showing the picked date, opening a real `Popover` containing the real `Calendar` — this component owns no date-grid or month-navigation logic of its own, the same way `SplitButton` composes `Button` + `Popover` without reimplementing either. Picking a day closes the popover, since a single date is a complete choice (unlike `TimePicker`, which deliberately stays open across an hour-and-minute pick).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="date-picker"` on the trigger button; the popover content is a real `Calendar`, carrying its own `data-rebar-component="calendar"` and `data-rebar-part` attributes.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `DatePicker` is a close direct equivalent — `value`/`onValueChange` map to AntD's `value`/`onChange`. Same real difference to flag as `Calendar`'s own migration note: AntD's `DatePicker` uses a `dayjs` value, while this component uses a plain native `Date` — wrap at the boundary (`dayjs(value)` in, `.toDate()` out), not a silent drop-in.",
      },
    ],
  },
];

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Stack gap="lg">
      <Heading level={1}>DatePicker</Heading>
      <Text color="secondary">
        A trigger button opening a popover of the real <code>Calendar</code> component.
      </Text>

      <Stack gap="sm">
        <DatePicker value={date} onValueChange={setDate} minDate={new Date()} />
        <Text size="sm" color="secondary">
          Selected: {date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "none"}
        </Text>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
