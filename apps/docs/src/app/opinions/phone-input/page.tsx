"use client";

import { useState } from "react";
import { Heading, PhoneInput, Stack, Text } from "rebar-ui";
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
        code: '<PhoneInput value={phone} onValueChange={setPhone} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["PhoneInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Not the same gap Input's mask prop already closed",
    body: [
      {
        kind: "text",
        text: '`Input` already ships a `mask` prop for exactly "a formatted phone/card-number field" — a single fixed format. This is a different gap: real branching state, where the *selected country* changes both the format mask and (in a real app) the validation rule behind one field. Try switching the country below and watch the number field\'s format change with it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "A small built-in list, not a validation library",
    body: [
      {
        kind: "text",
        text: "Ships 10 common countries with a format mask for the ones with a short, common national format — not a `libphonenumber`-equivalent. Pass your own `countries` list to replace or extend it; real production use should still validate the final number server-side.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="phone-input"` on the root; parts: `country`, `national`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated international phone input; a migration typically composes AntD's own `Select` + `Input` to the same shape.",
      },
    ],
  },
];

export default function PhoneInputPage() {
  const [phone, setPhone] = useState("");

  return (
    <Stack gap="lg">
      <Heading level={1}>PhoneInput</Heading>
      <Text color="secondary">
        A country-code select paired with a national-number field whose format changes with the
        country.
      </Text>

      <LivePreview>
        <div style={{ maxWidth: 400 }}>
          <PhoneInput value={phone} onValueChange={setPhone} />
        </div>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
