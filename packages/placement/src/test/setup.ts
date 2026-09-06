import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement this — rebar-ui's NavBar (rendered via the nav-bar block) uses it to
// measure overflow. Same stub as packages/core/src/test/setup.ts, needed here too now that
// BlockRenderer can render components that depend on it.
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- test-only stub, not a full ResizeObserver implementation
  window.ResizeObserver = ResizeObserverStub;
}

// Same reasoning, for `rebar-ui`'s SectionNav (rendered via the page-index block), which tracks
// the in-view heading via IntersectionObserver.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- test-only stub, not a full IntersectionObserver implementation
  window.IntersectionObserver = IntersectionObserverStub;
}

// Same reasoning again, for `rebar-ui`'s Select (rendered via the table block's named filters) —
// standard, well-known polyfills for testing Radix Select under jsdom, matching
// packages/core/src/test/setup.ts exactly, needed here too now that BlockRenderer can render it.
if (typeof window !== "undefined") {
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
