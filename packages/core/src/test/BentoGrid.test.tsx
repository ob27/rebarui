import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { BentoCard } from "../components/BentoCard";
import { BentoGrid } from "../components/BentoGrid";
import { DeviceFrame } from "../components/DeviceFrame";

describe("BentoGrid", () => {
  it("renders a div with data-rebar-component and forwards data-/aria- props", () => {
    render(
      <BentoGrid data-testid="grid" aria-label="Features">
        <BentoCard title="One" />
      </BentoGrid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveAttribute("data-rebar-component", "bento-grid");
    expect(grid).toHaveAttribute("aria-label", "Features");
  });

  it("defines a 6-column grid from 960px and one column below, in the stylesheet", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    expect(css).toMatch(/\.rebar-bento-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(css).toMatch(/@media \(min-width: 960px\)\s*\{\s*\.rebar-bento-grid\s*\{\s*grid-template-columns:\s*repeat\(6/);
  });

  it("never clips its cards' content", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    const block = css.slice(css.indexOf("/* BentoGrid"), css.indexOf("/* BackdropSection"));
    expect(block).not.toMatch(/overflow:\s*(hidden|clip)/);
  });
});

describe("BentoCard", () => {
  it("carries data-rebar attributes and defaults", () => {
    render(<BentoCard data-testid="card" title="Daily readings" body="Read straight through." />);
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-rebar-component", "bento-card");
    expect(card).toHaveAttribute("data-rebar-span", "2");
    expect(card).toHaveAttribute("data-rebar-tone", "default");
    expect(card).toHaveAttribute("data-rebar-media-position", "below");
    expect(screen.getByRole("heading", { level: 3, name: "Daily readings" })).toBeInTheDocument();
    expect(card.querySelector('[data-rebar-part="body"]')).toHaveTextContent("Read straight through.");
    expect(card.querySelector('[data-rebar-part="media"]')).toBeNull();
  });

  it("supports span, tone, mediaPosition and headingLevel", () => {
    render(
      <BentoCard
        data-testid="card"
        title="Wide"
        span={6}
        tone="tint-3"
        mediaPosition="end"
        headingLevel={2}
        media={<span>media</span>}
      />,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-rebar-span", "6");
    expect(card).toHaveAttribute("data-rebar-tone", "tint-3");
    expect(card).toHaveAttribute("data-rebar-media-position", "end");
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("puts text before media in DOM order and keeps a DeviceFrame whole inside the media part", () => {
    render(
      <BentoCard
        data-testid="card"
        title="T"
        media={
          <DeviceFrame>
            <img src="/x.png" alt="Screen" />
          </DeviceFrame>
        }
      />,
    );
    const kids = Array.from(screen.getByTestId("card").children);
    expect(kids[0]!).toHaveAttribute("data-rebar-part", "text");
    expect(kids[1]!).toHaveAttribute("data-rebar-part", "media");
    expect(kids[1]!.querySelector('[data-rebar-component="device-frame"]')).not.toBeNull();
    expect(screen.getByRole("img", { name: "Screen" })).toBeInTheDocument();
  });

  it("defines neutral tint fallbacks in the stylesheet", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    for (const n of [1, 2, 3, 4]) expect(css).toMatch(new RegExp(`--rebar-color-tint-${n},\\s*#[0-9a-f]{3,6}`));
  });
});
