import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../components/DatePicker";

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /date/i }));
};
const day = (label: string) => screen.getByRole("button", { name: label });

describe("DatePicker", () => {
  it("renders a pill field showing the given date", () => {
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    expect(screen.getByRole("button", { name: /Mon 15 Jun 2026/ })).toBeInTheDocument();
  });

  it("shows the placeholder when nothing is picked", () => {
    render(<DatePicker />);
    expect(screen.getByRole("button", { name: "Pick a date" })).toHaveTextContent("Pick a date");
  });

  it("carries the expected data-rebar-component and data-rebar-part attributes", () => {
    const { container } = render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    expect(container.querySelector('[data-rebar-component="date-picker"]')).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-part="field"]')).toBeInTheDocument();
  });

  it("opens a calendar on the chosen month", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await open(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("June 2026")).toBeInTheDocument();
  });

  it("picking a day fires onValueChange with a Date, updates the field and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} onValueChange={onValueChange} />);
    await open(user);
    await user.click(day("June 20, 2026"));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 20));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sat 20 Jun 2026/ })).toBeInTheDocument();
  });

  it("does not self-manage state when value is controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker value={new Date(2026, 5, 15)} onValueChange={onValueChange} />);
    await open(user);
    await user.click(day("June 20, 2026"));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 20));
    expect(screen.getByRole("button", { name: /Mon 15 Jun 2026/ })).toBeInTheDocument();
  });

  it("navigates months with the previous/next buttons", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    await open(user);
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("supports arrow-key navigation across days and into the next month", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue={new Date(2026, 5, 29)} />);
    await open(user);
    day("June 29, 2026").focus();
    await user.keyboard("{ArrowRight}");
    expect(day("June 30, 2026")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("July 2026")).toBeInTheDocument();
    expect(day("July 1, 2026")).toHaveFocus();
  });

  it("disables days outside minDate/maxDate", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker defaultValue={new Date(2026, 5, 15)} minDate={new Date(2026, 5, 10)} maxDate={new Date(2026, 5, 20)} />,
    );
    await open(user);
    expect(day("June 9, 2026")).toBeDisabled();
    expect(day("June 21, 2026")).toBeDisabled();
    expect(day("June 12, 2026")).not.toBeDisabled();
  });

  it("the Today button picks today", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker onValueChange={onValueChange} />);
    await open(user);
    await user.click(screen.getByRole("button", { name: "Today" }));
    const now = new Date();
    expect(onValueChange).toHaveBeenCalledWith(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  });

  it("range mode commits { start, end } on the second click, swapping if needed", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker range defaultValue={{ start: new Date(2026, 5, 1), end: new Date(2026, 5, 3) }} onValueChange={onValueChange} />);
    await open(user);
    await user.click(day("June 20, 2026"));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(day("June 12, 2026"));
    expect(onValueChange).toHaveBeenCalledWith({ start: new Date(2026, 5, 12), end: new Date(2026, 5, 20) });
    expect(screen.getByRole("button", { name: /12 Jun 2026 – 20 Jun 2026/ })).toBeInTheDocument();
  });

  it("range mode marks the days between the two ends", async () => {
    const user = userEvent.setup();
    render(<DatePicker range defaultValue={{ start: new Date(2026, 5, 10), end: new Date(2026, 5, 13) }} />);
    await open(user);
    expect(day("June 10, 2026")).toHaveAttribute("data-rebar-range-start");
    expect(day("June 13, 2026")).toHaveAttribute("data-rebar-range-end");
    expect(day("June 11, 2026")).toHaveAttribute("data-rebar-in-range");
  });

  it("disables the field when disabled is set", () => {
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} disabled />);
    expect(screen.getByRole("button", { name: /Mon 15 Jun 2026/ })).toBeDisabled();
  });
});
