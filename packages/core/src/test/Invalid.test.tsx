import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Combobox } from "../components/Combobox";
import { MultiSelect } from "../components/MultiSelect";
import { Checkbox } from "../components/Checkbox";
import { Radio, RadioGroup } from "../components/RadioGroup";

const OPTIONS = [{ value: "a", label: "A" }, { value: "b", label: "B" }];

describe("invalid prop", () => {
  it("Input", () => {
    const { rerender } = render(<Input aria-label="Name" invalid />);
    const el = screen.getByLabelText("Name");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveAttribute("data-rebar-invalid", "true");
    rerender(<Input aria-label="Name" />);
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("data-rebar-invalid");
  });

  it("Select trigger", () => {
    render(<Select options={OPTIONS} aria-label="Size" invalid />);
    const el = screen.getByRole("combobox", { name: "Size" });
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("Combobox single and multiple", () => {
    const { container, rerender } = render(<Combobox options={OPTIONS} aria-label="Pick" invalid />);
    expect(screen.getByRole("combobox", { name: "Pick" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("combobox", { name: "Pick" })).toHaveAttribute("data-rebar-invalid", "true");
    rerender(<Combobox multiple options={OPTIONS} aria-label="Pick" invalid />);
    expect(screen.getByRole("combobox", { name: "Pick" })).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector('[data-rebar-part="field"]')).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("MultiSelect trigger", () => {
    render(<MultiSelect options={OPTIONS} aria-label="Langs" invalid />);
    const el = screen.getByRole("button", { name: "Langs" });
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("Checkbox", () => {
    render(<Checkbox invalid>Agree</Checkbox>);
    const el = screen.getByRole("checkbox");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("Radio", () => {
    render(
      <RadioGroup>
        <Radio value="a" invalid>A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    const [a, b] = screen.getAllByRole("radio");
    expect(a).toHaveAttribute("aria-invalid", "true");
    expect(a).toHaveAttribute("data-rebar-invalid", "true");
    expect(b).not.toHaveAttribute("aria-invalid");
  });
});
