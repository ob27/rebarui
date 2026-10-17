import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeScope, useSchemeAttr } from "../components/ThemeScope";
import { Dialog } from "../components/Dialog";
import { Popover } from "../components/Popover";
import { BottomSheet } from "../components/BottomSheet";

afterEach(cleanup);

describe("ThemeScope", () => {
  it("sets data-rebar-scheme on its root and forwards data and aria attributes", () => {
    render(
      <ThemeScope scheme="dark" data-testid="scope" aria-label="Locked">
        x
      </ThemeScope>,
    );
    const root = screen.getByTestId("scope");
    expect(root).toHaveAttribute("data-rebar-component", "theme-scope");
    expect(root).toHaveAttribute("data-rebar-scheme", "dark");
    expect(root).toHaveAttribute("aria-label", "Locked");
  });

  it("adds no attribute for scheme system", () => {
    render(<ThemeScope scheme="system" data-testid="scope">x</ThemeScope>);
    expect(screen.getByTestId("scope")).not.toHaveAttribute("data-rebar-scheme");
  });

  it("useSchemeAttr returns the nearest lock, or nothing outside a scope", () => {
    function Probe({ id }: { id: string }) {
      const attr = useSchemeAttr();
      return <span data-testid={id} {...attr} />;
    }
    render(
      <>
        <Probe id="outside" />
        <ThemeScope scheme="light">
          <Probe id="inside" />
          <ThemeScope scheme="dark">
            <Probe id="nested" />
          </ThemeScope>
          <ThemeScope scheme="system">
            <Probe id="system" />
          </ThemeScope>
        </ThemeScope>
      </>,
    );
    expect(screen.getByTestId("outside")).not.toHaveAttribute("data-rebar-scheme");
    expect(screen.getByTestId("inside")).toHaveAttribute("data-rebar-scheme", "light");
    expect(screen.getByTestId("nested")).toHaveAttribute("data-rebar-scheme", "dark");
    expect(screen.getByTestId("system")).toHaveAttribute("data-rebar-scheme", "light");
  });

  it("portaled overlays opened inside a lock re-apply the scheme on their content", async () => {
    const user = userEvent.setup();
    render(
      <ThemeScope scheme="light">
        <Dialog trigger={<button>Open dialog</button>} title="Locked dialog">
          body
        </Dialog>
        <Popover trigger={<button>Open popover</button>}>pop</Popover>
        <BottomSheet trigger={<button>Open sheet</button>} title="Sheet">
          sheet body
        </BottomSheet>
      </ThemeScope>,
    );
    await user.click(screen.getByText("Open dialog"));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-rebar-scheme", "light");
    expect(dialog.closest('[data-rebar-component="theme-scope"]')).toBeNull();
    await user.keyboard("{Escape}");
    await user.click(screen.getByText("Open popover"));
    expect(document.querySelector('[data-rebar-component="popover"]')).toHaveAttribute("data-rebar-scheme", "light");
  });

  it("overlays outside any scope carry no scheme attribute", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<button>Open</button>} title="Plain">
        body
      </Dialog>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).not.toHaveAttribute("data-rebar-scheme");
  });
});
