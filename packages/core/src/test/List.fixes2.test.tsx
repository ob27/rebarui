import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { List, ListItem, ListSection } from "../components/List";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);

describe("ListItem leadingControl", () => {
  it("renders the control beside the row button, not inside it, and pressing it does not trigger the row", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onCheck = vi.fn();
    render(
      <List>
        <ListItem title="Buy milk" onClick={onClick} leadingControl={<button type="button" aria-label="Done" onClick={onCheck} />} />
      </List>,
    );
    const check = screen.getByRole("button", { name: "Done" });
    const row = screen.getByRole("button", { name: /Buy milk/ });
    expect(row.contains(check)).toBe(false);
    expect(check.closest("li")).toBe(row.closest("li"));
    expect(check.closest('[data-rebar-part="leading-control"]')).not.toBeNull();
    // control precedes the main area
    expect(check.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(check);
    expect(onCheck).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("ListItem inline edit", () => {
  it("while editing, the title is the editor inside a non-interactive main area", () => {
    render(
      <List>
        <ListItem title="Name" onClick={() => {}} editing renderEditor={() => <input aria-label="Rename" defaultValue="Name" />} />
      </List>,
    );
    const input = screen.getByRole("textbox", { name: "Rename" });
    expect(input.closest("button")).toBeNull();
    expect(input.closest("a")).toBeNull();
    expect(input.closest('[data-rebar-part="main"]')?.tagName).toBe("DIV");
    expect(input.closest("li")).toHaveAttribute("data-rebar-editing", "true");
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("F2 on the row and double-clicking the title call onEdit; nothing without renderEditor", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const { rerender } = render(
      <List>
        <ListItem title="Name" onClick={() => {}} onEdit={onEdit} renderEditor={() => <input aria-label="r" />} />
      </List>,
    );
    screen.getByRole("button", { name: /Name/ }).focus();
    await user.keyboard("{F2}");
    expect(onEdit).toHaveBeenCalledTimes(1);
    await user.dblClick(screen.getByText("Name"));
    expect(onEdit).toHaveBeenCalledTimes(2);
    rerender(
      <List>
        <ListItem title="Name" onClick={() => {}} onEdit={onEdit} />
      </List>,
    );
    screen.getByRole("button", { name: /Name/ }).focus();
    await user.keyboard("{F2}");
    expect(onEdit).toHaveBeenCalledTimes(2);
  });
  it("editing without renderEditor leaves the row as it was", () => {
    render(
      <List>
        <ListItem title="Name" onClick={() => {}} editing />
      </List>,
    );
    expect(screen.getByRole("button", { name: /Name/ })).toBeInTheDocument();
  });
});

describe("ListSection gap", () => {
  it("defaults to a 24px rule between consecutive sections in the stylesheet", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    expect(css).toContain(".rebar-list-section + .rebar-list-section { margin-top: var(--rebar-list-section-gap, 24px); }");
  });
  it("a gap prop sets the custom property (number = px)", () => {
    render(
      <>
        <ListSection title="A" data-testid="a" />
        <ListSection title="B" gap={40} data-testid="b" />
        <ListSection title="C" gap="2rem" data-testid="c" />
      </>,
    );
    expect(screen.getByTestId("a").style.getPropertyValue("--rebar-list-section-gap")).toBe("");
    expect(screen.getByTestId("b").style.getPropertyValue("--rebar-list-section-gap")).toBe("40px");
    expect(screen.getByTestId("c").style.getPropertyValue("--rebar-list-section-gap")).toBe("2rem");
  });
});
