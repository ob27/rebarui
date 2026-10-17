import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ListItem } from "../components/List";
import { NavBar } from "../components/NavBar";
import { RebarLinkProvider } from "../components/linkAdapter";
import type { RenderLink } from "../components/linkAdapter";

const routerLink: RenderLink = ({ href, children, ...rest }) => (
  <a href={href} data-router="yes" {...(rest as object)}>
    {children}
  </a>
);

describe("RebarLinkProvider", () => {
  it("routes Button, Card, ListItem and Breadcrumb links through the provider adapter", () => {
    render(
      <RebarLinkProvider renderLink={routerLink}>
        <Button href="/a">Btn</Button>
        <Card href="/b">Card body</Card>
        <ul>
          <ListItem title="Row" href="/c" />
        </ul>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Here" }]} />
      </RebarLinkProvider>,
    );
    for (const href of ["/a", "/b", "/c", "/"]) {
      const el = document.querySelector(`a[href="${href}"]`);
      expect(el, href).not.toBeNull();
      expect(el!.getAttribute("data-router")).toBe("yes");
    }
  });

  it("routes NavBar links through the provider", () => {
    render(
      <RebarLinkProvider renderLink={routerLink}>
        <NavBar items={[{ label: "Docs", href: "/docs" }]} />
      </RebarLinkProvider>,
    );
    expect(document.querySelector('a[href="/docs"]')?.getAttribute("data-router")).toBe("yes");
  });

  it("lets an explicit renderLink prop win over the provider", () => {
    render(
      <RebarLinkProvider renderLink={routerLink}>
        <Button href="/x" renderLink={({ href, children }) => <a href={href} data-own="1">{children}</a>}>
          Own
        </Button>
      </RebarLinkProvider>,
    );
    const a = screen.getByText("Own").closest("a")!;
    expect(a.getAttribute("data-own")).toBe("1");
    expect(a.getAttribute("data-router")).toBeNull();
  });

  it("falls back to a plain anchor without a provider", () => {
    render(<Button href="/plain">Plain</Button>);
    expect(screen.getByText("Plain").closest("a")!.getAttribute("data-router")).toBeNull();
  });
});
