import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentTile } from "../components/AgentTile";
import { agentPersona } from "../components/agentPersona";

afterEach(cleanup);

describe("AgentTile", () => {
  it("shows the name, project, status label and activity", () => {
    render(<AgentTile name="Barry" project="Dm-Archive > Worker" status="active" activity="researching a pile wall" />);
    expect(screen.getByText("Barry")).toBeInTheDocument();
    expect(screen.getByText("Dm-Archive > Worker")).toBeInTheDocument();
    expect(screen.getByText("Active Now")).toBeInTheDocument();
    expect(screen.getByText("researching a pile wall")).toBeInTheDocument();
  });

  it("lets statusLabel override the default text", () => {
    render(<AgentTile name="Barry" status="idle" statusLabel="Idle 30mins" />);
    expect(screen.getByText("Idle 30mins")).toBeInTheDocument();
  });

  it("mirrors status, kind and dimmed onto data attributes", () => {
    const { container, rerender } = render(<AgentTile name="DSL Service" kind="service" status="failure" dimmed />);
    const root = container.querySelector('[data-rebar-component="agent-tile"]')!;
    expect(root).toHaveAttribute("data-rebar-status", "failure");
    expect(root).toHaveAttribute("data-rebar-kind", "service");
    expect(root).toHaveAttribute("data-rebar-dimmed");
    rerender(<AgentTile name="DSL Service" kind="service" status="failure" />);
    expect(root).not.toHaveAttribute("data-rebar-dimmed");
  });

  it("is not a control without onSelect", () => {
    render(<AgentTile name="Barry" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is a button with onSelect, operable by click, Enter and Space", async () => {
    const onSelect = vi.fn();
    render(<AgentTile name="Barry" status="active" onSelect={onSelect} selected />);
    const tile = screen.getByRole("button", { name: "Barry, Active Now" });
    expect(tile).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(tile);
    tile.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it("labels a ghost as a ghost, not a failure", () => {
    const { container } = render(<AgentTile name="Barry" status="ghost" />);
    expect(screen.getByText("Ghost")).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-status", "ghost");
  });

  it("wears Strato for a failure, Spark for a service and Chorus for an LLM agent", () => {
    expect(agentPersona("agent", "active")).toBe("chorus");
    expect(agentPersona("agent", "ghost")).toBe("chorus");
    expect(agentPersona("service", "active")).toBe("spark");
    expect(agentPersona("service", "failure")).toBe("strato");
    expect(agentPersona("agent", "failure")).toBe("strato");
    const { container } = render(<AgentTile name="DSL Service" kind="service" status="failure" />);
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-persona", "strato");
  });

  it("tints only the orb with hue-rotate, and only when a hue is given", () => {
    const { container, rerender } = render(<AgentTile name="Index Worker" kind="service" status="failure" persona="strato" hue={200} orb="css" />);
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-persona", "strato");
    expect(container.querySelector('[data-rebar-part="orb"]')).toHaveStyle({ filter: "hue-rotate(200deg)" });
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).not.toHaveStyle({ filter: "hue-rotate(200deg)" });
    rerender(<AgentTile name="Index Worker" kind="service" orb="css" />);
    expect((container.querySelector('[data-rebar-part="orb"]') as HTMLElement).style.filter).toBe("");
    rerender(<AgentTile name="Barry" look="avatar" hue={90} />);
    expect((container.querySelector('[data-rebar-part="orb"]') as HTMLElement).style.filter).toBe("");
  });

  it("draws Spark as the original canvas metaball orb (AssistantOrb without a persona), coloured from the hue instead of rotated", () => {
    const { container } = render(<AgentTile name="DSL Service" kind="service" persona="spark" hue={200} />);
    const orb = container.querySelector('[data-rebar-part="orb"]') as HTMLElement;
    expect(orb).toHaveAttribute("data-rebar-live");
    expect(orb.querySelector("canvas")).not.toBeNull();
    expect(orb.style.filter).toBe("");
  });

  it("lets an explicit persona override the rule", () => {
    const { container } = render(<AgentTile name="Barry" persona="spark" />);
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-persona", "spark");
  });

  it("look=\"avatar\" shows Rebar's Avatar (illustrated portrait, picked from the name) for an agent instead of an orb", () => {
    // jsdom never loads images, so the portrait itself (Avatar's own tests cover that it is deterministic) is not checked here.
    const { container } = render(<AgentTile name="Barry" look="avatar" />);
    expect(container.querySelector('[data-rebar-component="avatar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-look", "avatar");
    expect(container.querySelector('[data-rebar-part="orb"]')).not.toHaveAttribute("data-rebar-live");
  });

  it("a service keeps its orb in avatar look, and the default look is the orb", () => {
    const { container, rerender } = render(<AgentTile name="DSL Service" kind="service" look="avatar" />);
    expect(container.querySelector('[data-rebar-component="avatar"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-rebar-component="agent-tile"]')).toHaveAttribute("data-rebar-look", "orb");
    rerender(<AgentTile name="Barry" />);
    expect(container.querySelector('[data-rebar-component="avatar"]')).not.toBeInTheDocument();
  });

  it("explains a status: the reason is the status's hover title, so it is never a mystery", () => {
    render(<AgentTile name="Tom" status="stalled" statusReason="Started a task 7 min ago and has not reported finishing since." />);
    expect(screen.getByText("Stalled").closest('[data-rebar-part="status"]')).toHaveAttribute("title", "Started a task 7 min ago and has not reported finishing since.");
  });
});
