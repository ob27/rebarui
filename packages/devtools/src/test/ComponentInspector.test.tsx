import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { ComponentInspector } from "../ComponentInspector";

describe("ComponentInspector", () => {
  it("renders nothing when disabled, even while hovering a real component", () => {
    document.body.innerHTML = `<div data-rebar-component="button">Click</div>`;
    render(<ComponentInspector enabled={false} />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);
    expect(document.querySelector('[data-rebar-component="devtools-inspector"]')).toBeNull();
  });

  it("shows component/part/state on hover when enabled", () => {
    document.body.innerHTML = `<div data-rebar-component="dialog" data-rebar-part="content" data-rebar-state="open">x</div>`;
    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);
    const tooltip = document.querySelector('[data-rebar-component="devtools-inspector"]')!;
    expect(tooltip).toHaveTextContent("dialog");
    expect(tooltip).toHaveTextContent("content");
    expect(tooltip).toHaveTextContent("open");
  });

  it("surfaces a placement-layer block path and item label when hovering DSL-rendered content", () => {
    document.body.innerHTML = `
      <div data-rebar-block-path="blocks[0].items[2]" data-rebar-block-item-label="Legacy API Migration">
        <span data-rebar-component="checkbox">Legacy API Migration</span>
      </div>
    `;
    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);
    const tooltip = document.querySelector('[data-rebar-component="devtools-inspector"]')!;
    expect(tooltip).toHaveTextContent("blocks[0].items[2]");
    expect(tooltip).toHaveTextContent("Legacy API Migration");
  });

  it("copies the block path to the clipboard when 'c' is pressed while hovering (not a click — the tooltip follows the cursor, so a click target would be unreachable)", async () => {
    document.body.innerHTML = `
      <div data-rebar-block-path="blocks[1].fields[0]">
        <span data-rebar-component="input">x</span>
      </div>
    `;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);

    await act(async () => {
      fireEvent.keyDown(document, { key: "c" });
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith("blocks[1].fields[0]");
  });

  it("ignores the 'c' hotkey while the developer is typing in a real input", async () => {
    document.body.innerHTML = `
      <div data-rebar-block-path="blocks[1].fields[0]">
        <span data-rebar-component="input">x</span>
      </div>
      <input id="real-input" />
    `;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);

    const realInput = document.getElementById("real-input")!;
    await act(async () => {
      fireEvent.keyDown(realInput, { key: "c" });
      await Promise.resolve();
    });

    expect(writeText).not.toHaveBeenCalled();
  });

  it("ignores the hotkey when combined with a modifier (e.g. Cmd+C for a real copy)", async () => {
    document.body.innerHTML = `
      <div data-rebar-block-path="blocks[1].fields[0]">
        <span data-rebar-component="input">x</span>
      </div>
    `;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);

    await act(async () => {
      fireEvent.keyDown(document, { key: "c", metaKey: true });
      await Promise.resolve();
    });

    expect(writeText).not.toHaveBeenCalled();
  });

  it("hides the path affordance when the hovered element isn't placement-layer output", () => {
    document.body.innerHTML = `<div data-rebar-component="button">Click</div>`;
    render(<ComponentInspector enabled />);
    fireEvent.mouseMove(document.body.querySelector("[data-rebar-component]")!);
    expect(document.querySelector(".rebar-devtools-inspector-path")).toBeNull();
  });
});
