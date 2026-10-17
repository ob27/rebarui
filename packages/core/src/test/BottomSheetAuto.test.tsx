import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheet } from "../components/BottomSheet";
import { Drawer } from "../components/Drawer";

describe("BottomSheet / Drawer size=auto", () => {
  it("fits the content: no fixed height, a maxHeight (default 85vh) and the auto marker", () => {
    render(
      <BottomSheet open title="Auto" size="auto">
        Short
      </BottomSheet>,
    );
    const sheet = screen.getByRole("dialog", { name: "Auto" });
    expect(sheet).toHaveAttribute("data-rebar-size", "auto");
    expect(sheet.style.height).toBe("");
    expect(sheet.style.maxHeight).toBe("85vh");
  });

  it("takes a custom maxHeight (number = px, or any CSS length)", () => {
    render(
      <BottomSheet open title="Auto" size="auto" maxHeight={300}>
        Short
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog").style.maxHeight).toBe("300px");
  });

  it("a fixed pixel size is unchanged", () => {
    render(
      <BottomSheet open title="Fixed" size={420}>
        x
      </BottomSheet>,
    );
    const sheet = screen.getByRole("dialog");
    expect(sheet.style.height).toBe("420px");
    expect(sheet).not.toHaveAttribute("data-rebar-size");
  });

  it("Drawer on the right with size=auto caps width instead of setting one", () => {
    render(<Drawer open title="Side" size="auto">x</Drawer>);
    const d = screen.getByRole("dialog");
    expect(d.style.width).toBe("");
    expect(d.style.maxWidth).toBe("85vw");
  });
});

describe("BottomSheet dismissible", () => {
  it("is dismissible by default: close button and drag handle present", () => {
    render(<BottomSheet open title="Yes">x</BottomSheet>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(document.querySelector('[data-rebar-part="drag-handle"]')).not.toBeNull();
  });

  it("dismissible={false} hides the grab bar and close button and ignores Esc", async () => {
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open title="No" dismissible={false} onOpenChange={onOpenChange}>
        x
      </BottomSheet>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(document.querySelector('[data-rebar-part="drag-handle"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="handle"]')).toBeNull();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-rebar-dismissible", "false");
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
