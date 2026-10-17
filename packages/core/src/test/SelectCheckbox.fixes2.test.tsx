import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";

afterEach(cleanup);

describe("Select option groups", () => {
  const options = [
    { value: "none", label: "None" },
    { label: "Fruit", options: [{ value: "apple", label: "Apple" }, { value: "pear", label: "Pear", disabled: true }] },
    { label: "Veg", options: [{ value: "kale", label: "Kale" }] },
  ];
  it("renders group labels and picks an option inside a group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select options={options} aria-label="Food" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox", { name: "Food" }));
    expect(await screen.findByText("Fruit")).toBeInTheDocument();
    expect(screen.getByText("Veg")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Fruit" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pear" })).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("option", { name: "Kale" }));
    expect(onValueChange).toHaveBeenCalledWith("kale");
  });
  it("shows the label of a selected grouped option", () => {
    render(<Select options={options} aria-label="Food" defaultValue="apple" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });
});

describe("Checkbox description and card", () => {
  it("links the description with aria-describedby and keeps the label name", () => {
    render(<Checkbox description="Sent weekly">Newsletter</Checkbox>);
    const box = screen.getByRole("checkbox", { name: /Newsletter/ });
    const desc = screen.getByText("Sent weekly");
    expect(box.getAttribute("aria-describedby")).toBe(desc.id);
  });
  it("merges a caller aria-describedby", () => {
    render(<Checkbox description="d" aria-describedby="other">X</Checkbox>);
    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toMatch(/^other /);
  });
  it("variant=card marks the label and still toggles", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox variant="card" description="Pro plan" onCheckedChange={onCheckedChange}>Plan</Checkbox>);
    const label = screen.getByText("Plan").closest("label")!;
    expect(label).toHaveAttribute("data-rebar-variant", "card");
    await user.click(label);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
  it("plain checkbox is unchanged (no card marker, no text wrapper without description)", () => {
    render(<Checkbox>Plain</Checkbox>);
    expect(screen.getByText("Plain").closest("label")).not.toHaveAttribute("data-rebar-variant");
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-describedby");
  });
});
