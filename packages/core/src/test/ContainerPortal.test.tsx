import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog } from "../components/Dialog";
import { Drawer } from "../components/Drawer";
import { BottomSheet } from "../components/BottomSheet";
import { ActionSheet } from "../components/ActionSheet";

function frame() {
  const el = document.createElement("div");
  el.setAttribute("data-testid", "frame");
  document.body.appendChild(el);
  return el;
}

describe("container prop (portal into a frame)", () => {
  it.each([
    ["Dialog", (c: HTMLElement) => <Dialog open title="T" container={c}>x</Dialog>],
    ["Drawer", (c: HTMLElement) => <Drawer open title="T" container={c}>x</Drawer>],
    ["BottomSheet", (c: HTMLElement) => <BottomSheet open title="T" container={c}>x</BottomSheet>],
    ["ActionSheet", (c: HTMLElement) => <ActionSheet open title="T" actions={[{ label: "A" }]} container={c} />],
  ])("%s renders overlay and content inside the container and marks them contained", (_name, make) => {
    const c = frame();
    render(make(c));
    const dialog = screen.getByRole("dialog");
    expect(c.contains(dialog)).toBe(true);
    expect(dialog).toHaveAttribute("data-rebar-contained", "true");
    const overlay = c.querySelector('[data-rebar-part="overlay"]');
    expect(overlay).toHaveAttribute("data-rebar-contained", "true");
    c.remove();
  });

  it("without container, portals to body and is not marked contained", () => {
    render(<Drawer open title="T">x</Drawer>);
    const dialog = screen.getByRole("dialog");
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog).not.toHaveAttribute("data-rebar-contained");
  });
});
