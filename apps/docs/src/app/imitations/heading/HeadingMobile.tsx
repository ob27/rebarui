"use client";

import { Heading, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { TODAY } from "@/fixtures/athic";

const CODE = `<Heading level={2} eyebrow="Today · Friday 24 October">Saint Raphael the Archangel</Heading>
<Heading level={2} rule>Your data</Heading>`;

export function HeadingMobile() {
  return (
    <>
      <Heading level={2}>Eyebrow and rule</Heading>
      <DemoStage title="Heading eyebrow and rule" caption="A kicker above, linked by aria-labelledby; a trailing hairline" code={CODE} widths={false}>
        <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 26 }}>
          <Heading level={2} eyebrow={`Today · ${TODAY.date}`}>{TODAY.saint}</Heading>
          <div>
            <Heading level={2} rule>Your data</Heading>
            <Text size="sm" color="secondary">Download or delete everything tied to your account.</Text>
          </div>
        </div>
      </DemoStage>
    </>
  );
}
