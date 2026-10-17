import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarHeatmap } from "../components/CalendarHeatmap";

afterEach(cleanup);

const cells = [
  { date: "2025-10-06", value: 1, label: "Week of 6 Oct, attended Mass" },
  { date: "2025-10-13", value: 0, label: "Week of 13 Oct" },
  { date: "2025-11-03", value: 1, label: "Week of 3 Nov, attended Mass" },
  { date: "2025-11-10", value: 1, label: "Week of 10 Nov, attended Mass" },
];

describe("CalendarHeatmap month-rows", () => {
  it("groups cells into one row per month with the month label", () => {
    const { container } = render(<CalendarHeatmap layout="month-rows" cells={cells} title="Past year" />);
    expect(container.querySelector("figure")).toHaveAttribute("data-rebar-layout", "month-rows");
    const rows = container.querySelectorAll('[data-rebar-part="row"]');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Oct 2025");
    expect(rows[1]).toHaveTextContent("Nov 2025");
    expect(rows[0]!.querySelectorAll('[data-rebar-part="cell"]')).toHaveLength(2);
    expect(screen.getByRole("group", { name: "Past year" })).toBeInTheDocument();
  });

  it("value 0 is an outlined cell and above 0 is filled, with no missed wording", () => {
    render(<CalendarHeatmap layout="month-rows" cells={cells} />);
    expect(screen.getByLabelText("Week of 13 Oct")).toHaveAttribute("data-rebar-state", "off");
    expect(screen.getByLabelText("Week of 6 Oct, attended Mass")).toHaveAttribute("data-rebar-state", "on");
    expect(screen.queryByText(/missed/i)).toBeNull();
  });

  it("groupBy none puts every cell in a single row without a label", () => {
    const { container } = render(<CalendarHeatmap layout="month-rows" cells={cells} groupBy="none" />);
    expect(container.querySelectorAll('[data-rebar-part="row"]')).toHaveLength(1);
    expect(container.querySelector('[data-rebar-part="month-label"]')).toBeNull();
  });

  it("pressing a cell reports it; selected marks the ring", async () => {
    const onCellPress = vi.fn();
    const user = userEvent.setup();
    render(<CalendarHeatmap layout="month-rows" cells={cells} onCellPress={onCellPress} selected="2025-10-13" />);
    expect(screen.getByLabelText("Week of 13 Oct")).toHaveAttribute("data-rebar-selected", "true");
    expect(screen.getByLabelText("Week of 13 Oct")).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByLabelText("Week of 6 Oct, attended Mass"));
    expect(onCellPress).toHaveBeenCalledWith(cells[0]);
  });

  it("cells are inert without onCellPress", () => {
    render(<CalendarHeatmap layout="month-rows" cells={cells} />);
    expect(screen.getByLabelText("Week of 13 Oct")).toBeDisabled();
  });

  it("legend labels both cell kinds", () => {
    render(<CalendarHeatmap layout="month-rows" cells={cells} legend={{ on: "Attended Mass", off: "No record" }} />);
    expect(screen.getByText("Attended Mass")).toBeInTheDocument();
    expect(screen.getByText("No record")).toBeInTheDocument();
  });

  it("loading renders placeholder cells that cannot be pressed", () => {
    const { container } = render(<CalendarHeatmap layout="month-rows" cells={[]} loading onCellPress={() => {}} />);
    const cs = container.querySelectorAll('[data-rebar-part="cell"]');
    expect(cs.length).toBeGreaterThan(0);
    cs.forEach((c) => expect(c).toBeDisabled());
    expect(container.querySelector("figure")).toHaveAttribute("data-rebar-loading", "true");
  });

  it("cellShape circle is exposed", () => {
    render(<CalendarHeatmap layout="month-rows" cells={cells} cellShape="circle" />);
    expect(screen.getByLabelText("Week of 13 Oct")).toHaveAttribute("data-rebar-shape", "circle");
  });

  it("the default grid layout still renders the SVG", () => {
    const { container } = render(<CalendarHeatmap data={[{ date: "2026-01-01", value: 3 }]} title="Days" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("figure")).not.toHaveAttribute("data-rebar-layout");
  });
});
