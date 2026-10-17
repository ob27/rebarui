import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { Radio, RadioGroup } from "../components/RadioGroup";
import { SegmentedControl } from "../components/SegmentedControl";
import { Select } from "../components/Select";
import { Tab, TabList, Tabs } from "../components/Tabs";
import { Textarea } from "../components/Textarea";

// Opt-in appearances added for pixel parity with an app that predates Rebar (family A1: type and form controls).
describe("Button variant tonal", () => {
  it("marks itself tonal and stays a normal button", async () => {
    const onClick = vi.fn();
    render(<Button variant="tonal" size="sm" onClick={onClick}>Share</Button>);
    const button = screen.getByRole("button", { name: "Share" });
    expect(button).toHaveAttribute("data-rebar-variant", "tonal");
    expect(button).toHaveAttribute("data-rebar-size", "sm");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("keeps primary as the default variant", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-rebar-variant", "primary");
  });
});

describe("Textarea countSeparator", () => {
  it("defaults to ' / '", () => {
    render(<Textarea aria-label="Note" maxLength={20} showCount defaultValue="abc" />);
    expect(screen.getByText("3 / 20")).toBeInTheDocument();
  });
  it("accepts a compact separator", () => {
    render(<Textarea aria-label="Note" maxLength={20} showCount countSeparator="/" defaultValue="abc" />);
    expect(screen.getByText("3/20")).toBeInTheDocument();
  });
});

describe("Tabs variant pills", () => {
  it("sets data-rebar-variant on the list only when asked", () => {
    const { rerender } = render(
      <Tabs defaultValue="a">
        <TabList data-testid="list">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByTestId("list")).not.toHaveAttribute("data-rebar-variant");
    rerender(
      <Tabs defaultValue="a">
        <TabList data-testid="list" variant="pills">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByTestId("list")).toHaveAttribute("data-rebar-variant", "pills");
  });
});

describe("SegmentedControl variant chips", () => {
  const options = [{ value: "a", label: "All" }, { value: "b", label: "Some" }];
  it("is a normal radiogroup with a chips marker", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="Filter" variant="chips" options={options} defaultValue="a" onValueChange={onValueChange} />);
    const group = screen.getByRole("radiogroup", { name: "Filter" });
    expect(group).toHaveAttribute("data-rebar-variant", "chips");
    await userEvent.click(screen.getByRole("radio", { name: "Some" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
  it("has no marker by default", () => {
    render(<SegmentedControl aria-label="Filter" options={options} />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("data-rebar-variant");
  });
});

describe("Select native", () => {
  const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }];
  it("renders a real <select> and reports changes through onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Select native aria-label="Letter" options={options} value="a" onValueChange={onValueChange} />);
    const select = screen.getByRole("combobox", { name: "Letter" });
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveAttribute("data-rebar-native", "true");
    expect(select).toHaveValue("a");
    await userEvent.selectOptions(select, "b");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
  it("keeps its own value when uncontrolled", async () => {
    render(<Select native aria-label="Letter" options={options} defaultValue="a" />);
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "b");
    expect(select).toHaveValue("b");
  });
  it("shows a placeholder while nothing is chosen and groups options", () => {
    render(<Select native aria-label="Letter" placeholder="Pick one" options={[{ label: "Group", options }]} />);
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.getByText("Pick one")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Group" })).toBeInTheDocument();
  });
  it("is disabled and invalid like the custom trigger", () => {
    render(<Select native aria-label="Letter" options={options} disabled invalid />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Checkbox appearance native", () => {
  it("renders a real <input type=checkbox> that reports onCheckedChange(boolean)", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox appearance="native" onCheckedChange={onCheckedChange}>Mandatory only</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Mandatory only" });
    expect(box.tagName).toBe("INPUT");
    expect(box).toHaveAttribute("type", "checkbox");
    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toBeChecked();
  });
  it("is controlled by `checked` and supports the card variant", () => {
    render(<Checkbox appearance="native" variant="card" checked>Hide past dates</Checkbox>);
    const box = screen.getByRole("checkbox");
    expect(box).toBeChecked();
    expect(box.closest("label")).toHaveAttribute("data-rebar-variant", "card");
    expect(box.closest("label")).toHaveAttribute("data-rebar-appearance", "native");
  });
  it("maps checked='indeterminate' to the input's indeterminate state", () => {
    render(<Checkbox appearance="native" checked="indeterminate">Some</Checkbox>);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });
  it("leaves the custom checkbox a Radix button by default", () => {
    render(<Checkbox>Plain</Checkbox>);
    expect(screen.getByRole("checkbox").tagName).toBe("BUTTON");
  });
});

describe("RadioGroup appearance native", () => {
  it("renders native radios that share the group's value", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup appearance="native" aria-label="Translation" defaultValue="dr" onValueChange={onValueChange}>
        <Radio value="dr">Douay-Rheims</Radio>
        <Radio value="cpdv">CPDV</Radio>
      </RadioGroup>,
    );
    const dr = screen.getByRole("radio", { name: "Douay-Rheims" });
    const cpdv = screen.getByRole("radio", { name: "CPDV" });
    expect(dr.tagName).toBe("INPUT");
    expect(dr).toBeChecked();
    expect(cpdv).not.toBeChecked();
    expect(dr).toHaveAttribute("name", cpdv.getAttribute("name"));
    await userEvent.click(cpdv);
    expect(onValueChange).toHaveBeenCalledWith("cpdv");
    expect(cpdv).toBeChecked();
    expect(dr).not.toBeChecked();
  });
  it("keeps Radix radios by default", () => {
    render(
      <RadioGroup aria-label="Translation" defaultValue="dr">
        <Radio value="dr">Douay-Rheims</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio").tagName).toBe("BUTTON");
  });
});
