import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SearchInput } from "../components/SearchInput";

describe("SearchInput", () => {
  it("renders a labelled search box in a search landmark", () => {
    render(<SearchInput placeholder="Search your Discussions" />);
    expect(screen.getByRole("search")).toHaveAttribute("data-rebar-component", "search-input");
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveAttribute("placeholder", "Search your Discussions");
  });

  it("is uncontrolled and reports every keystroke", async () => {
    const onChange = vi.fn();
    render(<SearchInput defaultValue="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("searchbox"), "pray");
    expect(onChange).toHaveBeenLastCalledWith("pray");
    expect(screen.getByRole("searchbox")).toHaveValue("pray");
  });

  it("is controlled", async () => {
    function Host() {
      const [v, setV] = useState("a");
      return <SearchInput value={v} onChange={setV} />;
    }
    render(<Host />);
    await userEvent.type(screen.getByRole("searchbox"), "b");
    expect(screen.getByRole("searchbox")).toHaveValue("ab");
  });

  it("onSearch fires on Enter", async () => {
    const onSearch = vi.fn();
    render(<SearchInput defaultValue="mass" onSearch={onSearch} />);
    screen.getByRole("searchbox").focus();
    await userEvent.keyboard("{Enter}");
    expect(onSearch).toHaveBeenCalledWith("mass");
  });

  it("shows a clear button once there is text and clears (also with Escape)", async () => {
    const onChange = vi.fn();
    render(<SearchInput defaultValue="rosary" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(onChange).toHaveBeenLastCalledWith("");
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole("searchbox"), "ab{Escape}");
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("clearable false hides the clear button", () => {
    render(<SearchInput defaultValue="x" clearable={false} />);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("loading shows a spinner in place of the clear button", () => {
    render(<SearchInput defaultValue="x" loading />);
    expect(screen.getByRole("status", { name: "Searching" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("shows Cancel while focused when onCancel is given", async () => {
    const onCancel = vi.fn();
    render(<SearchInput onCancel={onCancel} />);
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("searchbox"));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("disabled is not focusable and marked", () => {
    render(<SearchInput disabled />);
    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("search")).toHaveAttribute("data-rebar-disabled", "true");
  });

  it("carries variant and size attributes", () => {
    render(<SearchInput variant="flat" size="lg" />);
    const root = screen.getByRole("search");
    expect(root).toHaveAttribute("data-rebar-variant", "flat");
    expect(root).toHaveAttribute("data-rebar-size", "lg");
  });
});
