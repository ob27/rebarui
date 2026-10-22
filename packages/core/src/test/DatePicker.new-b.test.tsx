import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../components/DatePicker";

afterEach(cleanup);

describe("DatePicker date-of-birth mode", () => {
  it("shows a field with the format as the placeholder and opens a sheet with step crumbs", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="dob" />);
    const field = screen.getByRole("button", { name: "Date of birth. Choose" });
    expect(screen.getByText("dd / mm / yyyy")).toBeInTheDocument();
    await user.click(field);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-rebar-component", "bottom-sheet");
    const crumbs = within(dialog).getByRole("group", { name: "Date of birth steps" });
    expect(within(crumbs).getByRole("button", { name: "Year" })).toHaveAttribute("aria-current", "step");
  });

  it("walks year, month, day and commits on OK, formatting the field", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker mode="dob" onValueChange={onValueChange} yearRange={[1950, 2020]} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: "1990s" }));
    await user.click(screen.getByRole("button", { name: "1994" }));
    await user.click(screen.getByRole("button", { name: "March" }));
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "12" }));
    await user.click(screen.getByRole("button", { name: "OK" }));
    const date = onValueChange.mock.calls[0]![0] as Date;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([1994, 2, 12]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("12 / 03 / 1994")).toBeInTheDocument();
  });

  it("Cancel closes without committing", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker mode="dob" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("minAge shows an error and keeps OK disabled for a younger date", async () => {
    const user = userEvent.setup();
    const thisYear = new Date().getFullYear();
    render(<DatePicker mode="dob" minAge={13} maxDate={new Date(thisYear, 11, 31)} yearRange={[thisYear - 20, thisYear]} minAgeMessage="You need to be at least 13 to use Athic." />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    const decade = `${Math.floor((thisYear - 5) / 10) * 10}s`;
    await user.click(screen.getByRole("button", { name: decade }));
    await user.click(screen.getByRole("button", { name: String(thisYear - 5) }));
    await user.click(screen.getByRole("button", { name: "January" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByRole("alert")).toHaveTextContent("You need to be at least 13 to use Athic.");
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  it("default minAge message when none is given", async () => {
    const user = userEvent.setup();
    const thisYear = new Date().getFullYear();
    render(<DatePicker mode="dob" minAge={18} yearRange={[thisYear - 20, thisYear]} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: `${Math.floor((thisYear - 3) / 10) * 10}s` }));
    await user.click(screen.getByRole("button", { name: String(thisYear - 3) }));
    await user.click(screen.getByRole("button", { name: "January" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByRole("alert")).toHaveTextContent("You must be at least 18 years old.");
  });

  it("years and days outside minDate/maxDate are disabled", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="dob" minDate={new Date(1990, 0, 1)} maxDate={new Date(1994, 2, 10)} yearRange={[1980, 2000]} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: "1990s" }));
    expect(screen.getByRole("button", { name: "1995" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "1994" }));
    expect(screen.getByRole("button", { name: "April" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "March" }));
    expect(screen.getByRole("button", { name: "10" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "11" })).toBeDisabled();
  });

  it("short months only offer their own days", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="dob" yearRange={[1950, 2020]} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: "1990s" }));
    await user.click(screen.getByRole("button", { name: "1994" }));
    await user.click(screen.getByRole("button", { name: "February" }));
    expect(screen.queryByRole("button", { name: "29" })).toBeNull();
    expect(screen.getByRole("button", { name: "28" })).toBeInTheDocument();
  });

  it("crumbs go back a step", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="dob" yearRange={[1950, 2020]} />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    await user.click(screen.getByRole("button", { name: "1990s" }));
    await user.click(screen.getByRole("button", { name: "1994" }));
    expect(screen.getByRole("group", { name: "Month" })).toBeInTheDocument();
    await user.click(within(screen.getByRole("group", { name: "Date of birth steps" })).getByRole("button", { name: "1994" }));
    expect(screen.getByRole("group", { name: "Year" })).toBeInTheDocument();
  });

  it("controlled value and custom format", () => {
    render(<DatePicker mode="dob" value={new Date(1994, 2, 12)} format="yyyy-mm-dd" />);
    expect(screen.getByText("1994-03-12")).toBeInTheDocument();
  });

  it("inline presentation renders the panel in place with no field and no Cancel", () => {
    render(<DatePicker mode="dob" presentation="inline" />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("group", { name: "Year" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("popover presentation opens a popover dialog", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="dob" presentation="popover" />);
    await user.click(screen.getByRole("button", { name: "Date of birth. Choose" }));
    expect(screen.getByRole("dialog", { name: "Date of birth" })).toHaveAttribute("data-rebar-part", "dob-popover");
  });

  it("calendar mode is untouched", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByRole("button", { name: "Pick a date" })).toBeInTheDocument();
  });
});
