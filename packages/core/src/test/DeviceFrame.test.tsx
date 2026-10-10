import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "../components/DeviceFrame";

describe("DeviceFrame", () => {
  it("renders a figure with data-rebar-component and defaults to the phone variant", () => {
    render(
      <DeviceFrame data-testid="frame">
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    const root = screen.getByTestId("frame");
    expect(root.tagName).toBe("FIGURE");
    expect(root).toHaveAttribute("data-rebar-component", "device-frame");
    expect(root).toHaveAttribute("data-rebar-variant", "phone");
  });

  it("has bezel, screen and notch parts for the phone, with a decorative bezel", () => {
    render(
      <DeviceFrame>
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="bezel"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[data-rebar-part="notch"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[data-rebar-part="screen"]')).not.toBeNull();
    expect(document.querySelector('[data-rebar-part="toolbar"]')).toBeNull();
  });

  it("keeps the screen content accessible", () => {
    render(
      <DeviceFrame>
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    expect(screen.getByRole("img", { name: "App home screen" })).toBeInTheDocument();
    expect(document.querySelector('[data-rebar-part="screen"]')?.closest("[aria-hidden]")).toBeNull();
  });

  it("has a status strip above and a home-indicator strip below the content, both decorative", () => {
    render(
      <DeviceFrame>
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    const screenEl = document.querySelector('[data-rebar-part="screen"]') as HTMLElement;
    const kids = Array.from(screenEl.children);
    expect(kids[0]!).toHaveAttribute("data-rebar-part", "status-bar");
    expect(kids[0]!).toHaveAttribute("aria-hidden", "true");
    expect(kids[1]!.tagName).toBe("IMG");
    expect(kids[2]!).toHaveAttribute("data-rebar-part", "home-indicator");
    expect(kids[2]!).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "App home screen" })).toBeInTheDocument();
  });

  it("statusBar={false} drops the strip and the camera; homeIndicator={false} drops the bottom strip", () => {
    render(
      <DeviceFrame statusBar={false} homeIndicator={false}>
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="status-bar"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="home-indicator"]')).toBeNull();
  });

  it("tablet gets the strips too, but not a camera", () => {
    render(
      <DeviceFrame variant="tablet">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="status-bar"]')).not.toBeNull();
    expect(document.querySelector('[data-rebar-part="home-indicator"]')).not.toBeNull();
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
  });

  it("browser has neither strip", () => {
    render(
      <DeviceFrame variant="browser">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="status-bar"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="home-indicator"]')).toBeNull();
  });

  it("never crops: the stylesheet has no fixed ratio or object-fit cover for phone/tablet screens", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    const start = css.indexOf("/* DeviceFrame");
    const end = css.indexOf("/* FeatureShowcase");
    const block = css.slice(start, end);
    expect(block).not.toMatch(/aspect-ratio/);
    expect(block).not.toMatch(/object-fit:\s*cover/);
  });

  it("tablet has no notch or toolbar", () => {
    render(
      <DeviceFrame variant="tablet">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="toolbar"]')).toBeNull();
  });

  it("browser shows the title in a decorative toolbar", () => {
    render(
      <DeviceFrame variant="browser" title="athic.com">
        <img src="/x.png" alt="Dashboard" />
      </DeviceFrame>,
    );
    const toolbar = document.querySelector('[data-rebar-part="toolbar"]');
    expect(toolbar).toHaveAttribute("aria-hidden", "true");
    expect(toolbar).toHaveTextContent("athic.com");
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
  });

  it("ignores title for non-browser variants", () => {
    render(
      <DeviceFrame variant="phone" title="athic.com">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(screen.queryByText("athic.com")).toBeNull();
  });

  it("renders a caption as a figcaption", () => {
    render(
      <DeviceFrame caption="Home screen">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(screen.getByText("Home screen").tagName).toBe("FIGCAPTION");
  });
});
