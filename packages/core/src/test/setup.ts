import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these — several Radix primitives (Select, Toast, Tooltip, Slider)
// use them internally regardless of whether a test actually exercises pointer/resize behavior.
// Standard, well-known polyfills for testing Radix under jsdom, not Rebar-specific workarounds.
if (typeof window !== "undefined") {
  if (!("ResizeObserver" in window)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // @ts-expect-error -- test-only stub, not a full ResizeObserver implementation
    window.ResizeObserver = ResizeObserverStub;
  }

  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
