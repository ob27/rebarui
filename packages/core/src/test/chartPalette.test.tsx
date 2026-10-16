import { afterEach, describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import { cleanup, render } from "@testing-library/react";
import { CHART_PALETTE, chartColor } from "../chartPalette";
import { BarChart } from "../components/BarChart";
import { LineChart } from "../components/LineChart";
import { AreaChart } from "../components/AreaChart";
import { PieChart } from "../components/PieChart";
import { ScatterChart } from "../components/ScatterChart";
import { FunnelChart } from "../components/FunnelChart";
import { RadarChart } from "../components/RadarChart";
import { StackedBarChart } from "../components/StackedBarChart";
import { WaterfallChart } from "../components/WaterfallChart";
import { CandlestickChart } from "../components/CandlestickChart";
import { DistributionChart } from "../components/DistributionChart";

afterEach(cleanup);

describe("shared chart palette", () => {
  it("chartColor cycles through --rebar-chart-N with the old built-in colour as fallback", () => {
    expect(chartColor(0)).toContain("var(--rebar-chart-1,");
    expect(chartColor(4)).toContain("var(--rebar-chart-5,");
    expect(chartColor(5)).toBe(chartColor(0));
    expect(chartColor(0)).toContain("#0066cc");
    expect(CHART_PALETTE).toHaveLength(5);
  });

  const lineSeries = [
    { label: "A", values: [1, 2, 3] },
    { label: "B", values: [3, 2, 1] },
  ];
  const cases: Array<[string, ReactElement]> = [
    ["BarChart", <BarChart title="t" bars={[{ label: "a", value: 1 }, { label: "b", value: 2 }]} />],
    ["LineChart", <LineChart title="t" xLabels={["x", "y", "z"]} series={lineSeries} />],
    ["AreaChart", <AreaChart title="t" xLabels={["x", "y", "z"]} series={lineSeries} />],
    ["PieChart", <PieChart title="t" slices={[{ label: "a", value: 1 }, { label: "b", value: 2 }]} />],
    ["ScatterChart", <ScatterChart title="t" series={[{ label: "A", values: [1, 2, 3] }]} />],
    ["FunnelChart", <FunnelChart title="t" stages={[{ label: "a", value: 5 }, { label: "b", value: 2 }]} />],
    ["RadarChart", <RadarChart title="t" axes={["a", "b", "c"]} series={[{ label: "A", values: [1, 2, 3] }]} />],
    [
      "StackedBarChart",
      <StackedBarChart title="t" bars={[{ label: "x", segments: [{ label: "a", value: 1 }, { label: "b", value: 2 }] }]} />,
    ],
    ["DistributionChart", <DistributionChart title="t" series={[{ label: "A", mean: 5, stdDev: 2 }]} />],
  ];

  it.each(cases)("%s draws its series from --rebar-chart-N", (_name, el) => {
    const { container } = render(el);
    expect(container.innerHTML).toContain("--rebar-chart-1");
  });

  it("a per-series colour override still wins", () => {
    const { container } = render(<BarChart title="t" bars={[{ label: "a", value: 1, color: "#123456" }]} />);
    expect(container.innerHTML).toContain("#123456");
    expect(container.innerHTML).not.toContain("--rebar-chart-1");
  });

  it("CandlestickChart and WaterfallChart use the up/down tokens", () => {
    const c = render(
      <CandlestickChart title="t" data={[{ label: "a", open: 1, close: 2, high: 3, low: 0 }, { label: "b", open: 2, close: 1, high: 3, low: 0 }]} />,
    );
    expect(c.container.innerHTML).toContain("--rebar-chart-up");
    expect(c.container.innerHTML).toContain("--rebar-chart-down");
    cleanup();
    const w = render(<WaterfallChart title="t" steps={[{ label: "s", value: 10 }, { label: "d", value: -4 }, { label: "T", value: 6, isTotal: true }]} />);
    expect(w.container.innerHTML).toContain("--rebar-chart-up");
    expect(w.container.innerHTML).toContain("--rebar-chart-down");
    expect(w.container.innerHTML).toContain("--rebar-chart-2");
  });
});

describe("value axes never go below zero for non-negative data", () => {
  // End-anchored text = the y-axis tick labels (bar value labels are middle-anchored).
  const labels = (el: Element) => Array.from(el.querySelectorAll('text[text-anchor="end"]')).map((t) => t.textContent ?? "");
  it("WaterfallChart", () => {
    const { container } = render(<WaterfallChart title="t" yFormat={(v) => `t${Math.round(v)}`} steps={[{ label: "s", value: 10 }, { label: "d", value: -4 }, { label: "T", value: 6, isTotal: true }]} />);
    expect(labels(container).filter((t) => /^t-/.test(t))).toEqual([]);
  });
  it("DistributionChart", () => {
    const { container } = render(<DistributionChart title="t" series={[{ label: "A", mean: 5, stdDev: 3 }]} />);
    expect(labels(container).filter((t) => /^-\d/.test(t))).toEqual([]);
  });
});
