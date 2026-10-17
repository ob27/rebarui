import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Selector } from "../components/Selector";

afterEach(cleanup);
const options = [
  { label: "Red", value: "r" },
  { label: "Green", value: "g" },
  { label: "Blue", value: "b", disabled: true },
  { label: "Gold", value: "y" },
];

describe("Selector columns", () => {
  it("sets display:grid together with the column template", () => {
    render(<Selector options={options} columns={3} aria-label="Colours" />);
    const group = screen.getByRole("group", { name: "Colours" });
    expect(group.style.display).toBe("grid");
    expect(group.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });
  it("leaves the inline style alone without columns", () => {
    render(<Selector options={options} aria-label="Colours" />);
    expect(screen.getByRole("group").getAttribute("style")).toBeNull();
  });
});

describe("Selector chipRole=choice", () => {
  it("multiple: chips are checkboxes with aria-checked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Selector options={options} multiple chipRole="choice" onValueChange={onValueChange} aria-label="C" />);
    const red = screen.getByRole("checkbox", { name: "Red" });
    expect(red).toHaveAttribute("aria-checked", "false");
    expect(red).not.toHaveAttribute("aria-pressed");
    await user.click(red);
    expect(onValueChange).toHaveBeenCalledWith(["r"]);
    expect(red).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("group", { name: "C" })).toBeInTheDocument();
  });
  it("single: a radiogroup of radios; arrows move and select, skipping disabled; the selected one stays selected", async () => {
    const user = userEvent.setup();
    render(<Selector options={options} chipRole="choice" defaultValue={["r"]} aria-label="C" />);
    expect(screen.getByRole("radiogroup", { name: "C" })).toBeInTheDocument();
    const red = screen.getByRole("radio", { name: "Red" });
    expect(red).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Green" })).toHaveAttribute("tabindex", "-1");
    await user.click(red);
    expect(red).toHaveAttribute("aria-checked", "true");
    red.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Green" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Gold" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Blue" })).toBeDisabled();
  });
  it("default button semantics are unchanged", () => {
    render(<Selector options={options} />);
    expect(screen.getByRole("button", { name: "Red" })).toHaveAttribute("aria-pressed", "false");
  });
});
