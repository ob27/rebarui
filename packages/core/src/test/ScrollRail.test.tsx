import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ScrollRail } from "../components/ScrollRail";

function cards(count: number) {
  return Array.from({ length: count }, (_, i) => <div key={i}>Card {i + 1}</div>);
}

function mockMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as unknown as typeof window.matchMedia;
}

// A manual requestAnimationFrame so a test decides when frames happen.
let queue: FrameRequestCallback[] = [];
let clock = 0;
function flushFrames(count: number, stepMs = 100) {
  for (let i = 0; i < count; i++) {
    const pending = queue;
    queue = [];
    clock += stepMs;
    act(() => {
      pending.forEach((cb) => cb(clock));
    });
  }
}

beforeEach(() => {
  queue = [];
  clock = 0;
  mockMatchMedia(false);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    queue.push(cb);
    return queue.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    queue = [];
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
});

function viewportOf() {
  return document.querySelector('[data-rebar-part="viewport"]') as HTMLElement;
}

describe("ScrollRail", () => {
  it("carries data-rebar attributes and forwards data-/aria- props", () => {
    render(
      <ScrollRail aria-label="Perspectives" data-testid="rail">
        {cards(3)}
      </ScrollRail>,
    );
    const root = screen.getByTestId("rail");
    expect(root).toHaveAttribute("data-rebar-component", "scroll-rail");
    expect(root).toHaveAttribute("data-rebar-state", "static");
    for (const part of ["viewport", "track", "item"]) {
      expect(document.querySelector(`[data-rebar-part="${part}"]`)).not.toBeNull();
    }
    expect(document.querySelectorAll('[data-rebar-part="item"]')).toHaveLength(3);
  });

  it("is a named region whose items are list items (not a carousel)", () => {
    render(<ScrollRail aria-label="Perspectives">{cards(3)}</ScrollRail>);
    const region = screen.getByRole("region", { name: "Perspectives" });
    expect(region).not.toHaveAttribute("aria-roledescription");
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("snaps by default, and snap can be switched off", () => {
    const { rerender } = render(<ScrollRail aria-label="r">{cards(2)}</ScrollRail>);
    expect(screen.getByRole("region")).toHaveAttribute("data-rebar-snap", "true");
    rerender(
      <ScrollRail aria-label="r" snap={false}>
        {cards(2)}
      </ScrollRail>,
    );
    expect(screen.getByRole("region")).toHaveAttribute("data-rebar-snap", "false");
  });

  it("maps gap to a data attribute", () => {
    render(
      <ScrollRail aria-label="r" gap="lg">
        {cards(2)}
      </ScrollRail>,
    );
    expect(screen.getByRole("region")).toHaveAttribute("data-rebar-gap", "lg");
  });

  it("scrolls on prev/next and disables them at the ends", () => {
    const scrollBy = vi.fn();
    render(<ScrollRail aria-label="r">{cards(4)}</ScrollRail>);
    const viewport = viewportOf();
    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(viewport, "scrollWidth", { configurable: true, value: 1000 });
    viewport.scrollBy = scrollBy as unknown as typeof viewport.scrollBy;
    fireEvent.scroll(viewport);

    const prev = screen.getByRole("button", { name: "Previous items" });
    const next = screen.getByRole("button", { name: "Next items" });
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    expect(prev).toHaveAttribute("data-rebar-part", "control");

    fireEvent.click(next);
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 300, behavior: "smooth" }));

    viewport.scrollLeft = 700;
    fireEvent.scroll(viewport);
    expect(next).toBeDisabled();
    expect(prev).toBeEnabled();
    fireEvent.click(prev);
    expect(scrollBy).toHaveBeenLastCalledWith(expect.objectContaining({ left: -300 }));
  });

  it("uses instant scrolling under reduced motion", () => {
    mockMatchMedia(true);
    const scrollBy = vi.fn();
    render(<ScrollRail aria-label="r">{cards(4)}</ScrollRail>);
    const viewport = viewportOf();
    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(viewport, "scrollWidth", { configurable: true, value: 1000 });
    viewport.scrollBy = scrollBy as unknown as typeof viewport.scrollBy;
    fireEvent.scroll(viewport);
    fireEvent.click(screen.getByRole("button", { name: "Next items" }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("hides the controls when controls is false", () => {
    render(
      <ScrollRail aria-label="r" controls={false}>
        {cards(3)}
      </ScrollRail>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  describe("autoScroll", () => {
    it("advances scrollLeft at the requested speed and hides prev/next", () => {
      render(
        <ScrollRail aria-label="r" autoScroll={100}>
          {cards(5)}
        </ScrollRail>,
      );
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
      expect(screen.queryByRole("button", { name: "Next items" })).toBeNull();
      flushFrames(1); // first frame only sets the baseline
      flushFrames(5, 100); // 5 x 100ms at 100px/s
      expect(viewportOf().scrollLeft).toBeCloseTo(50, 0);
    });

    it("true means 40 px/s", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      flushFrames(1);
      flushFrames(10, 100);
      expect(viewportOf().scrollLeft).toBeCloseTo(40, 0);
    });

    it("offers a keyboard-operable Pause/Play toggle", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      const toggle = screen.getByRole("button", { name: "Pause" });
      expect(toggle).toHaveAttribute("data-rebar-part", "toggle");
      toggle.focus();
      fireEvent.click(toggle);
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "paused");
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
      flushFrames(3);
      expect(viewportOf().scrollLeft).toBe(0);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
    });

    it("pauses on pointer hover and resumes on leave", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      const viewport = viewportOf();
      fireEvent.pointerEnter(viewport);
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "paused");
      fireEvent.pointerLeave(viewport);
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
    });

    it("pauses on pointer down until the pointer is released", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      fireEvent.pointerDown(viewportOf());
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "paused");
      fireEvent.pointerUp(window);
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
    });

    it("pauses while focus is inside the rail", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {[<a key="a" href="#a">Link</a>, <div key="b">b</div>]}
        </ScrollRail>,
      );
      act(() => screen.getByRole("link").focus());
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "paused");
      act(() => screen.getByRole("link").blur());
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
    });

    it("pauses while the tab is hidden", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "paused");
      Object.defineProperty(document, "hidden", { configurable: true, value: false });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "scrolling");
    });

    it("does not run under prefers-reduced-motion and behaves as a manual rail", () => {
      mockMatchMedia(true);
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(5)}
        </ScrollRail>,
      );
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-state", "static");
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-snap", "true");
      expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
      expect(screen.getByRole("button", { name: "Next items" })).toBeInTheDocument();
      flushFrames(5);
      expect(viewportOf().scrollLeft).toBe(0);
    });

    it("turns snap off while auto-scrolling", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(3)}
        </ScrollRail>,
      );
      expect(screen.getByRole("region")).toHaveAttribute("data-rebar-snap", "false");
    });

    it("loop renders an aria-hidden inert copy and wraps scrollLeft", () => {
      render(
        <ScrollRail aria-label="r" autoScroll={100} loop>
          {cards(3)}
        </ScrollRail>,
      );
      const items = document.querySelectorAll('[data-rebar-part="item"]');
      expect(items).toHaveLength(6);
      const clones = document.querySelectorAll('[data-rebar-clone="true"]');
      expect(clones).toHaveLength(3);
      clones.forEach((clone) => {
        expect(clone).toHaveAttribute("aria-hidden", "true");
        expect(clone).toHaveAttribute("inert");
      });
      expect(screen.getAllByRole("listitem")).toHaveLength(3);

      // Fake layout: each item is 100px wide with no gap, so one copy is a 300px period.
      const track = document.querySelector('[data-rebar-part="track"]') as HTMLElement;
      Array.from(track.children).forEach((child, i) => {
        Object.defineProperty(child, "offsetLeft", { configurable: true, value: i * 100 });
      });
      const viewport = viewportOf();
      viewport.scrollLeft = 295;
      flushFrames(1);
      flushFrames(1, 100); // +10px => 305, wraps to 5
      expect(viewport.scrollLeft).toBeCloseTo(5, 0);
    });

    it("does not clone without loop", () => {
      render(
        <ScrollRail aria-label="r" autoScroll>
          {cards(3)}
        </ScrollRail>,
      );
      expect(document.querySelectorAll('[data-rebar-clone="true"]')).toHaveLength(0);
    });
  });
});
