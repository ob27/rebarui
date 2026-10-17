"use client";

import { useState } from "react";
import { DatePicker, Heading, Stack, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<DatePicker mode="dob" minAge={13} value={dob} onValueChange={setDob}
  minAgeMessage="You need to be at least 13 to use Athic." />`;

/** Date-of-birth mode: year, then month, then day, in a bottom sheet. */
export function NewBStages() {
  const [dob, setDob] = useState<Date | null>(null);
  return (
    <>
      <Heading level={2}>Date of birth</Heading>
      <DemoStage
        title="Year-first picker"
        caption="mode=&quot;dob&quot;: pick the year, then the month, then the day; OK stays disabled until the date is valid"
        code={CODE}
        widths={false}
        states={[
          { label: "Inline", node: <DatePicker mode="dob" presentation="inline" minAge={13} yearRange={[1950, 2026]} /> },
          { label: "Popover", node: <DatePicker mode="dob" presentation="popover" /> },
        ]}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TidelinePhone title="Your details" height={480} tabs={false}>
            <Stack gap="sm">
              <Text size="sm" color="secondary">We ask to confirm you’re old enough to use Athic.</Text>
              <DatePicker mode="dob" minAge={13} minAgeMessage="You need to be at least 13 to use Athic." value={dob} onValueChange={setDob} />
              {dob ? <Text size="sm" role="status">Saved {dob.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</Text> : null}
            </Stack>
          </TidelinePhone>
        </div>
      </DemoStage>
    </>
  );
}
