import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "../components/PageHeader";

describe("PageHeader", () => {
  it("renders kicker, h1, lede and meta", () => {
    render(<PageHeader kicker="Perspectives" title="Reflections" lede="Essays." meta={<span>6 min read</span>} />);
    expect(screen.getByRole("heading", { level: 1, name: "Reflections" })).toBeInTheDocument();
    expect(screen.getByText("Perspectives")).toBeInTheDocument();
    expect(screen.getByText("Essays.")).toBeInTheDocument();
    expect(screen.getByText("6 min read")).toBeInTheDocument();
  });

  it("renders breadcrumbs as a nav landmark with the current page", () => {
    render(
      <PageHeader
        title="Harvest"
        align="start"
        breadcrumbs={[{ label: "Athic", href: "/" }, { label: "Perspectives", href: "/p" }, { label: "Ethics" }]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Perspectives" })).toHaveAttribute("href", "/p");
    expect(screen.getByText("Ethics")).toHaveAttribute("aria-current", "page");
    expect(nav.closest("header")).toHaveAttribute("data-rebar-align", "start");
  });

  it("with a cover: decorative, flagged, and the title stays an h1", () => {
    const { container } = render(<PageHeader title="Motherhood" cover="/c.jpg" maxWidth="lg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-cover", "true");
    expect(root).toHaveAttribute("data-rebar-max-width", "lg");
    expect(root.querySelector('[data-rebar-part="cover"]')).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Motherhood");
  });

  it("defaults to centred, medium, no cover, no breadcrumbs", () => {
    const { container } = render(<PageHeader title="T" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-align", "center");
    expect(root).toHaveAttribute("data-rebar-max-width", "md");
    expect(root).toHaveAttribute("data-rebar-cover", "false");
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
