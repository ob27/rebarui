import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImagePicker } from "../components/ImagePicker";

afterEach(cleanup);

const items = [
  { id: "a", src: "a.jpg", alt: "Cross at dusk", tags: ["Scripture"] },
  { id: "b", src: "b.jpg", alt: "Dove", tags: ["Scripture", "Saints"] },
  { id: "c", src: "c.jpg", alt: "Chalice", tags: ["Liturgy"] },
];

describe("ImagePicker", () => {
  it("renders one pressable tile per item with the alt as its name", () => {
    render(<ImagePicker items={items} data-testid="p" />);
    expect(screen.getByTestId("p")).toHaveAttribute("data-rebar-component", "image-picker");
    expect(screen.getByRole("button", { name: "Dove" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("controlled selection marks the tile and calls onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ImagePicker items={items} selectedId="b" onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: "Dove" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Chalice" }));
    expect(onSelect).toHaveBeenCalledWith(items[2]);
    // controlled: selection does not move until the parent says so
    expect(screen.getByRole("button", { name: "Dove" })).toHaveAttribute("aria-pressed", "true");
  });

  it("uncontrolled selection moves on press", async () => {
    const user = userEvent.setup();
    render(<ImagePicker items={items} defaultSelectedId="a" />);
    await user.click(screen.getByRole("button", { name: "Chalice" }));
    expect(screen.getByRole("button", { name: "Chalice" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Cross at dusk" })).toHaveAttribute("aria-pressed", "false");
  });

  it("busyId shows a spinner on that tile and ignores presses", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ImagePicker items={items} busyId="b" selectedId="b" onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: "Dove" })).toHaveAttribute("data-rebar-state", "busy");
    await user.click(screen.getByRole("button", { name: "Chalice" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("tag chips filter the grid and report the change", async () => {
    const onTagChange = vi.fn();
    const user = userEvent.setup();
    render(<ImagePicker items={items} tags={["Scripture", "Saints", "Liturgy"]} onTagChange={onTagChange} />);
    const tags = screen.getByRole("group", { name: "Filter by tag" });
    expect(within(tags).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(tags).getByRole("button", { name: "Saints" }));
    expect(onTagChange).toHaveBeenCalledWith("Saints");
    expect(screen.getByRole("button", { name: "Dove" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Chalice" })).toBeNull();
  });

  it("empty state offers Clear filter, which resets the tag", async () => {
    const user = userEvent.setup();
    render(<ImagePicker items={items.slice(0, 1)} tags={["Saints"]} defaultActiveTag="Saints" />);
    expect(screen.getByText("No images for “Saints”")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filter" }));
    expect(screen.getByRole("button", { name: "Cross at dusk" })).toBeInTheDocument();
  });

  it("loading renders skeleton tiles and no buttons for images", () => {
    const { container } = render(<ImagePicker items={[]} loading columns={4} />);
    expect(container.querySelectorAll("[data-rebar-skeleton]")).toHaveLength(12);
    expect(container.querySelector("[aria-busy='true']")).not.toBeNull();
  });

  it("error shows an alert with retry", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ImagePicker items={items} error="Couldn’t load covers" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn’t load covers");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("shape icon and columns are exposed as attributes", () => {
    render(<ImagePicker items={items} shape="icon" columns={4} data-testid="p" />);
    expect(screen.getByTestId("p")).toHaveAttribute("data-rebar-shape", "icon");
    expect(screen.getByTestId("p")).toHaveAttribute("data-rebar-columns", "4");
  });
});
