import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Avatar } from "../components/Avatar";
import { Image } from "../components/Image";
import { ImagePicker } from "../components/ImagePicker";

afterEach(cleanup);

const items = [
  { id: "a", src: "a.jpg", alt: "Cross", tags: ["Scripture", "Old"] },
  { id: "b", src: "b.jpg", alt: "Dove", tags: ["Scripture", "Saints"] },
  { id: "c", src: "c.jpg", alt: "Chalice", tags: ["Liturgy"] },
  { id: "d", src: "d.jpg", alt: "Locked", tags: ["Liturgy"], disabled: true },
];
const names = () => screen.getAllByRole("button").filter((b) => b.getAttribute("data-rebar-part") === "tile").map((b) => b.getAttribute("aria-label"));

describe("ImagePicker multiTag", () => {
  const tags = ["Scripture", "Saints", "Old", "Liturgy"];
  it("toggles tags independently and requires every active tag by default", async () => {
    const user = userEvent.setup();
    const onActiveTagsChange = vi.fn();
    render(<ImagePicker items={items} tags={tags} multiTag onActiveTagsChange={onActiveTagsChange} />);
    await user.click(screen.getByRole("button", { name: "Scripture" }));
    expect(names()).toEqual(["Cross", "Dove"]);
    await user.click(screen.getByRole("button", { name: "Saints" }));
    expect(names()).toEqual(["Dove"]);
    expect(onActiveTagsChange).toHaveBeenLastCalledWith(["Scripture", "Saints"]);
    expect(screen.getByRole("button", { name: "Scripture" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Saints" }));
    expect(names()).toEqual(["Cross", "Dove"]);
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(names()).toHaveLength(4);
  });
  it("tagMatch=any matches items carrying any active tag; a toggled-off tag untoggles", async () => {
    const user = userEvent.setup();
    render(<ImagePicker items={items} tags={tags} multiTag tagMatch="any" defaultActiveTags={["Saints", "Liturgy"]} />);
    expect(names()).toEqual(["Dove", "Chalice", "Locked"]);
    await user.click(screen.getByRole("button", { name: "Liturgy" }));
    expect(names()).toEqual(["Dove"]);
  });
  it("single-tag mode is unchanged", async () => {
    const user = userEvent.setup();
    render(<ImagePicker items={items} tags={tags} />);
    await user.click(screen.getByRole("button", { name: "Scripture" }));
    await user.click(screen.getByRole("button", { name: "Saints" }));
    expect(names()).toEqual(["Dove"]);
  });
});

describe("ImagePicker disabled", () => {
  it("picker-level disabled ignores presses and chips", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ImagePicker items={items} tags={["Liturgy"]} disabled onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Dove" }));
    await user.click(screen.getByRole("button", { name: "Liturgy" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Dove" })).toHaveAttribute("aria-disabled", "true");
    expect(names()).toHaveLength(4);
  });
  it("an item-level disabled tile is skipped while the others work", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ImagePicker items={items} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Locked" }));
    expect(onSelect).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Dove" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
  it("each tile is named by its alt", () => {
    render(<ImagePicker items={items} />);
    expect(screen.getByRole("button", { name: "Chalice" })).toBeInTheDocument();
  });
});

describe("Image empty state with fallbackColor", () => {
  it("renders only the tint, no label, when fallbackColor is set and there is no src", () => {
    render(<Image alt="Cover" fallbackColor="#ccc" />);
    const empty = document.querySelector('[data-rebar-part="empty"]')!;
    expect(empty).toHaveAttribute("data-rebar-bare", "true");
    expect(screen.queryByText("No image")).toBeNull();
    expect(document.querySelector(".rebar-image")).toHaveAttribute("data-rebar-image-tinted", "true");
    expect(screen.getByRole("img", { name: "Cover" })).toBeInTheDocument();
  });
  it("showPlaceholderLabel keeps the labelled placeholder", () => {
    render(<Image alt="Cover" fallbackColor="#ccc" showPlaceholderLabel />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });
  it("without fallbackColor the default empty state is unchanged", () => {
    render(<Image alt="Cover" />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });
});

describe("Avatar thumbSrc", () => {
  it("renders a decorative blurred thumb while the image loads, and hides initials behind it", () => {
    render(<Avatar src="/full.jpg" thumbSrc="/tiny.jpg" fallback="AB" data-testid="av" />);
    const thumb = document.querySelector('[data-rebar-part="thumb"]') as HTMLImageElement;
    expect(thumb).not.toBeNull();
    expect(thumb.getAttribute("src")).toBe("/tiny.jpg");
    expect(thumb).toHaveAttribute("aria-hidden", "true");
    expect(thumb.getAttribute("alt")).toBe("");
    expect(screen.getByTestId("av")).toHaveAttribute("data-rebar-thumb", "blur");
  });
  it("without thumbSrc nothing changes", () => {
    render(<Avatar src="/full.jpg" fallback="AB" data-testid="av" />);
    expect(document.querySelector('[data-rebar-part="thumb"]')).toBeNull();
    expect(screen.getByTestId("av")).not.toHaveAttribute("data-rebar-thumb");
  });
});
