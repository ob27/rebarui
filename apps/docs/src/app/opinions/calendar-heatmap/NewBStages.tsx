"use client";

import { useState } from "react";
import { CalendarHeatmap, Heading, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ATTENDANCE_WEEKS } from "@/fixtures/athic";

const CODE = `<CalendarHeatmap layout="month-rows" cells={weeks} selected={picked} onCellPress={(c) => setPicked(c.date)}
  legend={{ on: "Attended Mass", off: "No record" }} aria-label="Mass attendance, past 52 weeks" />`;

/** The month-rows layout: one row per month, a rounded square per week. */
export function NewBStages() {
  const [picked, setPicked] = useState("2026-03-23");
  const cell = ATTENDANCE_WEEKS.find((w) => w.date === picked);
  return (
    <>
      <Heading level={2}>Month rows</Heading>
      <DemoStage
        title="Mass attendance"
        caption="One row per month; press a week to select it"
        code={CODE}
        widths={false}
        states={[
          { label: "Loading", node: <CalendarHeatmap layout="month-rows" cells={[]} loading aria-label="Loading attendance" /> },
          { label: "Empty year", node: <CalendarHeatmap layout="month-rows" cells={ATTENDANCE_WEEKS.slice(0, 8).map((w) => ({ ...w, value: 0 }))} legend={{ on: "Attended Mass", off: "No record" }} aria-label="Empty year" /> },
          { label: "Circles", node: <CalendarHeatmap layout="month-rows" cellShape="circle" cells={ATTENDANCE_WEEKS.slice(0, 8)} aria-label="Circle cells" /> },
        ]}
      >
        <TidelinePhone title="Mass attendance" height={600} width={300} tabs={false}>
          <CalendarHeatmap layout="month-rows" cells={ATTENDANCE_WEEKS} selected={picked} onCellPress={(c) => setPicked(c.date)} legend={{ on: "Attended Mass", off: "No record" }} aria-label="Mass attendance, past 52 weeks" />
          <Text size="sm" color="secondary" role="status" style={{ marginTop: 8 }}>{cell?.label}</Text>
        </TidelinePhone>
      </DemoStage>
    </>
  );
}
