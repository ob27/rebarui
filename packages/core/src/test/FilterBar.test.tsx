import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { FilterBar, FilterPills, ResultCount } from "../components/FilterBar";

const OPTIONS = [
  { value: "all", label: "All", count: 24 },
  { value: "ethics", label: "Ethics", count: 9 },
  { value: "grace", label: "Grace", count: 6 },
];

describe("FilterPills", () => {
  it("is a named group of toggle buttons with counts, first selected by default", () => {
    render(<FilterPills options={OPTIONS} aria-label="Category" />);
    const group = screen.getByRole("group", { name: "Category" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All 24" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Ethics 9" })).toHaveAttribute("aria-pressed", "false");
  });

  it("selects on click and by keyboard, uncontrolled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FilterPills options={OPTIONS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Ethics/ }));
    expect(onValueChange).toHaveBeenCalledWith("ethics");
    expect(screen.getByRole("button", { name: /Ethics/ })).toHaveAttribute("aria-pressed", "true");
    screen.getByRole("button", { name: /Grace/ }).focus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("grace");
  });

  it("is controlled when value is given", async () => {
    const user = userEvent.setup();
    render(<FilterPills options={OPTIONS} value="grace" />);
    await user.click(screen.getByRole("button", { name: /Ethics/ }));
    expect(screen.getByRole("button", { name: /Grace/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("flags scroll mode", () => {
    render(<FilterPills options={OPTIONS} scroll />);
    expect(screen.getByRole("group")).toHaveAttribute("data-rebar-scroll", "true");
  });
});

describe("ResultCount", () => {
  it("is a polite live region with pluralised noun, query and filter", () => {
    render(<ResultCount count={9} noun="Perspective" query="harvest" filter="Ethics" />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-live", "polite");
    expect(el).toHaveTextContent("9 Perspectives for “harvest” in Ethics");
  });

  it("uses the singular for one and shows Clear filters only when something is active", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { rerender } = render(<ResultCount count={1} noun="Perspective" onClear={onClear} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 Perspective");
    expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull();
    rerender(<ResultCount count={1} noun="Perspective" query="x" onClear={onClear} />);
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalled();
  });
});

describe("FilterBar", () => {
  it("searches, clears with the button and with Escape", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<FilterBar searchPlaceholder="Search Perspectives" onSearchChange={onSearchChange} />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    await user.type(input, "harv");
    expect(input).toHaveValue("harv");
    expect(onSearchChange).toHaveBeenLastCalledWith("harv");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    await user.type(input, "x{Escape}");
    expect(input).toHaveValue("");
  });

  it("shows pills, a sort select and a live result count wired together", async () => {
    const user = userEvent.setup();
    function Demo() {
      const [q, setQ] = useState("");
      const [cat, setCat] = useState("all");
      return (
        <FilterBar
          searchValue={q}
          onSearchChange={setQ}
          options={OPTIONS}
          value={cat}
          onValueChange={setCat}
          sortOptions={[{ value: "new", label: "Newest" }, { value: "old", label: "Oldest" }]}
          count={cat === "all" ? 24 : 9}
          noun="Perspective"
        />
      );
    }
    render(<Demo />);
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveTextContent("Newest");
    expect(screen.getByRole("status")).toHaveTextContent("24 Perspectives");
    await user.click(screen.getByRole("button", { name: /Ethics/ }));
    expect(screen.getByRole("status")).toHaveTextContent("9 Perspectives in Ethics");
    await user.type(screen.getByRole("searchbox"), "fire");
    expect(screen.getByRole("status")).toHaveTextContent("for “fire” in Ethics");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("search shows the field without a handler and filters nothing by itself", async () => {
    const user = userEvent.setup();
    render(<FilterBar search />);
    await user.type(screen.getByRole("searchbox"), "abc");
    expect(screen.getByRole("searchbox")).toHaveValue("abc");
  });

  it("omits the search row when no search or sort is asked for", () => {
    const { container } = render(<FilterBar options={OPTIONS} />);
    expect(container.querySelector('[data-rebar-part="row"]')).toBeNull();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });
});
