import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentTile } from "../components/AgentTile";
import { HoneycombCount, ModelIcon } from "../components/AgentTileMarks";

describe("AgentTile marks", () => {
  it("draws one hexagon per digit and caps at 5 digits", () => {
    const { container, rerender } = render(<HoneycombCount value={123} />);
    expect(container.querySelectorAll("svg")).toHaveLength(3);
    expect(screen.getByTitle("123 turns in the Hive")).toBeTruthy();
    rerender(<HoneycombCount value={123456} />);
    expect(container.querySelectorAll("svg")).toHaveLength(5);
    expect(container.textContent).toContain("+");
  });
  it("draws whole hexagons only: a fraction shows in the tooltip, not as a part-filled hexagon", () => {
    const { container, rerender } = render(<HoneycombCount value={12.35} />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(container.textContent).toBe("12");
    expect(container.querySelector('[data-rebar-part="turns-fraction"]')).toBeNull();
    expect(screen.getByTitle("12.4 production in the Hive")).toBeTruthy();
    rerender(<HoneycombCount value={0.15} />);
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.textContent).toBe("0");
    expect(screen.getByTitle("0.2 production in the Hive")).toBeTruthy();
    rerender(<HoneycombCount value={12.02} />);
    expect(screen.getByTitle("12 turns in the Hive")).toBeTruthy();
    rerender(<HoneycombCount value={12.5} title="Mine" />);
    expect(screen.getByTitle("Mine")).toBeTruthy();
    rerender(<HoneycombCount value={12.5} />);
    expect(screen.getByTitle("12.5 production in the Hive")).toBeTruthy();
  });
  it("titles the model icon with the model name, else the family", () => {
    const { rerender } = render(<ModelIcon family="claude" modelName="claude-haiku-4-5-20251001" />);
    expect(screen.getByTitle("claude-haiku-4-5-20251001")).toBeTruthy();
    rerender(<ModelIcon family="gemini" />);
    expect(screen.getByTitle("Gemini")).toBeTruthy();
  });
  it("shows the marks on agents only", () => {
    const { container, rerender } = render(<AgentTile name="Quill" modelFamily="qwen" turns={9} composing="human" />);
    expect(container.querySelector('[data-rebar-part="model"]')).toBeTruthy();
    expect(container.querySelector('[data-rebar-part="turns"]')).toBeTruthy();
    expect(container.querySelector('[data-rebar-part="composing"]')).toBeTruthy();
    rerender(<AgentTile name="Svc" kind="service" modelFamily="qwen" turns={9} composing="human" />);
    expect(container.querySelector('[data-rebar-part="model"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="turns"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="composing"]')).toBeNull();
  });
});
