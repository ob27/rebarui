"use client";

import { useState } from "react";
import { CalendarHeatmap, Heading, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ATTENDANCE_WEEKS } from "@/fixtures/athic-mobile";

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
          { label: "Compact cells from --rebar-calendar-heatmap-* properties (20px, 4px gap, 76px month label)", node: <div style={{ "--rebar-calendar-heatmap-row-gap": "8px", "--rebar-calendar-heatmap-month-gap": "10px", "--rebar-calendar-heatmap-month-width": "76px", "--rebar-calendar-heatmap-month-size": "12px", "--rebar-calendar-heatmap-month-weight": "400", "--rebar-calendar-heatmap-cell-gap": "4px", "--rebar-calendar-heatmap-hit": "20px", "--rebar-calendar-heatmap-cell-margin": "0", "--rebar-calendar-heatmap-cell-size": "20px", "--rebar-calendar-heatmap-legend-gap": "10px", "--rebar-calendar-heatmap-legend-item-gap": "16px", "--rebar-calendar-heatmap-swatch-size": "20px", "--rebar-calendar-heatmap-swatch-radius": "6px", "--rebar-calendar-heatmap-swatch-align": "middle" } as React.CSSProperties}><CalendarHeatmap layout="month-rows" cells={ATTENDANCE_WEEKS.slice(0, 8)} legend={{ on: "Attended Mass", off: "No record" }} aria-label="Compact cells" /></div> },
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
