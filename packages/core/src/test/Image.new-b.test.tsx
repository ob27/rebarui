import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Image } from "../components/Image";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

let observers: { cb: IntersectionObserverCallback; opts?: IntersectionObserverInit; disconnect: () => void }[] = [];
beforeEach(() => {
  observers = [];
  class FakeIO {
    cb: IntersectionObserverCallback;
    opts?: IntersectionObserverInit;
    constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
      this.cb = cb;
      this.opts = opts;
      observers.push({ cb, opts, disconnect: () => {} });
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
});

describe("Image additions", () => {
  it("renders a blurred thumbSrc placeholder that is hidden from assistive tech", () => {
    const { container } = render(<Image src="full.jpg" thumbSrc="thumb.jpg" alt="Cover" />);
    const thumb = container.querySelector('[data-rebar-part="thumb"]')!;
    expect(thumb).toHaveAttribute("src", "thumb.jpg");
    expect(thumb).toHaveAttribute("aria-hidden", "true");
    expect(thumb).toHaveAttribute("alt", "");
    expect(container.querySelector('[data-rebar-part="loading"]')).toBeNull();
  });

  it("fades the thumb out once the full image has loaded", () => {
    const { container, getByAltText } = render(<Image src="full.jpg" thumbSrc="thumb.jpg" alt="Cover" />);
    fireEvent.load(getByAltText("Cover"));
    expect(container.querySelector('[data-rebar-part="thumb"]')).toHaveAttribute("data-rebar-hidden", "true");
    expect(container.firstElementChild).toHaveAttribute("data-rebar-image-status", "loaded");
  });

  it("lazy holds back every request until the root is near the viewport", () => {
    const { container } = render(<Image src="full.jpg" thumbSrc="thumb.jpg" alt="Cover" lazy lazyMargin={120} />);
    expect(observers[0]!.opts?.rootMargin).toBe("120px");
    expect(container.firstElementChild).toHaveAttribute("data-rebar-image-status", "idle");
    expect(container.querySelector("img.rebar-image-img")).not.toHaveAttribute("src");
    expect(container.querySelector('[data-rebar-part="thumb"]')).toBeNull();
    act(() => {
      observers[0]!.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(container.querySelector("img.rebar-image-img")).toHaveAttribute("src", "full.jpg");
    expect(container.querySelector('[data-rebar-part="thumb"]')).toHaveAttribute("src", "thumb.jpg");
  });

  it("lazy defaults the margin to 300px", () => {
    render(<Image src="full.jpg" alt="Cover" lazy />);
    expect(observers[0]!.opts?.rootMargin).toBe("300px");
  });

  it("without IntersectionObserver a lazy image still loads", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<Image src="full.jpg" alt="Cover" lazy />);
    expect(container.querySelector("img.rebar-image-img")).toHaveAttribute("src", "full.jpg");
  });

  it("fallbackColor is exposed as a CSS variable and an attribute", () => {
    const { container } = render(<Image src="x.jpg" alt="Cover" fallbackColor="var(--rebar-color-tint-1)" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-image-tinted", "true");
    expect(root.style.getPropertyValue("--rebar-image-fallback-color")).toBe("var(--rebar-color-tint-1)");
  });

  it("errors show the fallback and drop the thumb", () => {
    const { container, getByAltText } = render(<Image src="bad.jpg" thumbSrc="thumb.jpg" alt="Cover" />);
    fireEvent.error(getByAltText("Cover"));
    expect(container.querySelector('[data-rebar-part="fallback"]')).not.toBeNull();
    expect(container.querySelector('[data-rebar-part="thumb"]')).toBeNull();
  });

  it("onStateChange reports thumb, loaded and error transitions once each", () => {
    const onStateChange = vi.fn();
    const { getByAltText } = render(<Image src="full.jpg" thumbSrc="thumb.jpg" alt="Cover" onStateChange={onStateChange} />);
    expect(onStateChange).toHaveBeenLastCalledWith("thumb");
    fireEvent.load(getByAltText("Cover"));
    expect(onStateChange).toHaveBeenLastCalledWith("loaded");
    expect(onStateChange).toHaveBeenCalledTimes(2);
  });

  it("onStateChange reports idle for a lazy image that has not been requested", () => {
    const onStateChange = vi.fn();
    render(<Image src="full.jpg" alt="Cover" lazy onStateChange={onStateChange} />);
    expect(onStateChange).toHaveBeenCalledWith("idle");
  });

  it("images without the new props behave as before", () => {
    const { container } = render(<Image src="full.jpg" alt="Cover" />);
    expect(container.querySelector('[data-rebar-part="thumb"]')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("data-rebar-image-status", "loading");
    expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
  });
});
