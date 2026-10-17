import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollRail } from "../components/ScrollRail";

const items = [<a key="a" href="/a">A</a>, <a key="b" href="/b">B</a>];

describe("ScrollRail itemWidth, header and gap", () => {
  it("a number is px and sets both width variables", () => {
    render(
      <ScrollRail aria-label="Perspectives" itemWidth={280}>
        {items}
      </ScrollRail>,
    );
    const rail = screen.getByRole("region", { name: "Perspectives" });
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-item-width")).toBe("280px");
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-item-width-md")).toBe("280px");
    expect(rail).toHaveAttribute("data-rebar-item-width", "set");
  });

  it("accepts a CSS length and a responsive object", () => {
    const { rerender } = render(
      <ScrollRail aria-label="R" itemWidth="18rem">
        {items}
      </ScrollRail>,
    );
    expect(screen.getByRole("region").style.getPropertyValue("--rebar-scroll-rail-item-width")).toBe("18rem");
    rerender(
      <ScrollRail aria-label="R" itemWidth={{ base: 280, md: 320 }}>
        {items}
      </ScrollRail>,
    );
    const rail = screen.getByRole("region");
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-item-width")).toBe("280px");
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-item-width-md")).toBe("320px");
  });

  it("without itemWidth nothing changes", () => {
    render(<ScrollRail aria-label="R">{items}</ScrollRail>);
    const rail = screen.getByRole("region");
    expect(rail).not.toHaveAttribute("data-rebar-item-width");
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-item-width")).toBe("");
    expect(rail).toHaveAttribute("data-rebar-gap", "md");
  });

  it("a CSS-length gap becomes a custom property", () => {
    render(
      <ScrollRail aria-label="R" gap="12px">
        {items}
      </ScrollRail>,
    );
    const rail = screen.getByRole("region");
    expect(rail).toHaveAttribute("data-rebar-gap", "custom");
    expect(rail.style.getPropertyValue("--rebar-scroll-rail-gap")).toBe("12px");
  });

  it("puts the header above the rail and moves the buttons into it", () => {
    render(
      <ScrollRail aria-label="R" header={<h2>Perspectives</h2>}>
        {items}
      </ScrollRail>,
    );
    const header = document.querySelector('[data-rebar-part="header"]') as HTMLElement;
    expect(header).toContainElement(screen.getByRole("heading", { name: "Perspectives" }));
    expect(header).toContainElement(screen.getByRole("button", { name: "Next items" }));
    expect(document.querySelectorAll('[data-rebar-part="control"]')).toHaveLength(2);
  });

  it("controls={false} with a header renders no buttons", () => {
    render(
      <ScrollRail aria-label="R" header={<h2>H</h2>} controls={false}>
        {items}
      </ScrollRail>,
    );
    expect(screen.queryByRole("button", { name: "Next items" })).toBeNull();
  });
});
