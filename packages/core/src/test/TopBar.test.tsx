import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopBar } from "../components/TopBar";

describe("TopBar", () => {
  it("renders a header with the title as the page heading", () => {
    render(<TopBar title="Ask" />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-rebar-component", "top-bar");
    expect(screen.getByRole("heading", { level: 1, name: "Ask" })).toBeInTheDocument();
  });

  it("back calls onBack and is a 44px labelled button", async () => {
    const onBack = vi.fn();
    render(<TopBar leading="back" onBack={onBack} title="Ask" />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("back defaults to history back", async () => {
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    render(<TopBar leading="back" title="Ask" />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalled();
    back.mockRestore();
  });

  it("menu calls onMenu", async () => {
    const onMenu = vi.fn();
    render(<TopBar leading="menu" onMenu={onMenu} />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(onMenu).toHaveBeenCalled();
  });

  it("renders no leading control for none", () => {
    render(<TopBar leading="none" title="Your Profile" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the trailing slot and a badge dot", () => {
    render(<TopBar title="Today" trailing={<button type="button">Save</button>} badge />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "New activity" })).toBeInTheDocument();
  });

  it("marks tone, align and sticky", () => {
    render(<TopBar title="x" tone="overlay" align="center" />);
    const bar = screen.getByRole("banner");
    expect(bar).toHaveAttribute("data-rebar-tone", "overlay");
    expect(bar).toHaveAttribute("data-rebar-align", "center");
    expect(bar).not.toHaveAttribute("data-rebar-sticky");
  });

  it("solid is sticky by default and sticky can be turned off", () => {
    const { rerender } = render(<TopBar title="x" />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-rebar-sticky", "true");
    rerender(<TopBar title="x" sticky={false} />);
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-rebar-sticky");
  });

  it("renders the safe-area strip unless turned off", () => {
    const { container, rerender } = render(<TopBar title="x" />);
    expect(container.querySelector('[data-rebar-part="safe-area"]')).toBeInTheDocument();
    rerender(<TopBar title="x" safeArea={false} />);
    expect(container.querySelector('[data-rebar-part="safe-area"]')).not.toBeInTheDocument();
  });

  it("renders a logo in place of the title", () => {
    const { container } = render(<TopBar logo="Athic" leading="menu" />);
    expect(container.querySelector('[data-rebar-part="logo"]')).toHaveTextContent("Athic");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("forwards data and aria attributes to the root", () => {
    render(<TopBar title="x" data-testid="bar" aria-label="Screen header" />);
    expect(screen.getByTestId("bar")).toHaveAttribute("aria-label", "Screen header");
  });

  describe("editable title", () => {
    it("saves with Enter", async () => {
      const onSave = vi.fn();
      render(<TopBar title={{ editable: true, value: "Confession", onSave }} />);
      await userEvent.click(screen.getByRole("button", { name: /Title: Confession/ }));
      const field = screen.getByRole("textbox", { name: "Title" });
      expect(field).toHaveFocus();
      await userEvent.clear(field);
      await userEvent.type(field, "Mercy{Enter}");
      expect(onSave).toHaveBeenCalledWith("Mercy");
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("saves with the check button", async () => {
      const onSave = vi.fn();
      render(<TopBar title={{ editable: true, value: "A", onSave }} />);
      await userEvent.click(screen.getByRole("button", { name: /Edit/ }));
      await userEvent.type(screen.getByRole("textbox"), "b");
      await userEvent.click(screen.getByRole("button", { name: "Save title" }));
      expect(onSave).toHaveBeenCalledWith("Ab");
    });

    it("cancels with Escape", async () => {
      const onSave = vi.fn();
      render(<TopBar title={{ editable: true, value: "A", onSave }} />);
      await userEvent.click(screen.getByRole("button", { name: /Edit/ }));
      await userEvent.type(screen.getByRole("textbox"), "zzz{Escape}");
      expect(onSave).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: /Title: A/ })).toBeInTheDocument();
    });
  });
});
