import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSplit } from "../components/HeroSplit";

describe("HeroSplit", () => {
  it("renders the title as the single h1 with eyebrow, lede, actions and note", () => {
    render(
      <HeroSplit
        eyebrow="Daily practice"
        title="A catechist in your pocket"
        lede="Readings and Ask."
        actions={<a href="/ask">Try one question</a>}
        note="Free on the web."
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "A catechist in your pocket" })).toBeInTheDocument();
    expect(screen.getByText("Daily practice")).toBeInTheDocument();
    expect(screen.getByText("Readings and Ask.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try one question" })).toBeInTheDocument();
    expect(screen.getByText("Free on the web.")).toBeInTheDocument();
  });

  it("with a backdrop string: inverse tone, art-first on narrow, decorative image", () => {
    const { container } = render(<HeroSplit title="T" backdrop="/art.jpg" media={<div>phone</div>} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-tone", "inverse");
    expect(root).toHaveAttribute("data-rebar-narrow", "art-first");
    expect(root).toHaveAttribute("data-rebar-media", "true");
    expect(root).toHaveAttribute("data-rebar-backdrop", "true");
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/art.jpg");
    expect(img.getAttribute("alt")).toBe("");
    expect(img.closest('[data-rebar-part="backdrop"]')).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("phone")).toBeInTheDocument();
  });

  it("accepts a node backdrop and a stack/overlay narrow mode", () => {
    const { container } = render(<HeroSplit title="T" backdrop={<svg data-testid="art" />} narrow="overlay" />);
    expect(screen.getByTestId("art")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-rebar-narrow", "overlay");
    expect(container.firstElementChild).toHaveAttribute("data-rebar-media", "false");
  });

  it("without a backdrop defaults to default tone and stack; the default and tint tones drop the backdrop", () => {
    const { container, rerender } = render(<HeroSplit title="T" />);
    let root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-tone", "default");
    expect(root).toHaveAttribute("data-rebar-narrow", "stack");
    rerender(<HeroSplit title="T" tone="tint" backdrop="/art.jpg" />);
    root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-tone", "tint");
    expect(container.querySelector("img")).toBeNull();
  });

  it("sets minHeight as a custom property and forwards data and aria attributes", () => {
    const { container } = render(<HeroSplit title="T" minHeight="300px" data-x="1" aria-label="Intro" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--rebar-hero-split-min-height")).toBe("300px");
    expect(root).toHaveAttribute("data-x", "1");
    expect(root).toHaveAttribute("aria-label", "Intro");
  });
});
