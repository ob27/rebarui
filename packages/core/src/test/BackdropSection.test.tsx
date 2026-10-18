import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { BackdropSection } from "../components/BackdropSection";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* BackdropSection"));

function rule(selector: string): string {
  const i = block.indexOf(`${selector} {`);
  expect(i, `rule ${selector}`).toBeGreaterThan(-1);
  return block.slice(i, block.indexOf("}", i));
}

describe("BackdropSection", () => {
  it("renders a section with data-rebar attributes, a decorative image and a scrim", () => {
    render(
      <BackdropSection image={{ src: "/bg.jpg" }} data-testid="bs">
        <h2>Hello</h2>
      </BackdropSection>,
    );
    const root = screen.getByTestId("bs");
    expect(root.tagName).toBe("SECTION");
    expect(root).toHaveAttribute("data-rebar-component", "backdrop-section");
    expect(root).toHaveAttribute("data-rebar-scrim", "soft");
    expect(root).toHaveAttribute("data-rebar-rounded", "false");
    const img = root.querySelector('[data-rebar-part="image"]')!;
    expect(img).toHaveAttribute("src", "/bg.jpg");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(root.querySelector('[data-rebar-part="scrim"]')).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
  });

  it("exposes the image alt text when given", () => {
    render(<BackdropSection image={{ src: "/bg.jpg", alt: "A harvest field" }}>x</BackdropSection>);
    expect(screen.getByRole("img", { name: "A harvest field" })).toBeInTheDocument();
  });

  it("scrim none renders no scrim layer; rounded and the other scrims are attributes", () => {
    const { rerender } = render(
      <BackdropSection image={{ src: "/bg.jpg" }} scrim="none" data-testid="bs">
        x
      </BackdropSection>,
    );
    expect(screen.getByTestId("bs").querySelector('[data-rebar-part="scrim"]')).toBeNull();
    rerender(
      <BackdropSection image={{ src: "/bg.jpg" }} scrim="start" rounded data-testid="bs">
        x
      </BackdropSection>,
    );
    expect(screen.getByTestId("bs")).toHaveAttribute("data-rebar-scrim", "start");
    expect(screen.getByTestId("bs")).toHaveAttribute("data-rebar-rounded", "true");
  });

  it("puts the content after the layers, inside a content part", () => {
    render(
      <BackdropSection image={{ src: "/bg.jpg" }} data-testid="bs">
        <p>Text</p>
      </BackdropSection>,
    );
    const parts = Array.from(screen.getByTestId("bs").children).map((c) => c.getAttribute("data-rebar-part"));
    expect(parts).toEqual(["image", "scrim", "content"]);
  });

  it("styles the image and scrim layers to fill the whole section (inset 0, absolute)", () => {
    for (const sel of [".rebar-backdrop-section-image", ".rebar-backdrop-section-scrim"]) {
      const r = rule(sel);
      expect(r).toMatch(/position:\s*absolute/);
      expect(r).toMatch(/inset:\s*0/);
    }
    expect(rule(".rebar-backdrop-section-image")).toMatch(/width:\s*100%/);
    expect(rule(".rebar-backdrop-section-image")).toMatch(/height:\s*100%/);
  });

  it("never positions the section's children with a blanket rule (the bug that collapsed the layers)", () => {
    expect(block).not.toMatch(/\.rebar-backdrop-section\s*>\s*\*/);
    expect(block).not.toMatch(/\.rebar-backdrop-section\s*>\s*[^{]*\{[^}]*position:\s*relative/);
  });

  it("colours text with the inverse token", () => {
    expect(rule(".rebar-backdrop-section")).toMatch(/--rebar-color-text-inverse/);
  });

  it('imageMode="background" paints the art as the section background (no img element)', () => {
    render(
      <BackdropSection image={{ src: "/bg.jpg" }} imageMode="background" data-testid="bs">
        x
      </BackdropSection>,
    );
    const root = screen.getByTestId("bs");
    expect(root).toHaveAttribute("data-rebar-image-mode", "background");
    expect(root.style.getPropertyValue("--rebar-backdrop-image")).toContain("/bg.jpg");
    expect(root.querySelector("img")).toBeNull();
  });

  it("defaults to the img (no background style, no image-mode attribute)", () => {
    render(
      <BackdropSection image={{ src: "/bg.jpg" }} data-testid="bs">
        x
      </BackdropSection>,
    );
    const root = screen.getByTestId("bs");
    expect(root).not.toHaveAttribute("data-rebar-image-mode");
    expect(root.style.backgroundImage).toBe("");
  });
});
