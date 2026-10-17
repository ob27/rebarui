import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useHashTarget } from "../useHashTarget";
import { Accordion, AccordionItem } from "../components/Accordion";

const IDS = ["model", "journal"];

function Page({ offset }: { offset?: number | "auto" }) {
  const { target, open, setOpen } = useHashTarget(IDS, { offset, highlightMs: 0 });
  return (
    <div>
      <span data-testid="target">{target ?? "none"}</span>
      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        <AccordionItem id="model" value="model" trigger="The model">model body</AccordionItem>
        <AccordionItem id="journal" value="journal" trigger="Your journal">journal body</AccordionItem>
      </Accordion>
    </div>
  );
}

function flushFrames() {
  return act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });
}

describe("useHashTarget", () => {
  const scrollIntoView = vi.fn();
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "setTimeout", "clearTimeout"] });
    scrollIntoView.mockClear();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.location.hash = "";
  });
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--rebar-header-height");
  });

  it("does nothing without a hash", async () => {
    render(<Page />);
    await flushFrames();
    expect(screen.getByTestId("target")).toHaveTextContent("none");
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("opens and scrolls to the id named by the hash, with a numeric scroll margin", async () => {
    window.location.hash = "#journal";
    render(<Page offset={76} />);
    await flushFrames();
    expect(screen.getByTestId("target")).toHaveTextContent("journal");
    expect(screen.getByRole("button", { name: "Your journal" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "The model" })).toHaveAttribute("aria-expanded", "false");
    const item = document.getElementById("journal") as HTMLElement;
    expect(item.style.scrollMarginTop).toBe("76px");
    expect(item).toHaveAttribute("data-hash-target", "true");
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("offset auto reads --rebar-header-height and adds 20px", async () => {
    document.documentElement.style.setProperty("--rebar-header-height", "56px");
    window.location.hash = "#model";
    render(<Page />);
    await flushFrames();
    expect((document.getElementById("model") as HTMLElement).style.scrollMarginTop).toBe("76px");
  });

  it("follows hashchange and ignores unknown ids", async () => {
    render(<Page />);
    await flushFrames();
    act(() => {
      window.location.hash = "#nope";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await flushFrames();
    expect(screen.getByTestId("target")).toHaveTextContent("none");
    expect(scrollIntoView).not.toHaveBeenCalled();
    act(() => {
      window.location.hash = "#model";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await flushFrames();
    expect(screen.getByTestId("target")).toHaveTextContent("model");
    expect(screen.getByRole("button", { name: "The model" })).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps items the user opened", async () => {
    window.location.hash = "#model";
    render(<Page />);
    await flushFrames();
    act(() => screen.getByRole("button", { name: "Your journal" }).click());
    expect(screen.getByRole("button", { name: "The model" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Your journal" })).toHaveAttribute("aria-expanded", "true");
  });
});
