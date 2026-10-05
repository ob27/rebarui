import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentWall } from "../components/AgentWall";
import type { AgentWallMember } from "../components/AgentWall";

afterEach(cleanup);

const MEMBERS: AgentWallMember[] = [
  { id: "a", name: "Barry", project: "Dm-Archive", status: "active", activity: "researching a pile wall" },
  { id: "b", name: "Alice", project: "Reports", status: "idle" },
  { id: "c", name: "Cora", project: "Reports", status: "stalled" },
  { id: "g", name: "Gus", status: "ghost" },
  { id: "d", name: "DSL Service", kind: "service", project: "Dm-Archive", status: "failure", activity: "DM-Archive DLS Worker Service" },
];

const names = () => within(screen.getByRole("list")).getAllByRole("listitem").map((li) => li.querySelector('[data-rebar-part="name"]')!.textContent);

describe("AgentWall", () => {
  it("renders every member and a count per status", () => {
    render(<AgentWall members={MEMBERS} />);
    expect(names()).toEqual(["Barry", "Alice", "Cora", "Gus", "DSL Service"]);
    expect(screen.getByRole("button", { name: "Ghost 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All 5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Failure 1" })).toBeInTheDocument();
  });

  it("filters by status, and a second click clears it", async () => {
    render(<AgentWall members={MEMBERS} />);
    await userEvent.click(screen.getByRole("button", { name: "Failure 1" }));
    expect(names()).toEqual(["DSL Service"]);
    expect(screen.getByRole("button", { name: "Failure 1" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Failure 1" }));
    expect(names()).toHaveLength(5);
  });

  it("dims instead of hiding when filterMode is dim", async () => {
    const { container } = render(<AgentWall members={MEMBERS} filterMode="dim" />);
    await userEvent.click(screen.getByRole("button", { name: "Failure 1" }));
    expect(names()).toHaveLength(5);
    expect(container.querySelectorAll("[data-rebar-dimmed]")).toHaveLength(4);
  });

  it("searches name, project and activity", async () => {
    render(<AgentWall members={MEMBERS} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search agents" }), "pile wall");
    expect(names()).toEqual(["Barry"]);
  });

  it("shows emptyText when nothing matches", async () => {
    render(<AgentWall members={MEMBERS} emptyText="Nobody here." />);
    await userEvent.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent("Nobody here.");
  });

  it("pages by columns x rows and goes back to page 1 when the filter changes", async () => {
    const many = Array.from({ length: 7 }, (_, i) => ({ id: `m${i}`, name: `Agent ${i + 1}`, status: "active" as const }));
    render(<AgentWall members={many} columns={2} rows={2} />);
    expect(names()).toEqual(["Agent 1", "Agent 2", "Agent 3", "Agent 4"]);
    await userEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(names()).toEqual(["Agent 5", "Agent 6", "Agent 7"]);
    await userEvent.click(screen.getByRole("button", { name: "Active 7" }));
    expect(names()).toEqual(["Agent 1", "Agent 2", "Agent 3", "Agent 4"]);
  });

  it("clamps the page when members shrink", () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ id: `m${i}`, name: `Agent ${i + 1}` }));
    const { rerender } = render(<AgentWall members={many} columns={2} rows={1} defaultPage={3} />);
    expect(names()).toEqual(["Agent 5"]);
    rerender(<AgentWall members={many.slice(0, 2)} columns={2} rows={1} defaultPage={3} />);
    expect(names()).toEqual(["Agent 1", "Agent 2"]);
  });

  it("selects a tile and toggles it off, uncontrolled", async () => {
    const onSelectedChange = vi.fn();
    render(<AgentWall members={MEMBERS} onSelectedChange={onSelectedChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Barry, Active Now" }));
    expect(screen.getByRole("button", { name: "Barry, Active Now" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Barry, Active Now" }));
    expect(onSelectedChange.mock.calls).toEqual([["a"], [null]]);
  });

  it("honours controlled selectedId and statusFilter", async () => {
    const onStatusFilterChange = vi.fn();
    render(<AgentWall members={MEMBERS} selectedId="c" statusFilter="all" onStatusFilterChange={onStatusFilterChange} />);
    expect(screen.getByRole("button", { name: "Cora, Stalled" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Idle 1" }));
    expect(onStatusFilterChange).toHaveBeenCalledWith("idle");
    expect(names()).toHaveLength(5); // controlled: the caller did not change the prop
  });

  it("renders the title and actions slots", () => {
    render(<AgentWall members={MEMBERS} title="AI Hive" actions={<a href="/join">Join this Hive</a>} />);
    expect(screen.getByText("AI Hive")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join this Hive" })).toBeInTheDocument();
  });
});
