import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CalendarHeatmap } from "../components/CalendarHeatmap";

afterEach(cleanup);

describe("CalendarHeatmap", () => {
  const data = [
    { date: "2026-01-01", value: 3 },
    { date: "2026-01-05", value: 8 },
    { date: "2026-01-10", value: 0 },
  ];

  it("renders a real svg with an accessible name from title", () => {
    render(<CalendarHeatmap data={data} title="Activity" />);
    expect(screen.getByRole("img", { name: "Activity" })).toBeInTheDocument();
  });

  it("renders one real cell per date with data, distinct from missing-data cells", () => {
    const { container } = render(<CalendarHeatmap data={data} title="Activity" />);
    expect(container.querySelectorAll('[data-rebar-part="cell"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-rebar-part="cell-missing"]').length).toBeGreaterThan(0);
  });

  it("a date with value 0 still renders as a real cell, not a missing one", () => {
    const { container } = render(<CalendarHeatmap data={data} title="Activity" />);
    const cells = container.querySelectorAll('[data-rebar-part="cell"]');
    const zeroCell = Array.from(cells).find((c) => c.querySelector("title")?.textContent?.includes(": 0"));
    expect(zeroCell).toBeTruthy();
  });

  it("renders month labels and a Less/More legend", () => {
    render(<CalendarHeatmap data={data} title="Activity" />);
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("respects an explicit startDate/endDate range wider than the data itself", () => {
    const { container } = render(
      <CalendarHeatmap data={data} startDate="2025-12-25" endDate="2026-01-15" title="Activity" />,
    );
    // A wider explicit range should produce more total day cells (real + missing) than the data's
    // own 3-entry span alone would.
    const totalCells = container.querySelectorAll('[data-rebar-part="cell"], [data-rebar-part="cell-missing"]').length;
    expect(totalCells).toBeGreaterThan(3);
  });

  it("shows a visible empty state instead of broken geometry when there's no data at all", () => {
    render(<CalendarHeatmap data={[]} title="Activity" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});

describe("CalendarHeatmap cellShape", () => {
  // 2026-01-04 is a Sunday: two full weeks of 7 days each.
  const data = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10),
    value: i + 1,
  }));

  it("defaults to squares (no polygons)", () => {
    const { container } = render(<CalendarHeatmap data={data} title="A" />);
    expect(container.querySelectorAll("polygon")).toHaveLength(0);
    expect(container.querySelectorAll('rect[data-rebar-part="cell"]')).toHaveLength(14);
    const explicit = render(<CalendarHeatmap data={data} title="A" cellShape="square" />);
    expect(explicit.container.innerHTML).toBe(container.innerHTML);
  });

  it("renders a polygon per day, plus legend hexagons", () => {
    const { container } = render(<CalendarHeatmap data={data} title="A" cellShape="hexagon" />);
    expect(container.querySelectorAll('polygon[data-rebar-part="cell"]')).toHaveLength(14);
    expect(container.querySelectorAll('rect[data-rebar-part="cell"]')).toHaveLength(0);
    expect(container.querySelectorAll("polygon")).toHaveLength(14 + 5);
  });

  const centre = (el: Element) => {
    const pts = el.getAttribute("points")!.split(" ").map((p) => p.split(",").map(Number));
    const xs = pts.map((p) => p[0]!);
    const ys = pts.map((p) => p[1]!);
    return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, h: Math.max(...ys) - Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) };
  };

  it("is a flat-top honeycomb: flats-to-flats = cellSize, odd columns shifted half a pitch", () => {
    const { container } = render(<CalendarHeatmap data={data} title="A" cellShape="hexagon" cellSize={20} />);
    const cells = Array.from(container.querySelectorAll('polygon[data-rebar-part="cell"]'));
    const c0 = centre(cells[0]!); // week 0, Sunday
    const c7 = centre(cells[7]!); // week 1, Sunday
    const c1 = centre(cells[1]!); // week 0, Monday
    expect(c0.h).toBeCloseTo(20);
    expect(c0.w).toBeCloseTo((2 * 20) / Math.sqrt(3));
    expect(c1.cy - c0.cy).toBeCloseTo(22);
    expect(c7.cy - c0.cy).toBeCloseTo(11);
    // Adjacent-column neighbours are exactly one pitch apart (no gap beyond `gap`).
    expect(Math.hypot(c7.cx - c0.cx, c7.cy - c0.cy)).toBeCloseTo(22);
    const c8 = centre(cells[8]!);
    expect(Math.hypot(c8.cx - c0.cx, c8.cy - c0.cy)).toBeGreaterThan(22);
    expect(Math.hypot(c8.cx - c1.cx, c8.cy - c1.cy)).toBeCloseTo(22);
  });

  it("renders missing dates as distinct empty hexagons", () => {
    const sparse = [data[0]!, data[10]!];
    const { container } = render(<CalendarHeatmap data={sparse} title="A" cellShape="hexagon" />);
    expect(container.querySelectorAll('polygon[data-rebar-part="cell"]')).toHaveLength(2);
    const missing = container.querySelector('polygon[data-rebar-part="cell-missing"]')!;
    expect(missing.getAttribute("fill")).toContain("--rebar-color-bg-secondary");
  });

  it("selection works on hexagons and shows the value tag", () => {
    const { container } = render(<CalendarHeatmap data={data} title="A" cellShape="hexagon" />);
    const cell = container.querySelector('polygon[data-rebar-part="cell"]')!;
    expect(cell.getAttribute("stroke")).toBe("transparent");
    fireEvent.click(cell);
    const after = container.querySelector('polygon[data-rebar-part="cell"]')!;
    expect(after.getAttribute("stroke")).toContain("--rebar-color-border-strong");
    expect(container.textContent).toContain("Jan 4, 2026");
  });
});
