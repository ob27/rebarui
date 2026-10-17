import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockRenderer } from "../BlockRenderer";
import type { Construct } from "../schema";

afterEach(() => document.documentElement.style.removeProperty("--rebar-header-height"));

describe("filter-bar with pills, sort and a result count", () => {
  const blocks: Construct[] = [
    {
      type: "filter-bar",
      searchPlaceholder: "Search Perspectives…",
      pills: ["All", "Ethics", "Grace"],
      filterLabel: "Category",
      sortOptions: ["Newest", "Oldest"],
      resultCount: { count: 24, noun: "Perspective" },
    },
  ];

  it("renders the FilterBar parts", () => {
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByPlaceholderText("Search Perspectives…")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Category" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ethics" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveTextContent("Newest");
    expect(screen.getByRole("status")).toHaveTextContent("24 Perspectives");
    expect(container.querySelector('[data-rebar-placement-block="filter-bar"]')).not.toBeNull();
  });

  it("keeps the plain row when the new fields are absent", () => {
    render(<BlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Find", actionLabel: "New" }]} />);
    expect(screen.getByPlaceholderText("Find")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });
});

describe("site-header publishes --rebar-header-height", () => {
  const header: Construct = {
    type: "site-header",
    logo: { label: "Athic", href: "/" },
    items: [{ label: "About", href: "/about" }],
  };

  it("sets the variable on the document root and removes it on unmount", () => {
    const { unmount } = render(<BlockRenderer blocks={[header]} />);
    expect(document.documentElement.style.getPropertyValue("--rebar-header-height")).toMatch(/^\d+px$/);
    unmount();
    expect(document.documentElement.style.getPropertyValue("--rebar-header-height")).toBe("");
  });
});
