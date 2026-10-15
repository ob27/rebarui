import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { DeviceStage } from "../components/DeviceStage";
import { DeviceFrame } from "../components/DeviceFrame";

const device = (
  <DeviceFrame>
    <img src="/x.png" alt="App screen" />
  </DeviceFrame>
);

const floats = [
  { id: "a", side: "start" as const, content: "Checked in", label: "Today" },
  { id: "b", side: "end" as const, content: "CCC 1374", top: "40%" },
];

describe("DeviceStage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("carries data-rebar attributes and forwards data-/aria- props", () => {
    render(
      <DeviceStage data-testid="stage" glow>
        {device}
      </DeviceStage>,
    );
    const root = screen.getByTestId("stage");
    expect(root).toHaveAttribute("data-rebar-component", "device-stage");
    expect(root).toHaveAttribute("data-rebar-glow", "true");
    expect(screen.getByRole("img", { name: "App screen" })).toBeInTheDocument();
  });

  it("renders the device before the floats, so reading order is the device then its details", () => {
    render(<DeviceStage floats={floats}>{device}</DeviceStage>);
    const area = document.querySelector('[data-rebar-part="area"]')!;
    const kids = Array.from(area.children);
    expect(kids[0]).toHaveAttribute("data-rebar-part", "device");
    expect(kids.slice(1).every((k) => k.getAttribute("data-rebar-part") === "float")).toBe(true);
  });

  it("renders floats as labelled groups whose text stays accessible (not aria-hidden)", () => {
    render(<DeviceStage floats={floats}>{device}</DeviceStage>);
    const group = screen.getByRole("group", { name: "Today" });
    expect(within(group).getByText("Checked in")).toBeVisible();
    expect(screen.getByRole("group", { name: "Related detail" })).toHaveTextContent("CCC 1374");
    expect(document.querySelector('[data-rebar-part="float"][aria-hidden]')).toBeNull();
  });

  it("exposes side, slot and the top offset (default 20%, then 62% for a second float on a side)", () => {
    render(
      <DeviceStage
        floats={[
          { id: "1", side: "end", content: "one" },
          { id: "2", side: "end", content: "two" },
          { id: "3", side: "start", content: "three", top: "10%" },
        ]}
      >
        {device}
      </DeviceStage>,
    );
    const [one, two, three] = Array.from(document.querySelectorAll<HTMLElement>('[data-rebar-part="float"]')) as [HTMLElement, HTMLElement, HTMLElement];
    expect(one.style.getPropertyValue("--rebar-device-stage-float-top")).toBe("20%");
    expect(two.style.getPropertyValue("--rebar-device-stage-float-top")).toBe("62%");
    expect(three.style.getPropertyValue("--rebar-device-stage-float-top")).toBe("10%");
    expect(one).toHaveAttribute("data-rebar-slot", "top-end");
    expect(two).toHaveAttribute("data-rebar-slot", "bottom-end");
    expect(three).toHaveAttribute("data-rebar-slot", "bottom-start");
  });

  it("renders at most four floats", () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ id: String(i), side: i % 2 ? ("end" as const) : ("start" as const), content: `f${i}` }));
    render(<DeviceStage floats={many}>{device}</DeviceStage>);
    expect(document.querySelectorAll('[data-rebar-part="float"]')).toHaveLength(4);
  });

  it("sets data-rebar-compact below 480px of stage width and clears it above", () => {
    let width = 320;
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => width });
    let trigger: () => void = () => {};
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: () => void) {
          trigger = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    render(
      <DeviceStage data-testid="stage" floats={floats}>
        {device}
      </DeviceStage>,
    );
    const root = screen.getByTestId("stage");
    expect(root).toHaveAttribute("data-rebar-compact", "true");
    expect(document.querySelector('[data-rebar-part="float"]')).toHaveAttribute("data-rebar-compact", "true");
    width = 900;
    act(() => trigger());
    expect(root).not.toHaveAttribute("data-rebar-compact");
    if (original) Object.defineProperty(HTMLElement.prototype, "clientWidth", original);
  });
});
