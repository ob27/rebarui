import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { getIconByName } from "../components/iconLookup";
import { CalendarIcon, EnterOutlined, HomeHeartIcon } from "../index";

describe("getIconByName", () => {
  it("resolves the short names a marketing site reaches for", () => {
    for (const name of ["calendar", "chat", "lock", "book", "heart", "user", "home", "search", "folder"]) {
      expect(getIconByName(name), name).toBeTypeOf("function");
    }
  });

  it("resolves exact export names and short forms to the same component", () => {
    expect(getIconByName("CalendarIcon")).toBe(CalendarIcon);
    expect(getIconByName("calendar")).toBe(CalendarIcon);
    expect(getIconByName("Calendar")).toBe(CalendarIcon);
    expect(getIconByName("home-heart")).toBe(HomeHeartIcon);
    expect(getIconByName("home_heart")).toBe(HomeHeartIcon);
  });

  it("finds Ant Design icons by their own name or the short form", () => {
    expect(getIconByName("EnterOutlined")).toBe(EnterOutlined);
    expect(getIconByName("enter")).toBe(EnterOutlined);
  });

  it("returns undefined for unknown or empty names instead of throwing", () => {
    expect(getIconByName("definitely-not-an-icon")).toBeUndefined();
    expect(getIconByName("")).toBeUndefined();
    expect(getIconByName(undefined)).toBeUndefined();
  });

  it("returns a component that renders a decorative svg", () => {
    const Icon = getIconByName("calendar")!;
    const { container } = render(<Icon />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
