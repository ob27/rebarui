import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Puppet } from "../components/Puppet";
import type { PuppetLayers } from "../components/Puppet";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const FULL: PuppetLayers = {
  body: "/art/body.png",
  wobble: [
    { src: "/art/rod-left.png", pivot: [63, 15] },
    { src: "/art/rod-right.png", pivot: [78, 22], sway: 4, delay: 0.5 },
  ],
  pupils: "/art/pupils.png",
  eyesMask: "/art/eyes-mask.png",
  lids: "/art/lids.png",
};

const root = (c: HTMLElement) => c.querySelector('[data-rebar-component="puppet"]') as HTMLElement;

describe("Puppet", () => {
  it("renders just the body when no other layer is given", () => {
    const { container } = render(<Puppet layers={{ body: "/art/body.png" }} />);
    expect(container.querySelector('[data-rebar-part="body"]')).toHaveAttribute("src", "/art/body.png");
    expect(container.querySelector('[data-rebar-part="eyes"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="wobble"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="bubble"]')).toBeNull();
  });

  it("stacks every layer on one canvas: wobble parts behind the body, the eyes in front, all decorative images", () => {
    const { container } = render(<Puppet layers={FULL} canvas={[599, 846]} size={300} />);
    const imgs = [...container.querySelectorAll("img")];
    expect(imgs.map((i) => i.getAttribute("data-rebar-part"))).toEqual(["wobble", "wobble", "body", "pupils", "lids"]);
    expect(imgs.every((i) => i.getAttribute("alt") === "")).toBe(true);
    expect(root(container).style.aspectRatio).toBe("599 / 846");
    expect(root(container).style.getPropertyValue("--rebar-puppet-w")).toBe("300px");
  });

  it("clips the pupils and lids to the eye mask, and only draws the eyes when it has both pupils and a mask", () => {
    const { container, rerender } = render(<Puppet layers={FULL} />);
    const eyes = container.querySelector('[data-rebar-part="eyes"]') as HTMLElement;
    expect(eyes.style.maskImage || eyes.style.getPropertyValue("-webkit-mask-image") || eyes.getAttribute("style")).toContain("/art/eyes-mask.png");
    rerender(<Puppet layers={{ ...FULL, eyesMask: undefined }} />);
    expect(container.querySelector('[data-rebar-part="eyes"]')).toBeNull(); // unmasked pupils could leave the eye
    rerender(<Puppet layers={{ ...FULL, lids: undefined }} />);
    expect(container.querySelector('[data-rebar-part="lids"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="pupils"]')).not.toBeNull();
  });

  it("gives each wobble part its own pivot, amplitude and delay (with a staggered default)", () => {
    const { container } = render(<Puppet layers={FULL} />);
    const [a, b] = [...container.querySelectorAll<HTMLElement>('[data-rebar-part="wobble"]')] as [HTMLElement, HTMLElement];
    expect(a.style.getPropertyValue("--rebar-puppet-ox")).toBe("63%");
    expect(a.style.getPropertyValue("--rebar-puppet-oy")).toBe("15%");
    expect(a.style.getPropertyValue("--rebar-puppet-wobble")).toBe("3.2deg");
    expect(a.style.getPropertyValue("--rebar-puppet-wobble-delay")).toBe("0.34s");
    expect(b.style.getPropertyValue("--rebar-puppet-wobble")).toBe("4deg");
    expect(b.style.getPropertyValue("--rebar-puppet-wobble-delay")).toBe("0.5s");
  });

  it("is decorative by default and an image with a name when labelled", () => {
    const { container, rerender } = render(<Puppet layers={FULL} />);
    expect(root(container)).toHaveAttribute("aria-hidden", "true");
    expect(root(container)).not.toHaveAttribute("role");
    rerender(<Puppet layers={FULL} label="Con, a concrete block" />);
    expect(root(container)).toHaveAttribute("role", "img");
    expect(root(container)).toHaveAttribute("aria-label", "Con, a concrete block");
    expect(root(container)).not.toHaveAttribute("aria-hidden");
  });

  it("exposes motion and weight as hooks, and a pose forces stillness", () => {
    const { container, rerender } = render(<Puppet layers={FULL} />);
    expect(root(container)).toHaveAttribute("data-rebar-motion", "idle");
    expect(root(container)).toHaveAttribute("data-rebar-weight", "light");
    rerender(<Puppet layers={FULL} motion="hop" weight="heavy" />);
    expect(root(container)).toHaveAttribute("data-rebar-motion", "hop");
    expect(root(container)).toHaveAttribute("data-rebar-weight", "heavy");
    rerender(<Puppet layers={FULL} motion="hop" pose="blink" />);
    expect(root(container)).toHaveAttribute("data-rebar-motion", "still");
    expect(root(container)).toHaveAttribute("data-rebar-pose", "blink");
    rerender(<Puppet layers={FULL} />);
    expect(root(container)).not.toHaveAttribute("data-rebar-pose");
  });

  it("derives a stable phase from its id, and lets the caller choose one", () => {
    const { container, rerender } = render(<Puppet layers={FULL} />);
    const auto = root(container).style.getPropertyValue("--rebar-puppet-phase");
    expect(auto).toMatch(/^-?\d(\.\d)?s$/);
    rerender(<Puppet layers={FULL} />);
    expect(root(container).style.getPropertyValue("--rebar-puppet-phase")).toBe(auto);
    rerender(<Puppet layers={FULL} phase={-1.5} pivot={40} lidLine={30} lookRange={2} />);
    expect(root(container).style.getPropertyValue("--rebar-puppet-phase")).toBe("-1.5s");
    expect(root(container).style.getPropertyValue("--rebar-puppet-pivot")).toBe("40px");
    expect(root(container).style.getPropertyValue("--rebar-puppet-lid-line")).toBe("30%");
    expect(root(container).style.getPropertyValue("--rebar-puppet-look")).toBe("2%");
  });

  it("wiggles when poked, calls onPoke, then settles after a moment", () => {
    vi.useFakeTimers();
    const onPoke = vi.fn();
    const { container } = render(<Puppet layers={FULL} onPoke={onPoke} />);
    expect(root(container)).not.toHaveAttribute("data-rebar-poked");
    fireEvent.pointerDown(root(container));
    expect(root(container)).toHaveAttribute("data-rebar-poked");
    expect(onPoke).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(700); });
    expect(root(container)).not.toHaveAttribute("data-rebar-poked");
  });

  it("says its lines in order in a bubble hidden from assistive tech, looping on a timer", () => {
    vi.useFakeTimers();
    const { container } = render(<Puppet layers={FULL} says={["Already built.", "Use that one.", "Next."]} sayEvery={1000} />);
    const bubble = () => container.querySelector('[data-rebar-part="bubble"]') as HTMLElement;
    expect(bubble()).toHaveTextContent("Already built.");
    expect(bubble()).toHaveAttribute("aria-hidden", "true");
    act(() => { vi.advanceTimersByTime(1000); });
    expect(bubble()).toHaveTextContent("Use that one.");
    act(() => { vi.advanceTimersByTime(1000); });
    expect(bubble()).toHaveTextContent("Next.");
    act(() => { vi.advanceTimersByTime(1000); });
    expect(bubble()).toHaveTextContent("Already built.");
  });

  it("skips to the next line when poked, and restarts the timer so the new line is not cut short", () => {
    vi.useFakeTimers();
    const { container } = render(<Puppet layers={FULL} says={["one", "two", "three"]} sayEvery={1000} />);
    const bubble = () => container.querySelector('[data-rebar-part="bubble"]') as HTMLElement;
    act(() => { vi.advanceTimersByTime(900); });
    fireEvent.pointerDown(root(container));
    expect(bubble()).toHaveTextContent("two");
    act(() => { vi.advanceTimersByTime(900); });
    expect(bubble()).toHaveTextContent("two"); // 900 ms after the poke, not 1000: still the poked line
    act(() => { vi.advanceTimersByTime(200); });
    expect(bubble()).toHaveTextContent("three");
  });

  it("puts the bubble on the chosen side, and a single line stays put", () => {
    vi.useFakeTimers();
    const { container } = render(<Puppet layers={FULL} says={["only"]} bubble="end" sayEvery={500} />);
    const bubble = container.querySelector('[data-rebar-part="bubble"]') as HTMLElement;
    expect(bubble).toHaveAttribute("data-rebar-side", "end");
    act(() => { vi.advanceTimersByTime(5000); });
    expect(bubble).toHaveTextContent("only");
  });

  it("passes other props through and merges a caller's style over its own variables", () => {
    const { container } = render(<Puppet layers={FULL} className="mine" data-testid="p" style={{ margin: 4, ["--rebar-puppet-w" as string]: "100px" }} />);
    expect(root(container)).toHaveClass("rebar-puppet", "mine");
    expect(root(container)).toHaveAttribute("data-testid", "p");
    expect(root(container).style.margin).toBe("4px");
    expect(root(container).style.getPropertyValue("--rebar-puppet-w")).toBe("100px");
  });
});
