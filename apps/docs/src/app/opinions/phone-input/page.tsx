"use client";

import { useState } from "react";
import { Button, Card, Heading, Input, PhoneInput, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW } from "@/fixtures/tideline";

const CODE = `const [phone, setPhone] = useState("");

<PhoneInput value={phone} onValueChange={setPhone} aria-label="Phone number" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PhoneInput"] ?? [] },
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
      <Text color="secondary">A country-code select paired with a phone-number field that formats itself for the chosen country.</Text>

      <DemoStage
        title="Phone number"
        caption="Pick a country, and the number field takes its format"
        code={CODE}
        states={[
          { label: "Prefilled", node: <PhoneInput defaultValue="+44 7700 900142" aria-label="Phone number" /> },
          { label: "Disabled", node: <PhoneInput defaultValue="+44 7700 900142" disabled aria-label="Phone number" /> },
        ]}
      >
        <div style={{ maxWidth: 400 }}>
          <PhoneInput value={phone} onValueChange={setPhone} aria-label="Phone number" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Crew contact" caption="Adding a crew member to the interview list" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Add crew contact" subtitle="Crew interviews" actions={[<Button key="cancel" variant="secondary">Cancel</Button>, <Button key="save">Save contact</Button>]}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">Name</Text>
            <Input defaultValue={CREW[2].name} aria-label="Name" />
            <Text size="sm" color="secondary">Mobile</Text>
            <PhoneInput defaultValue="+44 7700 900318" aria-label="Mobile" />
            <Text size="sm" color="secondary">{CREW[2].role}, interviewed {CREW[2].interviewed}</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
