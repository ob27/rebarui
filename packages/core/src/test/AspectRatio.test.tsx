import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "../components/AspectRatio";
import { resolveRatioPlaceholder } from "../components/ratioPlaceholder";
import { RATIO_PLACEHOLDERS } from "../assets/ratioPlaceholders";

describe("AspectRatio", () => {
  it("carries data-rebar-component on the root", () => {
    render(<AspectRatio />);
    expect(document.querySelector('[data-rebar-component="aspect-ratio"]')).not.toBeNull();
  });

  it("shows an empty placeholder box when neither src nor placeholder is set", () => {
    render(<AspectRatio />);
    expect(document.querySelector('[data-rebar-part="empty"]')).not.toBeNull();
  });

  it("renders a real img when src is set", () => {
    render(<AspectRatio src="https://example.com/photo.jpg" alt="A photo" />);
    const img = screen.getByAltText("A photo");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("renders a placeholder img when placeholder is set and src is not", () => {
    render(<AspectRatio ratio={16 / 9} placeholder />);
    const img = document.querySelector(".rebar-aspect-ratio-image");
    expect(img).not.toBeNull();
    expect((img as HTMLImageElement).src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it("prefers a real src over placeholder when both are set", () => {
    render(<AspectRatio src="https://example.com/photo.jpg" placeholder alt="Real" />);
    expect(screen.getByAltText("Real")).toHaveAttribute("src", "https://example.com/photo.jpg");
  });
});

describe("resolveRatioPlaceholder", () => {
  it("returns one of the embedded placeholders", () => {
    expect(RATIO_PLACEHOLDERS).toContain(
      RATIO_PLACEHOLDERS.find((p) => p.src === resolveRatioPlaceholder(1)),
    );
  });

  it("picks the closest match rather than an exact-only match", () => {
    // 1.7 isn't any embedded ratio exactly, but 16/9 (~1.778) is the closest available.
    const sixteenNine = RATIO_PLACEHOLDERS.find((p) => Math.abs(p.ratio - 16 / 9) < 0.001)!;
    expect(resolveRatioPlaceholder(1.7)).toBe(sixteenNine.src);
  });

  it("is deterministic for the same ratio", () => {
    expect(resolveRatioPlaceholder(4 / 3)).toBe(resolveRatioPlaceholder(4 / 3));
  });
});
