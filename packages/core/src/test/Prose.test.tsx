import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Prose, Markdown } from "../components/Prose";
import { renderMarkdown } from "../markdown";

describe("Prose", () => {
  it("wraps content and defaults to md, default tone", () => {
    const { container } = render(<Prose><p>Hello</p></Prose>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-component", "prose");
    expect(root).toHaveAttribute("data-rebar-size", "md");
    expect(root).toHaveAttribute("data-rebar-tone", "default");
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("takes size, tone, maxWidth and as", () => {
    const { container } = render(
      <Prose as="article" size="lg" tone="inverse" maxWidth="50ch" data-x="1">
        x
      </Prose>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("ARTICLE");
    expect(root).toHaveAttribute("data-rebar-size", "lg");
    expect(root).toHaveAttribute("data-rebar-tone", "inverse");
    expect(root.style.getPropertyValue("--rebar-prose-max-width")).toBe("50ch");
    expect(root).toHaveAttribute("data-x", "1");
  });
});

describe("Markdown", () => {
  const SRC = [
    "## Your journal",
    "The journal is **encrypted** on your *device*. See [privacy](/privacy#journal) and `code`.",
    "",
    "- Your email",
    "- Your Masses",
    "",
    "1. Open Account",
    "2. Delete",
    "",
    "> Whose sins you shall forgive",
    "> — John 20:23",
    "",
    "---",
    "",
    "| Region | Used for |",
    "| --- | :---: |",
    "| Singapore | Ask replies |",
    "| US | Sync |",
  ].join("\n");

  it("renders headings, emphasis, links, code, lists, a quote with cite, a rule and a table inside Prose", () => {
    const { container } = render(<Markdown source={SRC} />);
    expect(container.firstElementChild).toHaveAttribute("data-rebar-component", "prose");
    expect(screen.getByRole("heading", { level: 2, name: "Your journal" })).toBeInTheDocument();
    expect(screen.getByText("encrypted").tagName).toBe("STRONG");
    expect(screen.getByText("device").tagName).toBe("EM");
    expect(screen.getByRole("link", { name: "privacy" })).toHaveAttribute("href", "/privacy#journal");
    expect(screen.getByText("code").tagName).toBe("CODE");
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    const quote = container.querySelector("blockquote") as HTMLElement;
    expect(quote.querySelector("cite")).toHaveTextContent("John 20:23");
    expect(quote).toHaveTextContent("Whose sins you shall forgive");
    expect(container.querySelector("hr")).not.toBeNull();
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Region", "Used for"]);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    expect(within(table).getByText("Ask replies")).toHaveStyle({ textAlign: "center" });
  });

  it("never passes raw HTML through", () => {
    const { container } = render(<Markdown source={'Hi <script>alert(1)</script> <img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("<script>alert(1)</script>");
  });

  it("renders javascript: and data: links as plain text", () => {
    const { container } = render(<Markdown source={"[bad](javascript:alert(1)) and [ok](https://example.com)"} />);
    expect(screen.queryByRole("link", { name: "bad" })).toBeNull();
    expect(container).toHaveTextContent("bad");
    expect(screen.getByRole("link", { name: "ok" })).toHaveAttribute("href", "https://example.com");
  });

  it("overrides nodes through components", () => {
    const Link = ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a href={href} data-router="1">
        {children}
      </a>
    );
    render(<Markdown source="[go](/x)" components={{ a: Link }} />);
    expect(screen.getByRole("link", { name: "go" })).toHaveAttribute("data-router", "1");
  });

  it("keeps paragraphs, ordinary quotes and a lone pipe line unchanged", () => {
    const { container } = render(<>{renderMarkdown("Plain | text\n\n> just a quote")}</>);
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelector("blockquote cite")).toBeNull();
    expect(container).toHaveTextContent("Plain | text");
  });
});
