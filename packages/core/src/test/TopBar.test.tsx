import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopBar } from "../components/TopBar";
import { Button } from "../components/Button";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");

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

describe("TopBar trailing icon buttons, logo slot and height", () => {
  it("keeps arbitrary icon buttons and a Rebar icon-only Button inside the trailing slot", () => {
    const { container } = render(
      <TopBar
        title="Home"
        trailing={
          <>
            <button type="button" aria-label="Search">
              <svg aria-hidden="true" viewBox="0 0 24 24" />
            </button>
            <Button iconOnly aria-label="Settings" variant="tertiary">
              <svg aria-hidden="true" viewBox="0 0 24 24" />
            </Button>
          </>
        }
      />,
    );
    const slot = container.querySelector('[data-rebar-part="trailing"]') as HTMLElement;
    expect(slot).toContainElement(screen.getByRole("button", { name: "Search" }));
    const rebarButton = screen.getByRole("button", { name: "Settings" });
    expect(slot).toContainElement(rebarButton);
    expect(rebarButton).toHaveAttribute("data-rebar-icon-only");
    expect(rebarButton).toHaveClass("rebar-button");
  });

  it("styles the trailing icon buttons 44px, round, in the bar's colour, with a focus ring", () => {
    expect(css).toMatch(/\.rebar-top-bar-trailing > button:not\(\.rebar-button\):has\(> svg:only-child\)/);
    expect(css).toMatch(/\.rebar-top-bar-trailing \.rebar-button\[data-rebar-icon-only\] \{[^}]*width: 44px;[^}]*height: 44px;[^}]*border-radius: 50%;[^}]*color: inherit;/);
    expect(css).toMatch(/\.rebar-top-bar-trailing \.rebar-button\[data-rebar-icon-only\]:focus-visible \{[^}]*outline: 3px/);
  });

  it("renders a link logo with an image inside the logo part", () => {
    const { container } = render(
      <TopBar
        logo={
          <a href="/">
            <img src="/logo.svg" alt="" />
            Athic
          </a>
        }
      />,
    );
    const logo = container.querySelector('[data-rebar-part="logo"]') as HTMLElement;
    expect(logo.querySelector("a")).toHaveAttribute("href", "/");
    expect(logo.querySelector("img")).toBeInTheDocument();
  });

  it("sizes the logo slot with built-in CSS (24px, inline-flex, 8px gap, link focus ring)", () => {
    expect(css).toMatch(/\.rebar-top-bar-logo \{[^}]*display: inline-flex;[^}]*gap: 8px;/);
    expect(css).toMatch(/\.rebar-top-bar-logo img,\s*\.rebar-top-bar-logo svg \{[^}]*height: 24px;/);
    expect(css).toMatch(/\.rebar-top-bar-logo a:focus-visible \{[^}]*outline: 3px/);
  });

  it("the solid bar is 56px by default and driven by --rebar-top-bar-height", () => {
    expect(css).toMatch(/\.rebar-top-bar-bar \{[^}]*min-height: var\(--rebar-top-bar-height, 56px\);/);
    expect(css).not.toMatch(/\.rebar-top-bar-bar \{[^}]*min-height: 60px/);
  });

  it("the solid bar background stays the inverse colour token", () => {
    expect(css).toMatch(/\.rebar-top-bar \{[^}]*background: var\(--rebar-color-bg-inverse/);
  });
});
